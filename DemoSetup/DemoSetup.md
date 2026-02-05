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
- Backend runs on port 8005, frontend on port 3005 by default.
- The script sets `NEXT_PUBLIC_API_BASE=http://localhost:8005` for the frontend.
