from datetime import date

from pydantic import BaseModel


class IndiceItem(BaseModel):
    date: date
    lib_zone: str
    code_zone: int
    qualificatif: str
    type: str
    source: str


class IndicePage(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[IndiceItem]
