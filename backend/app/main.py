from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from .db import engine, init_db
from .schemas import MemberCreate, MemberUpdate, MemberRead, IdentityCheckResult, IdentityAuditRead
from .crud import (
    create_member,
    list_members,
    get_member,
    update_member,
    delete_member,
    mask_ssn,
    run_identity_check,
    list_identity_audits,
)

app = FastAPI(title="Member Enrollment API")

app.add_middleware(
    CORSMiddleware,
        allow_origins=[
        "http://localhost:3001",
        "http://localhost:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def to_read(member) -> MemberRead:
    return MemberRead(
        id=member.id,
        first_name=member.first_name,
        last_name=member.last_name,
        dob=member.dob,
        masked_ssn=mask_ssn(member.ssn_last4),
        email=member.email,
        phone=member.phone,
        address_line1=member.address_line1,
        address_line2=member.address_line2,
        city=member.city,
        state=member.state,
        zip_code=member.zip_code,
        status=member.status,
        identity_status=member.identity_status,
        identity_attempts=member.identity_attempts,
        identity_last_checked=member.identity_last_checked.isoformat() if member.identity_last_checked else None,
        identity_notes=member.identity_notes,
        created_at=member.created_at.isoformat(),
        updated_at=member.updated_at.isoformat()
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/members", response_model=MemberRead)
def create_member_api(payload: MemberCreate):
    with Session(engine) as session:
        member = create_member(session, payload)
        return to_read(member)


@app.get("/members", response_model=list[MemberRead])
def list_members_api():
    with Session(engine) as session:
        members = list_members(session)
        return [to_read(m) for m in members]


@app.get("/members/{member_id}", response_model=MemberRead)
def get_member_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        return to_read(member)


@app.put("/members/{member_id}", response_model=MemberRead)
def update_member_api(member_id: str, payload: MemberUpdate):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        member = update_member(session, member, payload)
        return to_read(member)


@app.delete("/members/{member_id}")
def delete_member_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        delete_member(session, member)
        return {"status": "deleted"}


@app.post("/members/{member_id}/identity-check", response_model=IdentityCheckResult)
def identity_check_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        status, attempts, reason = run_identity_check(session, member)
        return IdentityCheckResult(status=status, attempts=attempts, reason=reason)


@app.get("/members/{member_id}/identity-audit", response_model=list[IdentityAuditRead])
def identity_audit_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        audits = list_identity_audits(session, member_id)
        return [
            IdentityAuditRead(
                id=audit.id,
                member_id=audit.member_id,
                result=audit.result,
                reason=audit.reason,
                created_at=audit.created_at.isoformat(),
            )
            for audit in audits
        ]
