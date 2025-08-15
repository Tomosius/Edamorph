# edamorph_core/io/file_import.py
"""
README
======
Purpose
-------
Load any **supported** file into an Apache Arrow `pa.Table` by delegating
to a **pluggable registry** of format-specific loaders.

This module acts as the **single entry point** for file ingestion in
EdaMorph. It does *not* parse files itself; instead, it looks up a loader
function in a registry (a simple dict that maps file extensions to callables)
and invokes it. Each loader returns an Arrow `Table` and a small
`ImportReport` describing what happened during import.

Why a registry?
---------------
- **Extensibility**: add support for a new format by creating a new loader
  (e.g., `io_jsonl.py`) and registering it in `file_types/__init__.py`
  without touching this orchestrator.
- **Separation of concerns**: parsing logic lives in per-format modules,
  while the orchestrator stays tiny and stable.
- **Consistency**: every loader returns the same `(table, report)` shape,
  so UI/logging code does not care which format was used.

Usage
-----
>>> from edamorph_core.io.file_import import load_table
>>> tbl, rep = load_table("data/file.csv")
>>> rep
ImportReport(format='csv', path='data/file.csv', rows=123, cols=12,
             notes=['CSV streamed (block=1048576, batch=64000)'])

Design goals
------------
- Small public API: a single `load_table(...)` function.
- Helpful, structured metadata via `ImportReport`.
- Optional column-name de-duplication to avoid downstream surprises.
- Clear, actionable error messages.

Adding a new format
-------------------
1) Implement a loader: `def load_xyz(p: Path) -> (pa.Table, ImportReport)`.
2) Register it in `edamorph_core/io/file_types/__init__.py`:
      HANDLERS[".xyz"] = load_xyz
3) Done. `load_table("file.xyz")` now works.

Line-length policy
------------------
Doc/comments aim for ≤72 chars; code aims for ≤79 chars.

"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, List, Tuple

import pyarrow as pa

# Import the registry of loader functions. The registry is defined in the
# package `file_types` alongside the individual format loaders.
# Example:
#   HANDLERS = {
#       ".csv": load_csv,
#       ".tsv": load_csv,
#       ".parquet": load_parquet,
#       ".feather": load_feather,
#       ".xlsx": load_excel,
#   }
from edamorph_core.io.file_types import HANDLERS # {ext: callable(Path) -> (Table, Report)}


# ------------------------------- Types ------------------------------------

@dataclass
class ImportReport:
    """
    Structured metadata describing how a file was imported.

    Attributes
    ----------
    format : str
        Short label for the detected/handled format
        (e.g., 'csv', 'tsv', 'parquet', 'feather', 'excel').
    path : str
        Canonical (string) path to the source file.
    rows : int
        Number of rows in the resulting table. For purely streaming
        scenarios a loader may set this to 0 if unknown.
    cols : int
        Number of columns in the resulting table.
    notes : List[str]
        Free-form detail messages (e.g., 'memory_map', 'deduped columns').
    """
    format: str
    path: str
    rows: int
    cols: int
    notes: List[str]


# A loader takes a `Path` and returns `(pa.Table, ImportReport)`.
LoaderFn = Callable[[Path], Tuple[pa.Table, ImportReport]]


# ----------------------------- Public API ---------------------------------

def load_table(path: str | Path) -> Tuple[pa.Table, ImportReport]:
    """
    Load a file into an Arrow `Table` using the pluggable registry.

    This function:
      1) Validates the path exists.
      2) Selects a loader by file extension via `HANDLERS`.
      3) Invokes the loader to obtain `(table, report)`.
      4) Optionally de-duplicates column names to avoid collisions.

    Parameters
    ----------
    path : str | Path
        File path to load.

    Returns
    -------
    (table, report) : (pa.Table, ImportReport)
        `table`  : Apache Arrow table with file contents.
        `report` : Metadata describing how the import was performed.

    Raises
    ------
    FileNotFoundError
        If the path does not exist.
    ValueError
        If no loader is registered for the file extension.

    Notes
    -----
    - Column-name de-duplication is performed here so loaders can remain
      focused on parsing. If you prefer to disable this behavior, you can
      remove or guard the dedupe block below.
    - The registry uses file **extensions** as keys. If you need content-
      based routing (magic bytes), implement that inside the loader for
      the relevant extension or create a dedicated "sniffing" loader.
    """
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"File not found: {p}")

    ext = p.suffix.lower()
    if ext not in HANDLERS:
        raise ValueError(f"Unsupported file type: {ext}")

    # Delegate to the format-specific loader.
    table, report = HANDLERS[ext](p)

    # Optional: ensure unique column names to prevent downstream issues.
    # Example: CSV headers may contain duplicates ('name', 'name', ...).
    names = table.column_names
    if len(names) != len(set(names)):
        seen: Dict[str, int] = {}
        new: List[str] = []
        for c in names:
            k = seen.get(c, 0)
            new.append(c if k == 0 else f"{c}_{k}")
            seen[c] = k + 1
        table = table.rename_columns(new)
        # Append a note so callers can surface this in logs/UI if desired.
        if isinstance(report, ImportReport):
            report.notes.append("deduped column names")
        elif isinstance(report, dict):  # defensive, if a dict was returned
            report.setdefault("notes", []).append("deduped column names")

    return table, report