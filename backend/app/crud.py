from datetime import datetime
from sqlmodel import Session, select
from .models import Member, IdentityAudit
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


def run_identity_check(session: Session, member: Member) -> tuple[str, int, str]:
    max_attempts = 3
    if member.identity_attempts >= max_attempts:
        result = "FAILED"
        reason = "Maximum attempts reached"
    else:
        member.identity_attempts += 1
        if not member.dob or len(member.ssn_last4) != 4:
            result = "FAILED"
            reason = "Missing DOB or SSN"
        elif member.ssn_last4 == "0000":
            result = "FAILED"
            reason = "SSN failed validation"
        elif member.ssn_last4.startswith("9"):
            result = "PARTIAL"
            reason = "Partial match: manual review required"
        else:
            result = "VERIFIED"
            reason = "Identity verified"

    member.identity_status = result
    member.identity_last_checked = datetime.utcnow()
    member.identity_notes = reason
    session.add(member)
    session.commit()
    session.refresh(member)

    audit = IdentityAudit(
        member_id=member.id,
        result=result,
        reason=reason
    )
    session.add(audit)
    session.commit()

    return result, member.identity_attempts, reason


def list_identity_audits(session: Session, member_id: str) -> list[IdentityAudit]:
    statement = select(IdentityAudit).where(IdentityAudit.member_id == member_id).order_by(IdentityAudit.created_at.desc())
    return list(session.exec(statement).all())
