"""
CSV/TSV → Arrow Table Loader (Simplest Version)
===============================================

Purpose
-------
Loads a CSV or TSV file into an Apache Arrow `pa.Table` in one step
using `pyarrow.csv.read_csv`.

Notes
-----
- Reads the *entire file into memory* at once.
- No batching, no streaming.
- Uses PyArrow's default internal block size.

Usage
-----
from pathlib import Path
tbl, report = load_csv(Path("data.csv"))
print(report)
"""

from __future__ import annotations
from pathlib import Path
from typing import Tuple, Dict, Any
import pyarrow as pa
import pyarrow.csv as pacsv


def load_csv(path: Path) -> Tuple[pa.Table, Dict[str, Any]]:
    """
    Load a CSV or TSV file into an Apache Arrow Table.

    Parameters
    ----------
    path : Path
        Path to the CSV/TSV file.

    Returns
    -------
    table : pa.Table
        Fully materialized Arrow Table.
    report : Dict[str, Any]
        Metadata about the import:
        - format : str ("csv" or "tsv")
        - path   : str (absolute file path)
        - rows   : int (row count)
        - cols   : int (column count)
        - notes  : list[str] (details of load process)

    Raises
    ------
    FileNotFoundError
        If the file doesn't exist.
    ValueError
        If parsing fails.
    """
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    delim = "\t" if path.suffix.lower() == ".tsv" else ","

    try:
        table = pacsv.read_csv(
            path,
            parse_options=pacsv.ParseOptions(delimiter=delim),
            convert_options=pacsv.ConvertOptions(strings_can_be_null=True),
        )
    except Exception as exc:
        raise ValueError(f"Failed to read CSV: {path} ({exc})") from exc

    report = {
        "format": "tsv" if delim == "\t" else "csv",
        "path": str(path),
        "rows": table.num_rows,
        "cols": table.num_columns,
        "notes": ["CSV read in one shot (PyArrow defaults)"],
    }

    return table, report