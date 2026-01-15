from datetime import datetime
from sqlmodel import Session, select
from .models import Member
from .schemas import MemberCreate, MemberUpdate


def mask_ssn(last4: str) -> str:
    return f"***-**-{last4}"


def create_member(session: Session, data: MemberCreate) -> Member:
    last4 = data.ssn[-4:] if data.ssn else "0000"
    member = Member(
        first_name=data.first_name,
        last_name=data.last_name,
        dob=data.dob,
        ssn_last4=last4,
        email=data.email,
        phone=data.phone,
        address_line1=data.address_line1,
        address_line2=data.address_line2,
        city=data.city,
        state=data.state,
        zip_code=data.zip_code,
        status="DRAFT"
    )
    session.add(member)
    session.commit()
    session.refresh(member)
    return member


def list_members(session: Session) -> list[Member]:
    return list(session.exec(select(Member)).all())


def get_member(session: Session, member_id: str) -> Member | None:
    return session.get(Member, member_id)


def update_member(session: Session, member: Member, data: MemberUpdate) -> Member:
    payload = data.model_dump(exclude_unset=True)
    if "ssn" in payload:
        ssn_val = payload.pop("ssn")
        if ssn_val:
            member.ssn_last4 = ssn_val[-4:]
    for key, value in payload.items():
        setattr(member, key, value)
    member.updated_at = datetime.utcnow()
    session.add(member)
    session.commit()
    session.refresh(member)
    return member


def delete_member(session: Session, member: Member) -> None:
    session.delete(member)
    session.commit()
