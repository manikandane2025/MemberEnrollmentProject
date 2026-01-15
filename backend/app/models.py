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
    eligibility_status: str = "PENDING"
    eligibility_code: Optional[str] = None
    eligibility_attempts: int = 0
    eligibility_last_checked: Optional[datetime] = None
    eligibility_notes: Optional[str] = None
    email_opt_in: bool = False
    sms_opt_in: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class IdentityAudit(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    result: str
    reason: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EligibilityAudit(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    result: str
    code: str
    reason: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Plan(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    name: str
    tier: str
    premium: float
    deductible: float
    oop_max: float
    coverage_summary: str
    network: str
    active: bool = True


class MemberPlan(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    plan_id: str = Field(index=True)
    selected_at: datetime = Field(default_factory=datetime.utcnow)


class Document(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    filename: str
    content_type: str
    size_bytes: int
    stored_path: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationAudit(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True, index=True)
    member_id: str = Field(index=True)
    channel: str
    template_id: str
    status: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
