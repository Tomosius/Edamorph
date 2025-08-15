from __future__ import annotations
from pathlib import Path
from typing import Dict, Tuple, Callable
import pyarrow as pa

from .io_csv import load_csv

Loader = Callable[[Path], Tuple[pa.Table, object]]

HANDLERS: Dict[str, Loader] = {
    ".csv": load_csv,
    ".tsv": load_csv,      # same loader; detects delimiter by ext/option

}