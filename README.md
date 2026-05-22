# ClinicFlow

A full-stack healthcare visit management system built to handle real clinical workflows — patient bookings, doctor visit queues, treatment tracking, and finance analytics — across three distinct user roles.

**Live Demo:** https://clinic-flow-frontend.vercel.app  
**API Docs:** https://documenter.getpostman.com/view/27338446/2sBXVhDB7H  
**Trello Board:** https://trello.com/b/4avJYsqF/clinicflow

---

## What This Project Is

ClinicFlow was built as a complete product, not a tutorial clone. It covers the full lifecycle of a patient visit — from booking through treatment to billing — with strict business rules enforced at the API level and role-based access across every route.

The project has gone through two deployment phases:

- **Phase 1:** Deployed on Vercel (frontend + backend as serverless functions) with MongoDB Atlas
- **Phase 2 (current):** Containerized with Docker, CI/CD pipeline via GitHub Actions, backend migrated to Azure Container Apps

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + HttpOnly Cookies |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Registry | Docker Hub |
| Cloud | Azure Container Apps |
| Frontend Hosting | Vercel |

---

## Architecture

```
GitHub (push to main)
        |
GitHub Actions
        |
   _____|______
  |            |
Build        Build
Backend      Frontend
Image        Image
  |
Push to Docker Hub
  |
Azure Container Apps
pulls latest image
  |
Backend running
at Azure URL
        |
Vercel Frontend
calls Azure API
```

The frontend is a static React SPA served via Nginx inside a Docker container locally, and via Vercel in production. The backend is a Node/Express API containerized with Docker and deployed to Azure Container Apps with scale-to-zero enabled (cost-efficient, no idle charges).

---

## DevOps Implementation

### Docker

Two separate Dockerfiles — one per service.

Backend uses a single-stage Node Alpine image with production-only dependencies. Frontend uses a multi-stage build: Node Alpine compiles the Vite/React app, then the output is served by an Nginx Alpine image. Final frontend image is under 30MB.

Docker Compose wires both services locally with environment injection from a root `.env` file.

### GitHub Actions

On every push to `main`:

1. Checkout code
2. Set up Docker Buildx
3. Login to Docker Hub using repository secrets
4. Build and push backend image to Docker Hub
5. Login to Azure using a service principal
6. Deploy latest image to Azure Container Apps

PRs trigger a build-only run (no push, no deploy) to catch Dockerfile errors before merging.

### Environment Management

| Context | How vars are loaded |
|---------|-------------------|
| Local dev (no Docker) | `backend/.env` via dotenv |
| Local Docker | Root `.env` via Docker Compose `env_file` |
| GitHub Actions | Repository secrets |
| Azure | Container Apps secrets + env vars |
| Vercel | Vercel dashboard environment variables |

---

## Features by Role

### Patient
- Book visits with available doctors
- View visit history and status
- See treatment details and total costs

### Doctor
- View pending visit queue
- Manage one active visit at a time (enforced server-side)
- Add multiple treatments with costs and notes
- Complete visits

### Finance
- Search visits by patient name, doctor name, or visit ID
- View all billing details
- Access analytics dashboard with revenue and visit statistics

### Business Rules (enforced at API level)
- Doctor can have only one active visit at a time
- Patient cannot book the same doctor twice if a visit is pending or in-progress
- Visit totals are auto-calculated from treatment costs
- Role-based middleware protects every route

---

## Database Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // unique
  password: String, // bcrypt hashed
  role: "patient" | "doctor" | "finance"
}
```

### Visits
```javascript
{
  _id: ObjectId,
  patient: ObjectId,
  doctor: ObjectId,
  status: "pending" | "in-progress" | "completed",
  treatments: [{ name: String, cost: Number, notes: String }],
  totalAmount: Number,
  medicalNotes: String,
  completedAt: Date
}
```

---

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/check
```

### Patient
```
GET  /api/visits/doctors
POST /api/visits
GET  /api/visits/my-visits
```

### Doctor
```
GET /api/visits/active
GET /api/visits/pending
PUT /api/visits/:id/start
PUT /api/visits/:id/add-treatment
PUT /api/visits/:id/notes
PUT /api/visits/:id/complete
```

### Finance
```
GET /api/visits
GET /api/visits/search
GET /api/dashboard/stats
```

---

## Security

- JWT authentication with 7-day expiration
- HttpOnly cookies (XSS protection)
- bcrypt password hashing
- Role-based access control middleware on all protected routes
- CORS restricted to specific origins
- Secrets managed via environment variables, never committed

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Doctor | yanal@gmail.com | 123456 |
| Doctor | yara@gmail.com | 123456 |
| Finance | abbas@gmail.com | 123456 |
| Patient | bahaa@gmail.com | 123456 |
| Patient | john@gmail.com | 123456 |

---

## Running Locally with Docker

```bash
# Clone the repo
git clone https://github.com/BahaaAbbas/ClinicFlow.git
cd ClinicFlow

# Create root .env with your values
cp .env.example .env

# Build and run
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
```

---

## Planned Improvements

- Payment integration
- Calendar-based appointment scheduling
- Medical report generation
- Test coverage (Jest + Supertest)

---

## Developer

**Bahaa Abbas** — Full-Stack Developer  
GitHub: [@BahaaAbbas](https://github.com/BahaaAbbas)  
Live: https://clinic-flow-frontend.vercel.app
