# Sprint Branching Template (Sprint-Wise Development)

## Branch Naming
- Mainline: `main`
- Release branches: `release/R1`, `release/R2`, `release/R3`, `release/R4`, `release/R5`
- Sprint branches: `sprint/S01` ... `sprint/S25`
- Feature branches: `feature/HNE-001-short-title`
- Hotfix branches: `hotfix/HNE-xxx`

## Sprint Workflow
1) Create the sprint branch from the active release branch.
2) Create feature branches from the sprint branch.
3) Merge feature branches into the sprint branch after review.
4) At sprint end, merge sprint branch into the active release branch.
5) At release end (every 6 sprints), merge release branch into `main` and tag.

## Sample Commands
### Start Sprint
```
git checkout release/R1
git pull
git checkout -b sprint/S01
```

### Start Feature
```
git checkout sprint/S01
git pull
git checkout -b feature/HNE-001-applicant-profile
```

### Merge Feature into Sprint
```
git checkout sprint/S01
git pull
git merge feature/HNE-001-applicant-profile
```

### Close Sprint into Release
```
git checkout release/R1
git pull
git merge sprint/S01
git tag sprint-01
```

### Close Release into Main
```
git checkout main
git pull
git merge release/R1
git tag release-1.0
```

## Notes
- Keep sprint branches short-lived.
- Tag every sprint and release for traceability.
- Automation gates: every sprint for P1/P2/P3; full regression/perf/security at release.
