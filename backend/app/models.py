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
    identity_status: str = "PENDING"
    identity_attempts: int = 0
    identity_last_checked: Optional[datetime] = None
    identity_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class IdentityAudit(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    result: str
    reason: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
