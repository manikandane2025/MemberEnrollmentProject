# Sprint-04 Development Notes

## Scope
- HNE-013 Plan catalog listing
- HNE-014 Plan tier filtering
- HNE-015 Plan comparison
- HNE-016 Coverage summary display

## Backend (FastAPI)
- Base URL: http://localhost:8001
- New endpoints:
  - GET /plans?tier=TierName
  - POST /plans
  - POST /members/{id}/plan?plan_id=...
  - GET /members/{id}/plan

### Data Notes
- Plans are seeded on startup if none exist.
- Plan selection stored in MemberPlan table.
- If the existing DB lacks new tables, migrations will create them automatically.

## Frontend (Next.js)
- Plan catalog with tier filters
- Plan comparison (select up to 2)
- Plan selection per member

## Demo Tips
- Use tier filters to show dynamic listing.
- Compare two plans to show deductibles and OOP max.
- Select a plan to demonstrate member linkage.
