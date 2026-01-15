# Requirements Backlog (100 Items)

Columns: Issue Key, Summary, Module, Priority, Story Points, Type, Sprint, Release, Description, Acceptance Criteria

| Issue Key | Summary | Module | Priority | Story Points | Type | Sprint | Release | Description | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HNE-001 | Capture applicant profile | Enrollment Intake | P1 | 5 | Story | Sprint-1 | Release 1 | Create profile form with required fields | All required fields validate and save |
| HNE-002 | Save draft enrollment | Enrollment Intake | P1 | 3 | Story | Sprint-1 | Release 1 | Allow saving draft application | Draft saved and can be resumed |
| HNE-003 | Edit profile data | Enrollment Intake | P2 | 3 | Story | Sprint-1 | Release 1 | Allow edits before submission | Edits persist and reflect in review |
| HNE-004 | Field masking | Enrollment Intake | P2 | 2 | Story | Sprint-1 | Release 1 | Mask SSN and DOB inputs | Masked display with secure storage |
| HNE-005 | SSN and DOB validation | Identity Proofing | P1 | 5 | Story | Sprint-2 | Release 1 | Validate SSN and DOB with registry | Valid matches pass, invalid fail |
| HNE-006 | Identity retry rules | Identity Proofing | P2 | 3 | Story | Sprint-2 | Release 1 | Allow limited retries | Max retries enforced |
| HNE-007 | Partial match handling | Identity Proofing | P2 | 3 | Story | Sprint-2 | Release 1 | Handle partial matches | Partial matches flagged for review |
| HNE-008 | Audit identity checks | Compliance & Audit | P3 | 2 | Story | Sprint-2 | Release 1 | Log identity checks | Audit log includes user and timestamp |
| HNE-009 | Eligibility API integration | Eligibility & Rules | P1 | 5 | Story | Sprint-3 | Release 1 | Call eligibility service | Response mapped to app status |
| HNE-010 | Retry on eligibility timeout | Eligibility & Rules | P2 | 3 | Story | Sprint-3 | Release 1 | Retry eligibility up to 2 times | Retries follow backoff and stop |
| HNE-011 | Eligibility code mapping | Eligibility & Rules | P1 | 5 | Story | Sprint-3 | Release 1 | Map payer codes to UI | Codes displayed and stored |
| HNE-012 | Eligibility error messaging | Notifications | P3 | 2 | Story | Sprint-3 | Release 1 | Show clear errors | User sees actionable message |
| HNE-013 | Plan catalog listing | Plan Selection | P1 | 5 | Story | Sprint-4 | Release 1 | Display plans with premiums | Plans list matches backend |
| HNE-014 | Plan tier filtering | Plan Selection | P2 | 3 | Story | Sprint-4 | Release 1 | Filter by tier | Filters update results |
| HNE-015 | Plan comparison | Plan Selection | P2 | 3 | Story | Sprint-4 | Release 1 | Compare plan benefits | Comparison shows key fields |
| HNE-016 | Coverage summary | Plan Selection | P3 | 2 | Story | Sprint-4 | Release 1 | Show coverage highlights | Summary visible before selection |
| HNE-017 | Document upload | Documents & Uploads | P1 | 5 | Story | Sprint-5 | Release 1 | Upload PDF/JPG/PNG | Files upload within size limits |
| HNE-018 | File type validation | Documents & Uploads | P2 | 2 | Story | Sprint-5 | Release 1 | Reject unsupported formats | Invalid files blocked |
| HNE-019 | Upload progress | Documents & Uploads | P3 | 2 | Story | Sprint-5 | Release 1 | Show progress bar | Progress updates during upload |
| HNE-020 | Document metadata | Documents & Uploads | P2 | 3 | Story | Sprint-5 | Release 1 | Store doc type and timestamp | Metadata saved and visible |
| HNE-021 | Email confirmation | Notifications | P1 | 3 | Story | Sprint-6 | Release 1 | Send confirmation email | Email sent on submit |
| HNE-022 | SMS opt-in | Notifications | P2 | 3 | Story | Sprint-6 | Release 1 | Capture SMS consent | Opt-in stored with timestamp |
| HNE-023 | Template variables | Notifications | P3 | 2 | Story | Sprint-6 | Release 1 | Support dynamic fields | Templates render correctly |
| HNE-024 | Notification audit log | Compliance & Audit | P3 | 2 | Story | Sprint-6 | Release 1 | Log sends | Audit entries created |
| HNE-025 | Add dependent | Enrollment Intake | P1 | 5 | Story | Sprint-7 | Release 2 | Add dependent details | Dependent saved and listed |
| HNE-026 | Dependent age rules | Eligibility & Rules | P2 | 3 | Story | Sprint-7 | Release 2 | Validate dependent age | Errors for invalid ages |
| HNE-027 | Relationship validation | Enrollment Intake | P2 | 3 | Story | Sprint-7 | Release 2 | Validate relationship type | Only allowed values accepted |
| HNE-028 | Dependent removal | Enrollment Intake | P3 | 2 | Story | Sprint-7 | Release 2 | Remove dependent | Dependent removed from draft |
| HNE-029 | USPS validation | Enrollment Intake | P1 | 5 | Story | Sprint-8 | Release 2 | Validate address via USPS | Valid addresses normalized |
| HNE-030 | Address override | Enrollment Intake | P2 | 3 | Story | Sprint-8 | Release 2 | Allow manual override | Override logged and saved |
| HNE-031 | Address suggestions | Enrollment Intake | P3 | 2 | Story | Sprint-8 | Release 2 | Suggest corrections | User can accept suggestion |
| HNE-032 | Audit address change | Compliance & Audit | P3 | 2 | Story | Sprint-8 | Release 2 | Log address changes | Audit entry created |
| HNE-033 | HIPAA consent | Compliance & Audit | P1 | 5 | Story | Sprint-9 | Release 2 | Capture HIPAA consent | Consent stored with version |
| HNE-034 | Consent versioning | Compliance & Audit | P2 | 3 | Story | Sprint-9 | Release 2 | Track consent version | Version stored per user |
| HNE-035 | Consent audit trail | Compliance & Audit | P2 | 3 | Story | Sprint-9 | Release 2 | Log consent events | Audit includes user/time |
| HNE-036 | Consent display | Enrollment Intake | P3 | 2 | Story | Sprint-9 | Release 2 | Show consent summary | Summary visible before submit |
| HNE-037 | Payment profile create | Payments & Billing | P1 | 5 | Story | Sprint-10 | Release 2 | Add payment method | Payment token stored |
| HNE-038 | Premium estimate | Payments & Billing | P1 | 5 | Story | Sprint-10 | Release 2 | Calculate premium | Estimate matches rules |
| HNE-039 | Payment retry | Payments & Billing | P2 | 3 | Story | Sprint-10 | Release 2 | Retry failed payments | Retry logic applied |
| HNE-040 | Payment confirmation | Notifications | P3 | 2 | Story | Sprint-10 | Release 2 | Notify on payment | Confirmation delivered |
| HNE-041 | Submission payload | Eligibility & Rules | P1 | 5 | Story | Sprint-11 | Release 2 | Submit payload to payer | Payload accepted by API |
| HNE-042 | Idempotent submission | Eligibility & Rules | P2 | 3 | Story | Sprint-11 | Release 2 | Prevent duplicate submissions | Duplicate requests rejected |
| HNE-043 | Submission error handling | Notifications | P2 | 3 | Story | Sprint-11 | Release 2 | Show submission errors | Errors visible with retry |
| HNE-044 | Submission audit | Compliance & Audit | P3 | 2 | Story | Sprint-11 | Release 2 | Log submission events | Audit includes response code |
| HNE-045 | Review page | Enrollment Intake | P1 | 5 | Story | Sprint-12 | Release 2 | Show review summary | All sections visible |
| HNE-046 | Inline edit | Enrollment Intake | P2 | 3 | Story | Sprint-12 | Release 2 | Edit from review | Edits persist and refresh |
| HNE-047 | Review validations | Enrollment Intake | P2 | 3 | Story | Sprint-12 | Release 2 | Block submit on errors | Errors highlighted |
| HNE-048 | Review download | Documents & Uploads | P3 | 2 | Story | Sprint-12 | Release 2 | Download summary PDF | PDF generated |
| HNE-049 | Enrollment status | Compliance & Audit | P1 | 5 | Story | Sprint-13 | Release 3 | Show status from payer | Status refreshes on interval |
| HNE-050 | Status notifications | Notifications | P2 | 3 | Story | Sprint-13 | Release 3 | Notify on status change | Email sent on update |
| HNE-051 | Rejection reasons | Compliance & Audit | P2 | 3 | Story | Sprint-13 | Release 3 | Display rejection reason | Reason stored and shown |
| HNE-052 | Status history | Compliance & Audit | P3 | 2 | Story | Sprint-13 | Release 3 | Keep status history | History visible to CSR |
| HNE-053 | CSR assisted flow | CSR Tools | P1 | 5 | Story | Sprint-14 | Release 3 | CSR can create enrollment | CSR flow mirrors member flow |
| HNE-054 | CSR notes | CSR Tools | P2 | 3 | Story | Sprint-14 | Release 3 | Allow CSR notes | Notes stored with audit |
| HNE-055 | Role-based access | Compliance & Audit | P1 | 5 | Story | Sprint-14 | Release 3 | Restrict CSR tools | Access limited to CSR role |
| HNE-056 | CSR search | CSR Tools | P2 | 3 | Story | Sprint-14 | Release 3 | Search applications | Search by member and status |
| HNE-057 | Language preferences | Enrollment Intake | P2 | 3 | Story | Sprint-15 | Release 3 | Store language setting | Preference saved and reused |
| HNE-058 | Translation coverage | Enrollment Intake | P2 | 3 | Story | Sprint-15 | Release 3 | Translate key labels | Spanish labels visible |
| HNE-059 | Accessibility labels | Enrollment Intake | P1 | 5 | Story | Sprint-15 | Release 3 | Add aria labels | Screen reader passes |
| HNE-060 | Keyboard navigation | Enrollment Intake | P3 | 2 | Story | Sprint-15 | Release 3 | Tab order logical | All fields accessible |
| HNE-061 | Duplicate detection | Compliance & Audit | P1 | 5 | Story | Sprint-16 | Release 3 | Detect duplicate applications | Duplicates flagged |
| HNE-062 | Fraud scoring | Compliance & Audit | P2 | 3 | Story | Sprint-16 | Release 3 | Score suspicious submissions | Scores stored in audit |
| HNE-063 | Manual review queue | CSR Tools | P2 | 3 | Story | Sprint-16 | Release 3 | Queue flagged apps | CSR can review and decide |
| HNE-064 | Duplicate warnings | Notifications | P3 | 2 | Story | Sprint-16 | Release 3 | Warn on duplicate submit | Warning shown to user |
| HNE-065 | Member ID creation | Reporting & Admin Config | P1 | 5 | Story | Sprint-17 | Release 3 | Generate member ID | ID unique and stored |
| HNE-066 | Provisioning sync | Reporting & Admin Config | P2 | 3 | Story | Sprint-17 | Release 3 | Sync ID to CRM | CRM updated within SLA |
| HNE-067 | Welcome packet | Documents & Uploads | P3 | 2 | Story | Sprint-17 | Release 3 | Generate welcome PDF | PDF linked to member |
| HNE-068 | Provisioning audit | Compliance & Audit | P3 | 2 | Story | Sprint-17 | Release 3 | Log provisioning events | Audit entry created |
| HNE-069 | Rejection workflow | Eligibility & Rules | P1 | 5 | Story | Sprint-18 | Release 3 | Handle payer rejection | User sees reason and next steps |
| HNE-070 | Resubmission | Eligibility & Rules | P2 | 3 | Story | Sprint-18 | Release 3 | Allow resubmission | Resubmission uses same app id |
| HNE-071 | Rejection notifications | Notifications | P3 | 2 | Story | Sprint-18 | Release 3 | Notify on rejection | Email includes reason |
| HNE-072 | Resubmit audit | Compliance & Audit | P3 | 2 | Story | Sprint-18 | Release 3 | Log resubmissions | Audit includes old and new status |
| HNE-073 | Auto-save on timeout | Enrollment Intake | P1 | 5 | Story | Sprint-19 | Release 4 | Auto-save on inactivity | Draft saved on timeout |
| HNE-074 | Draft retention | Enrollment Intake | P2 | 3 | Story | Sprint-19 | Release 4 | Retain draft for 30 days | Draft expires after policy |
| HNE-075 | Session warning | Notifications | P3 | 2 | Story | Sprint-19 | Release 4 | Warn before timeout | Warning displayed at 2 minutes |
| HNE-076 | Resume draft | Enrollment Intake | P2 | 3 | Story | Sprint-19 | Release 4 | Resume draft from dashboard | Draft restored accurately |
| HNE-077 | PII masking logs | Compliance & Audit | P1 | 5 | Story | Sprint-20 | Release 4 | Mask PII in logs | No PII in log output |
| HNE-078 | PII masking UI | Compliance & Audit | P2 | 3 | Story | Sprint-20 | Release 4 | Mask PII on screen | Masked view for CSR |
| HNE-079 | Access logging | Compliance & Audit | P2 | 3 | Story | Sprint-20 | Release 4 | Log PII access | Audit includes user and reason |
| HNE-080 | Security headers | Compliance & Audit | P3 | 2 | Story | Sprint-20 | Release 4 | Add security headers | CSP and HSTS enabled |
| HNE-081 | Eligibility caching | Reporting & Admin Config | P2 | 3 | Story | Sprint-21 | Release 4 | Cache eligibility calls | Cache hit rate tracked |
| HNE-082 | API latency alerts | Reporting & Admin Config | P2 | 3 | Story | Sprint-21 | Release 4 | Alert on slow APIs | Alerts triggered over threshold |
| HNE-083 | Load testing baseline | Reporting & Admin Config | P1 | 5 | Story | Sprint-21 | Release 4 | Define load baseline | P95 under 2s |
| HNE-084 | Database indexing | Reporting & Admin Config | P3 | 2 | Story | Sprint-21 | Release 4 | Optimize indexes | Query time improved |
| HNE-085 | Audit export | Compliance & Audit | P1 | 5 | Story | Sprint-22 | Release 4 | Export audit logs | Export contains required events |
| HNE-086 | Export scheduling | Reporting & Admin Config | P2 | 3 | Story | Sprint-22 | Release 4 | Schedule exports | Schedules run on time |
| HNE-087 | Export filters | Reporting & Admin Config | P3 | 2 | Story | Sprint-22 | Release 4 | Filter by date and type | Filters applied to export |
| HNE-088 | Export notification | Notifications | P3 | 2 | Story | Sprint-22 | Release 4 | Notify when export complete | Email sent on completion |
| HNE-089 | Notification preferences | Notifications | P1 | 5 | Story | Sprint-23 | Release 4 | User manages preferences | Preferences saved and applied |
| HNE-090 | Channel fallback | Notifications | P2 | 3 | Story | Sprint-23 | Release 4 | Fallback to email | SMS failure triggers email |
| HNE-091 | Template governance | Notifications | P3 | 2 | Story | Sprint-23 | Release 4 | Approve templates | Templates require approval |
| HNE-092 | Preference audit | Compliance & Audit | P3 | 2 | Story | Sprint-23 | Release 4 | Log preference updates | Audit entry created |
| HNE-093 | Retention policy | Compliance & Audit | P1 | 5 | Story | Sprint-24 | Release 4 | Enforce retention rules | Data retained per policy |
| HNE-094 | Deletion request | Compliance & Audit | P2 | 3 | Story | Sprint-24 | Release 4 | Request deletion | Deletion workflow initiated |
| HNE-095 | Legal hold | Compliance & Audit | P2 | 3 | Story | Sprint-24 | Release 4 | Apply legal hold | Held records excluded |
| HNE-096 | Deletion audit | Compliance & Audit | P3 | 2 | Story | Sprint-24 | Release 4 | Audit deletions | Audit includes requestor |
| HNE-097 | Cross-module regression | Reporting & Admin Config | P1 | 5 | Story | Sprint-25 | Release 5 | Run full regression | All critical paths pass |
| HNE-098 | Security hardening | Compliance & Audit | P1 | 5 | Story | Sprint-25 | Release 5 | Complete security review | No critical findings |
| HNE-099 | Performance validation | Reporting & Admin Config | P1 | 5 | Story | Sprint-25 | Release 5 | Validate performance | P95 under SLA |
| HNE-100 | Operational readiness | Reporting & Admin Config | P2 | 3 | Story | Sprint-25 | Release 5 | Finalize runbooks | Runbooks approved |