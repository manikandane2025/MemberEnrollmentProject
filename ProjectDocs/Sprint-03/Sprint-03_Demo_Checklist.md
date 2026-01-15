# Sprint-03 Demo Checklist

## Pre-Demo Setup
- Checkout `sprint/S03` branch.
- Start backend on port 8001.
- Start frontend on port 3002.
- Open `http://localhost:3002`.

## Demo Flow (5-7 min)
1) Open a draft profile.
2) Run Eligibility Check with ZIP 37000 to show TIMEOUT.
3) Run Eligibility Check with ZIP 37999 to show INELIGIBLE.
4) Run Eligibility Check with ZIP starting 8 to show REVIEW.
5) Run Eligibility Check with ZIP 37067 to show ELIGIBLE.
6) Show eligibility audit entries with codes.

## Talking Points
- Retry rules enforce a max of 3 attempts.
- Eligibility code mapping is consistent for downstream systems.
- Error messaging is visible in the eligibility panel.
