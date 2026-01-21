# Sprint-01 KB Pack (Demo)

## Source List
- Project_Specification.md
- Requirements_Standard.md
- User_Story_Points_Standard.md
- Test_Planner_RAG_Condensed.md
- Testing_Entry_Exit_Criteria.md
- Sprint-01_Development.md

---

## Project Specification (Summary)
This program delivers a Healthcare Member Enrollment platform for adding, modifying, and deleting members. It integrates with Eligibility services, Member DB, Payer Enrollment APIs, and Document storage. Quality goals: P95 < 2s, zero PII leakage, and full audit trails. Core modules include enrollment intake, identity, eligibility, plan selection, documents, payments, notifications, compliance, CSR tools, and reporting.

## Requirements Standard (Summary)
Requirements should be atomic, testable, traceable, and aligned with domain standards. Each requirement must include summary, description, acceptance criteria, priority, and story points. Use Given/When/Then where possible.

## Story Points Standard (Summary)
Use consistent point sizing by complexity and risk. P1 items are typically 5 points, P2 are 3 points, P3 are 1-2 points. Adjust based on complexity and integration dependency.

## Test Planner RAG (Condensed) (Summary)
Focus on functional, negative, security, performance, accessibility, privacy, and audit coverage. Known constraints: eligibility timeout 3s with 2 retries, idempotent submissions, consent before plan selection, upload limit 10MB, audit logs with user_id/timestamp/action.

## Testing Entry/Exit Criteria (Summary)
Entry: stable build, environments ready, test data prepared, critical defects resolved. Exit: P1 tests passed, no critical/high defects open, performance baseline met, security checks clean.

## Sprint-01 Development Notes (Summary)
Sprint‑01 covers intake basics: capture applicant profile, save draft, edit profile, and field masking. Backend exposes CRUD endpoints for members, frontend supports draft list + profile form, with masked SSN stored as last4.
