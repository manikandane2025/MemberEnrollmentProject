# Branching and Release Strategy

## Branch Naming
- Mainline: main
- Release branches: release/R1, release/R2, release/R3, release/R4, release/R5
- Sprint branches: sprint/S01, sprint/S02, ... sprint/S25
- Feature branches: feature/HNE-001-short-title
- Hotfix branches: hotfix/HNE-xxx

## Flow
1) Start work from the current sprint branch (sprint/Sxx).
2) Merge feature branches into the sprint branch after review.
3) At sprint end, merge sprint/Sxx into the active release branch (release/Ry).
4) At release end (every 6 sprints), merge release/Ry into main with a tag.

## Tags
- Sprint tags: sprint-01, sprint-02, ... sprint-25
- Release tags: release-1.0, release-2.0, release-3.0, release-4.0, release-5.0

## Testing Gates
- Every sprint: P1/P2/P3 automation + smoke regression
- Every release: full regression + performance + security
