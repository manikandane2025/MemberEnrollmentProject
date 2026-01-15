from datetime import datetime
from typing import Optional
from uuid import uuid4
from sqlmodel import SQLModel, Field


class Member(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    first_name: str
    last_name: str
    dob: str
    ssn_last4: str
    email: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    zip_code: str
    status: str = "DRAFT"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
