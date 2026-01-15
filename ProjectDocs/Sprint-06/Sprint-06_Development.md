# Sprint-06 Development Notes

## Scope
- HNE-021 Email confirmation
- HNE-022 SMS opt-in
- HNE-023 Template variables
- HNE-024 Notification audit log

## Backend (FastAPI)
- Base URL: http://localhost:8001
- New endpoints:
  - POST /members/{id}/notifications
  - GET /members/{id}/notifications

### Templates (Demo)
- ENROLL_CONFIRM
- PLAN_SELECTED
- DOC_RECEIVED

### Data Notes
- Member stores email_opt_in and sms_opt_in
- Audit trail stored in NotificationAudit table
- Migrations add new columns and table automatically

## Frontend (Next.js)
- Notification preferences (email/sms opt-in)
- Send test notification buttons
- Notification audit list

## Demo Tips
- Toggle opt-in, then send Email/SMS
- Show audit list with timestamps
