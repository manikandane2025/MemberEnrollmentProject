# Demo Runbook (Sprint-Wise)

## Goal
Demonstrate sprint-by-sprint delivery by checking out a sprint tag/branch and running the app.

## Preconditions
- Repo has sprint tags (e.g., `sprint-01`) or sprint branches (e.g., `sprint/S01`).
- Backend and frontend dependencies installed.
- Demo data seeded per sprint.

## Quick Start (PowerShell)
```
./demo-run.ps1 -Ref sprint-01 -RepoPath .
```

## Manual Steps
1) Checkout sprint ref:
   - Tag: `git checkout sprint-01`
   - Branch: `git checkout sprint/S01`
2) Start backend:
   - `cd backend`
   - `python -m uvicorn app.main:app --reload --port 8000`
3) Start frontend:
   - `cd frontend`
   - `npm run dev`
4) Open `http://localhost:3000`

## Stop Servers
- Backend: press `Ctrl+C` in the backend terminal.
- Frontend: press `Ctrl+C` in the frontend terminal.
- If terminals are still running, close the windows to stop processes.

## Demo Flow
- Show the sprint scope and requirements.
- Run Requirement Analyst -> Test Planner -> Test Case Developer.
- Show execution output and traceability.

## Tips
- Keep sprint branches immutable after tagging.
- Use consistent demo data for predictable output.
