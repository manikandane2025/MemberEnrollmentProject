from typing import Optional
from pydantic import BaseModel


class MemberCreate(BaseModel):
    first_name: str
    last_name: str
    dob: str
    ssn: str
    email: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    zip_code: str


class MemberUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[str] = None
    ssn: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    status: Optional[str] = None


class MemberRead(BaseModel):
    id: str
    first_name: str
    last_name: str
    dob: str
    masked_ssn: str
    email: str
    phone: str
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: str
    zip_code: str
    status: str
    identity_status: str
    identity_attempts: int
    identity_last_checked: Optional[str]
    identity_notes: Optional[str]
    eligibility_status: str
    eligibility_code: Optional[str]
    eligibility_attempts: int
    eligibility_last_checked: Optional[str]
    eligibility_notes: Optional[str]
    created_at: str
    updated_at: str


class IdentityCheckResult(BaseModel):
    status: str
    attempts: int
    reason: str


class IdentityAuditRead(BaseModel):
    id: str
    member_id: str
    result: str
    reason: str
    created_at: str


class EligibilityCheckResult(BaseModel):
    status: str
    code: str
    attempts: int
    reason: str


class EligibilityAuditRead(BaseModel):
    id: str
    member_id: str
    result: str
    code: str
    reason: str
    created_at: str


class PlanCreate(BaseModel):
    name: str
    tier: str
    premium: float
    deductible: float
    oop_max: float
    coverage_summary: str
    network: str
    active: bool = True


class PlanRead(BaseModel):
    id: str
    name: str
    tier: str
    premium: float
    deductible: float
    oop_max: float
    coverage_summary: str
    network: str
    active: bool


class MemberPlanRead(BaseModel):
    id: str
    member_id: str
    plan_id: str
    selected_at: str


class DocumentRead(BaseModel):
    id: str
    member_id: str
    filename: str
    content_type: str
    size_bytes: int
    created_at: str
