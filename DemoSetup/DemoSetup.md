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
- Backend runs on port 8000, frontend on port 3002 by default.
