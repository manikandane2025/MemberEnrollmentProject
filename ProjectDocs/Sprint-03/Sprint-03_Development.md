# Sprint-03 Development Notes

## Scope
- HNE-009 Eligibility API integration
- HNE-010 Retry on eligibility timeout
- HNE-011 Eligibility code mapping
- HNE-012 Eligibility error messaging

## Backend (FastAPI)
- Base URL: http://localhost:8001
- New endpoints:
  - POST /members/{id}/eligibility-check
  - GET /members/{id}/eligibility-audit

### Eligibility Rules (Demo)
- Max attempts: 3
- ZIP ends with 000 => TIMEOUT (ELG-98)
- ZIP ends with 999 => INELIGIBLE (ELG-02)
- ZIP starts with 8 => REVIEW (ELG-01)
- Else => ELIGIBLE (ELG-00)

### Data Notes
- Eligibility status stored on member
- Audit trail stored in EligibilityAudit table
- If the existing DB lacks the new table, delete `backend/data/app.db` and restart.

## Frontend (Next.js)
- Eligibility panel with status, code, attempts, notes
- Run Eligibility Check button
- Audit log list (latest 4)

## Demo Tips
- Use ZIP 37000 to show TIMEOUT
- Use ZIP 37999 to show INELIGIBLE
- Use ZIP 8xxxx to show REVIEW
- Use ZIP 37067 to show ELIGIBLE
