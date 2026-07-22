import os
from datetime import date
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from db import con
from models import IndicePage

load_dotenv()

ALLOW_ORIGINS = os.environ.get("ALLOW_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="AIRPL REST API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/indices", response_model=IndicePage)
def get_indices(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    date_from: date | None = None,
    date_to: date | None = None,
    sort: Literal["asc", "desc"] = "asc",
):
    cur = con.cursor()

    conditions = []
    params: list = []

    if date_from is not None:
        conditions.append("date >= ?")
        params.append(date_from)
    if date_to is not None:
        conditions.append("date <= ?")
        params.append(date_to)

    where_sql = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    offset = (page - 1) * page_size

    total_row = cur.execute(f"SELECT COUNT(*) FROM indices {where_sql}", params).fetchone()
    assert total_row is not None
    total = total_row[0]

    rows = cur.execute(
        f"""
        SELECT date, lib_zone, code_zone, qualificatif, type, source
        FROM indices
        {where_sql}
        ORDER BY date {sort}
        LIMIT ? OFFSET ?
        """,
        params + [page_size, offset],
    ).fetchall()

    items = [
        {
            "date": r[0],
            "lib_zone": r[1],
            "code_zone": r[2],
            "qualificatif": r[3],
            "type": r[4],
            "source": r[5],
        }
        for r in rows
    ]

    return {"total": total, "page": page, "page_size": page_size, "items": items}
