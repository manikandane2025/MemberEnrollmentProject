# Sprint-01 Development Notes

## Scope
- HNE-001 Capture applicant profile
- HNE-002 Save draft enrollment
- HNE-003 Edit profile data
- HNE-004 Field masking

## Backend (FastAPI)
- Base URL: http://localhost:8000
- Endpoints:
  - GET /health
  - POST /members
  - GET /members
  - GET /members/{id}
  - PUT /members/{id}
  - DELETE /members/{id}

### Data Handling
- SSN is stored as last4 only.
- Masked SSN returned as ***-**-1234.
- New records default to status=DRAFT.

## Frontend (Next.js)
- Base URL: http://localhost:3002
- UI includes member list + profile form
- Save Draft creates/updates records
- Edit retains masked SSN; full SSN required only to update

## Run Instructions
- Backend:
  - cd backend
  - pip install -r requirements.txt
  - python -m uvicorn app.main:app --reload --port 8000
- Frontend:
  - cd frontend
  - npm install
  - npm run dev

## Demo Tips
- Create 2-3 drafts to show list updates and masking.
- Edit one record to show update and masked SSN behavior.
