# Sprint-20 Detailed Design

## Overview
- Release: Release 4
- Theme: PII masking and logging
- Primary Modules: Compliance & Audit

## Scope
| Issue Key | Summary | Module | Priority | Story Points | Description | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- | --- |
| HNE-077 | PII masking logs | Compliance & Audit | P1 | 5 | Mask PII in logs | No PII in log output |
| HNE-078 | PII masking UI | Compliance & Audit | P2 | 3 | Mask PII on screen | Masked view for CSR |
| HNE-079 | Access logging | Compliance & Audit | P2 | 3 | Log PII access | Audit includes user and reason |
| HNE-080 | Security headers | Compliance & Audit | P3 | 2 | Add security headers | CSP and HSTS enabled |

## Functional Design
- User flow: capture data, validate, persist, and show confirmation or errors.
- Traceability: each story maps to a test case and audit event.
- Accessibility: field labels, keyboard navigation, and error messaging.

## Data & Validation
- Required fields enforced per story acceptance criteria.
- Format validation (dates, SSN last4, phone, email) and boundary checks.
- Draft/partial states supported where applicable.

## API / Service Contracts
- Primary endpoints per module, with audit logging on changes.

## Security & Compliance
- PII masking, RBAC checks, encrypted storage, audit logs.
- Trace sensitive operations in audit trail.

## Test Considerations
- Happy path + negative + edge case per story.
- Include explicit field/value test data in cases.

## Dependencies
- External services (identity, eligibility, notifications) as applicable.
- Test data sources and environment readiness.
