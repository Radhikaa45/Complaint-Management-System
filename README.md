# SmartOffice – Complaint Management System

Submit, track and resolve workplace complaints. React + Vite + Tailwind frontend, Express + MongoDB backend.

## Features

- **Submit** complaints with drag-and-drop image/PDF attachments; get a tracking ID by email
- **AI triage** – every complaint is auto-tagged with a category and priority (Groq, with an offline keyword fallback)
- **Track** by ID (`/track?id=...` deep links) with a live status timeline and notes from the team
- **Feedback** – users rate resolved complaints (1–5 stars)
- **Admin dashboard** (JWT-protected) – KPIs, status chart, "needs attention" queue
- **Complaints manager** – search, filter, sort, paginate, export CSV, update status with notes, change priority/category, delete
- **Analytics** – daily volume trend, category/priority/user-type breakdowns, resolution time, satisfaction

## Setup

### Backend

```bash
cd Backend
npm install
cp .env.example .env        # then fill in MONGO_URI, JWT_SECRET, ...
npm run create-admin -- admin@example.com "YourStrongPassword"
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd Frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev                 # http://localhost:5173
```

## Environment variables (Backend)

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes in production | Signs admin login tokens |
| `CLIENT_URL` | recommended | Frontend URL(s) for CORS and email links (comma separated) |
| `GROQ_API_KEY` / `GROQ_MODEL` | optional | AI classification (defaults to `openai/gpt-oss-20b`) |
| `RESEND_API_KEY` / `EMAIL_FROM` | optional | Email notifications |

## API

| Method | Route | Auth |
| --- | --- | --- |
| POST | `/api/complaints/submit` (multipart) | public |
| GET | `/api/complaints/track/:complaintId` | public |
| POST | `/api/complaints/feedback/:complaintId` | public |
| GET | `/api/complaints/public-stats` | public |
| POST | `/api/ai/analyze` | public |
| POST | `/api/admin/login` | public |
| GET | `/api/admin/me`, `/api/admin/stats`, `/api/admin/recent` | admin |
| GET | `/api/complaints?status=&priority=&category=&search=` | admin |
| PUT | `/api/complaints/status/:id` `{ status, note?, priority?, category? }` | admin |
| DELETE | `/api/complaints/:id` | admin |
