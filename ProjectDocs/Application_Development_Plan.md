# Application Development Plan (Sprint-Wise)

## Purpose
Define how sprint scope, code delivery, and testing gates align across 25 sprints and 5 releases.

## Cadence
- Sprint length: 2 weeks (25 sprints total)
- Release cadence: every 6 sprints (~3 months)
- Release map: R1 (S1-6), R2 (S7-12), R3 (S13-18), R4 (S19-24), R5 (S25)

## Module Progression
1) Enrollment Intake
2) Identity Proofing
3) Eligibility & Rules
4) Plan Selection
5) Payments & Billing
6) Documents & Uploads
7) Notifications
8) Compliance & Audit
9) CSR Tools
10) Reporting & Admin Config

## Sprint Delivery Standard
- Scope: 4 requirements per sprint (P1/P2/P3 balanced)
- Artifacts: updated requirements, test plan, test cases, automation scaffolding
- Code: sprint branch merged into release branch
- Documentation: update sprint notes and release RAG doc

## Testing Gates
- Each Sprint:
  - P1/P2/P3 automation scaffolding
  - Smoke regression on critical paths
  - Basic security checks on changed flows
- Each Release:
  - Full regression suite
  - Performance baseline and comparison
  - Security validation (PII masking, headers, access control)

## Definition of Done (Sprint)
- All requirements implemented and reviewed
- Automated tests for P1/P2/P3 added or updated
- Test execution report with pass/fail and defects logged
- Sprint branch merged and tagged

## Definition of Done (Release)
- All sprint tags in the release completed
- Full regression, performance, and security tests executed
- Release readiness sign-off recorded

## Branching Alignment
Use the branching template in `MemberEnrollmentProject/ProjectDocs/Sprint_Branching_Template.md`.
