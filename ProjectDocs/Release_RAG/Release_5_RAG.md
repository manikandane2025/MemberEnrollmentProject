# Release 5 RAG

## Scope
- Sprint range: Sprint 25
- Theme: Hardening & Cross-Release Regression
- Primary modules: All modules

## Expected Deliverables
- Stable end-to-end enrollment flow for this release scope
- Automation scaffolding for P1/P2/P3 each sprint
- Release gate: full regression, performance, and security

## Key Risks
- Integration latency and error handling across eligibility/payer APIs
- Consent, audit, and PII masking coverage gaps
- Data consistency between UI edits and submission payload
- Performance regression under peak enrollment

## Test Focus
- Functional + negative coverage for new/changed flows
- API contract tests for integrations
- Accessibility checks on enrollment forms
- Security and privacy checks for PII

## Constraints
- Eligibility API timeout 3s, retry up to 2 times
- Submissions must be idempotent using application_id
- Document upload types limited to PDF/JPG/PNG up to 10 MB
