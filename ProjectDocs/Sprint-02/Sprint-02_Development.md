# Sprint-02 Development Notes

## Scope
- HNE-005 SSN and DOB validation
- HNE-006 Identity retry rules
- HNE-007 Partial match handling
- HNE-008 Audit identity checks

## Backend (FastAPI)
- Base URL: http://localhost:8001
- New endpoints:
  - POST /members/{id}/identity-check
  - GET /members/{id}/identity-audit

### Identity Rules (Demo)
- Max attempts: 3
- SSN last4 == 0000 => FAILED
- SSN last4 starts with 9 => PARTIAL
- Otherwise => VERIFIED

### Data Notes
- Identity status stored on member
- Audit trail stored in IdentityAudit table
- If the existing DB lacks the new table, delete `backend/data/app.db` and restart.

## Frontend (Next.js)
- Identity panel with status, attempts, notes
- Run Identity Check button
- Audit log list (latest 4)

## Demo Tips
- Use SSN ending in 9000 to show PARTIAL
- Use SSN ending in 0000 to show FAILED
- Use any other last4 to show VERIFIED
