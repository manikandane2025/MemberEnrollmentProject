# Sprint-02 Demo Checklist

## Pre-Demo Setup
- Checkout `sprint/S02` branch.
- Start backend on port 8001.
- Start frontend on port 3002.
- Open `http://localhost:3002`.

## Demo Flow (5-7 min)
1) Open a draft profile from Sprint-01.
2) Run Identity Check with SSN ending in 9000 to show PARTIAL.
3) Run Identity Check with SSN ending in 0000 to show FAILED.
4) Run Identity Check with a valid SSN to show VERIFIED.
5) Show audit entries with timestamps.

## Talking Points
- Retry rules enforce a max of 3 checks.
- Partial matches route to manual review.
- Audit log supports compliance traceability.
