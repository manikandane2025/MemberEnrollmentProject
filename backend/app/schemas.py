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
    created_at: str
    updated_at: str
