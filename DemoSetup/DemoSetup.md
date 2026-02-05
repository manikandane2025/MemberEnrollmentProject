# Demo Setup Instructions

## Purpose
Use this folder to run sprint-wise demos by checking out sprint tags/branches and starting the app.

## Quick Start (PowerShell)
```
./demo-run.ps1 -Ref sprint-01 -RepoPath .. -StartServers
```

## Notes
- Use `sprint-XX` tags or `sprint/SXX` branches.
- Keep the repo clean before switching refs.
- Backend runs on port 8001, frontend on port 3001 by default.
- The script sets `NEXT_PUBLIC_API_BASE=http://localhost:8001` for the frontend. for the frontend.
