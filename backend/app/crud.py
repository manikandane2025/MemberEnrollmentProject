from datetime import datetime
from sqlmodel import Session, select
from .models import Member, IdentityAudit, EligibilityAudit, Plan, MemberPlan
from .schemas import MemberCreate, MemberUpdate, PlanCreate


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


def run_eligibility_check(session: Session, member: Member) -> tuple[str, str, int, str]:
    max_attempts = 3
    if member.eligibility_attempts >= max_attempts:
        result = "FAILED"
        code = "ELG-99"
        reason = "Maximum attempts reached"
    else:
        member.eligibility_attempts += 1
        zip_code = member.zip_code or ""
        if zip_code.endswith("000"):
            result = "TIMEOUT"
            code = "ELG-98"
            reason = "Eligibility service timeout"
        elif zip_code.endswith("999"):
            result = "INELIGIBLE"
            code = "ELG-02"
            reason = "Plan not available in region"
        elif zip_code.startswith("8"):
            result = "REVIEW"
            code = "ELG-01"
            reason = "Partial match: manual review required"
        else:
            result = "ELIGIBLE"
            code = "ELG-00"
            reason = "Eligible"

    member.eligibility_status = result
    member.eligibility_code = code
    member.eligibility_last_checked = datetime.utcnow()
    member.eligibility_notes = reason
    session.add(member)
    session.commit()
    session.refresh(member)

    audit = EligibilityAudit(
        member_id=member.id,
        result=result,
        code=code,
        reason=reason
    )
    session.add(audit)
    session.commit()

    return result, code, member.eligibility_attempts, reason


def list_eligibility_audits(session: Session, member_id: str) -> list[EligibilityAudit]:
    statement = select(EligibilityAudit).where(EligibilityAudit.member_id == member_id).order_by(EligibilityAudit.created_at.desc())
    return list(session.exec(statement).all())


def seed_plans(session: Session) -> None:
    if session.exec(select(Plan)).first():
        return
    plans = [
        Plan(
            name="Silver Value",
            tier="Silver",
            premium=320.0,
            deductible=2500.0,
            oop_max=6500.0,
            coverage_summary="Balanced coverage with standard network access.",
            network="Standard PPO",
        ),
        Plan(
            name="Gold Advantage",
            tier="Gold",
            premium=420.0,
            deductible=1500.0,
            oop_max=5000.0,
            coverage_summary="Lower deductible with expanded specialist coverage.",
            network="Expanded PPO",
        ),
        Plan(
            name="Bronze Saver",
            tier="Bronze",
            premium=250.0,
            deductible=4500.0,
            oop_max=7800.0,
            coverage_summary="Lowest premium with higher deductible.",
            network="Value HMO",
        ),
        Plan(
            name="Platinum Elite",
            tier="Platinum",
            premium=560.0,
            deductible=800.0,
            oop_max=3500.0,
            coverage_summary="Premium coverage with minimal out-of-pocket costs.",
            network="Elite PPO",
        ),
    ]
    session.add_all(plans)
    session.commit()


def list_plans(session: Session, tier: str | None = None) -> list[Plan]:
    statement = select(Plan).where(Plan.active == True)
    if tier:
        statement = statement.where(Plan.tier == tier)
    return list(session.exec(statement).all())


def create_plan(session: Session, data: PlanCreate) -> Plan:
    plan = Plan(**data.model_dump())
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def select_member_plan(session: Session, member: Member, plan_id: str) -> MemberPlan:
    existing = session.exec(
        select(MemberPlan).where(MemberPlan.member_id == member.id)
    ).first()
    if existing:
        existing.plan_id = plan_id
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    selection = MemberPlan(member_id=member.id, plan_id=plan_id)
    session.add(selection)
    session.commit()
    session.refresh(selection)
    return selection


def get_member_plan(session: Session, member_id: str) -> MemberPlan | None:
    return session.exec(select(MemberPlan).where(MemberPlan.member_id == member_id)).first()
