import json
from pathlib import Path
from edamorph_core.io.file_import import load_table  # Your Arrow loader

class Api:
    """Backend API for PyWebView to handle data processing requests."""

    def import_file(self, path: str) -> str:
        """
        Import a file into an Arrow Table and return metadata as JSON.
        This can be called directly from the JavaScript frontend.

        Parameters
        ----------
        path : str
            Path to the file to be imported.

        Returns
        -------
        str
            JSON-encoded metadata about the imported file.
        """
        try:
            table, report = load_table(Path(path))
            # For now, only send metadata back to the UI
            return json.dumps(report)
        except Exception as e:
            return json.dumps({"error": str(e)})