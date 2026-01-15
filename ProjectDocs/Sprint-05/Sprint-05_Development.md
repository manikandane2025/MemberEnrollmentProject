# Sprint-05 Development Notes

## Scope
- HNE-017 Document upload
- HNE-018 File type validation
- HNE-019 Upload progress (UI indicator)
- HNE-020 Document metadata

## Backend (FastAPI)
- Base URL: http://localhost:8001
- New endpoints:
  - POST /members/{id}/documents
  - GET /members/{id}/documents

### Validation Rules (Demo)
- Allowed types: PDF, JPG, PNG
- Max size: 10 MB

### Storage
- Files stored under `backend/data/uploads`
- Metadata stored in Document table

## Frontend (Next.js)
- Document upload panel
- Upload status indicator
- Recent uploads list with metadata

## Demo Tips
- Upload a PDF and show metadata in the list.
- Try uploading a TXT to show validation error.
