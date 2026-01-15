# Sprint-01 Demo Checklist

## Pre-Demo Setup
- Checkout `sprint-01` tag or `sprint/S01` branch.
- Start backend on port 8001.
- Start frontend on port 3002.
- Open `http://localhost:3002`.

## Demo Flow (5-7 min)
1) Show sprint scope (HNE-001 to HNE-004).
2) Create a new applicant profile and Save Draft.
3) Show masked SSN in the member list.
4) Edit a draft and Update Draft.
5) Delete a draft to show CRUD completion.
6) Mention automation, performance, security from runbook.

## Quick Commands
```
python -m uvicorn app.main:app --reload --port 8001
npm run dev -- --port 3002
```

## Talking Points
- Draft status is default on create.
- SSN stored as last4, masked on display.
- Traceability: HNE-001 to HNE-004 covered.
- Ready for Test Planner and Test Case Developer outputs.
