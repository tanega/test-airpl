from pathlib import Path

import duckdb

CSV_PATH = Path(__file__).parent / "data" / "indice_ATMO_2026-1-1_2026-7-22_commune.csv"

con = duckdb.connect()
con.execute(f"CREATE VIEW indices AS SELECT * FROM read_csv_auto('{CSV_PATH.as_posix()}')")
