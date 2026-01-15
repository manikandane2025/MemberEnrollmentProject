import os
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from .db import engine, init_db
from .models import Plan
from .schemas import (
    MemberCreate,
    MemberUpdate,
    MemberRead,
    IdentityCheckResult,
    IdentityAuditRead,
    EligibilityCheckResult,
    EligibilityAuditRead,
    PlanCreate,
    PlanRead,
    MemberPlanRead,
    DocumentRead,
)
from .crud import (
    create_member,
    list_members,
    get_member,
    update_member,
    delete_member,
    mask_ssn,
    run_identity_check,
    list_identity_audits,
    run_eligibility_check,
    list_eligibility_audits,
    seed_plans,
    list_plans,
    create_plan,
    select_member_plan,
    get_member_plan,
    add_document,
    list_documents,
)

app = FastAPI(title="Member Enrollment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    with Session(engine) as session:
        seed_plans(session)


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
        eligibility_status=member.eligibility_status,
        eligibility_code=member.eligibility_code,
        eligibility_attempts=member.eligibility_attempts,
        eligibility_last_checked=member.eligibility_last_checked.isoformat() if member.eligibility_last_checked else None,
        eligibility_notes=member.eligibility_notes,
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


@app.post("/members/{member_id}/eligibility-check", response_model=EligibilityCheckResult)
def eligibility_check_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        status, code, attempts, reason = run_eligibility_check(session, member)
        return EligibilityCheckResult(status=status, code=code, attempts=attempts, reason=reason)


@app.get("/members/{member_id}/eligibility-audit", response_model=list[EligibilityAuditRead])
def eligibility_audit_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        audits = list_eligibility_audits(session, member_id)
        return [
            EligibilityAuditRead(
                id=audit.id,
                member_id=audit.member_id,
                result=audit.result,
                code=audit.code,
                reason=audit.reason,
                created_at=audit.created_at.isoformat(),
            )
            for audit in audits
        ]


@app.get("/plans", response_model=list[PlanRead])
def list_plans_api(tier: str | None = Query(default=None)):
    with Session(engine) as session:
        plans = list_plans(session, tier=tier)
        return [
            PlanRead(
                id=plan.id,
                name=plan.name,
                tier=plan.tier,
                premium=plan.premium,
                deductible=plan.deductible,
                oop_max=plan.oop_max,
                coverage_summary=plan.coverage_summary,
                network=plan.network,
                active=plan.active,
            )
            for plan in plans
        ]


@app.post("/plans", response_model=PlanRead)
def create_plan_api(payload: PlanCreate):
    with Session(engine) as session:
        plan = create_plan(session, payload)
        return PlanRead(
            id=plan.id,
            name=plan.name,
            tier=plan.tier,
            premium=plan.premium,
            deductible=plan.deductible,
            oop_max=plan.oop_max,
            coverage_summary=plan.coverage_summary,
            network=plan.network,
            active=plan.active,
        )


@app.post("/members/{member_id}/plan", response_model=MemberPlanRead)
def select_plan_api(member_id: str, plan_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        plan = session.get(Plan, plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        selection = select_member_plan(session, member, plan_id)
        return MemberPlanRead(
            id=selection.id,
            member_id=selection.member_id,
            plan_id=selection.plan_id,
            selected_at=selection.selected_at.isoformat(),
        )


@app.get("/members/{member_id}/plan", response_model=MemberPlanRead | None)
def get_plan_api(member_id: str):
    with Session(engine) as session:
        selection = get_member_plan(session, member_id)
        if not selection:
            return None
        return MemberPlanRead(
            id=selection.id,
            member_id=selection.member_id,
            plan_id=selection.plan_id,
            selected_at=selection.selected_at.isoformat(),
        )


@app.post("/members/{member_id}/documents", response_model=DocumentRead)
def upload_document_api(member_id: str, file: UploadFile = File(...)):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        allowed_types = {"application/pdf", "image/jpeg", "image/png"}
        uploads_dir = "data/uploads"
        os.makedirs(uploads_dir, exist_ok=True)
        safe_name = f"{member_id}_{file.filename}"
        stored_path = os.path.join(uploads_dir, safe_name)
        contents = file.file.read()
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File exceeds 10MB limit")
        with open(stored_path, "wb") as f:
            f.write(contents)
        doc = add_document(
            session,
            member,
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            size_bytes=len(contents),
            stored_path=stored_path,
        )
        return DocumentRead(
            id=doc.id,
            member_id=doc.member_id,
            filename=doc.filename,
            content_type=doc.content_type,
            size_bytes=doc.size_bytes,
            created_at=doc.created_at.isoformat(),
        )


@app.get("/members/{member_id}/documents", response_model=list[DocumentRead])
def list_documents_api(member_id: str):
    with Session(engine) as session:
        member = get_member(session, member_id)
        if not member:
            raise HTTPException(status_code=404, detail="Member not found")
        docs = list_documents(session, member_id)
        return [
            DocumentRead(
                id=doc.id,
                member_id=doc.member_id,
                filename=doc.filename,
                content_type=doc.content_type,
                size_bytes=doc.size_bytes,
                created_at=doc.created_at.isoformat(),
            )
            for doc in docs
        ]
