# Unity Hospital Management System

> **"Caring. Connecting. Healing."**  
> A full-stack hospital management solution built on a Spring Boot microservices backend and a React + TypeScript SPA frontend.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Service Port Map](#service-port-map)
- [Database Setup](#database-setup)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Environment Variables](#environment-variables)
- [Migrating Data to Another PC](#migrating-data-to-another-pc)

---

## Features

| Module | Capabilities |
|---|---|
| **Dashboard** | Live stats (doctors, patients, appointments, pending bills), recent appointments list, system alerts (low pharmacy stock) |
| **Doctors** | Add, view, edit, delete doctor profiles with specialty and availability |
| **Patients** | Full patient record management with demographics and medical history |
| **Appointments** | Schedule, view, update appointments with time-picker UX; copy Appointment ID to clipboard |
| **Billing / Invoices** | Create invoices linked to price plans and appointments; filter by status |
| **Pharmacy** | Drug inventory management with low-stock alert thresholds |
| **Staff** | Manage admin/staff/doctor accounts (admin-only) |
| **Hospital Settings** | Appointment types, service pricing plans, hospital profile (single company card) — all in one split-panel view |
| **Auth** | JWT-based login; role-gated routes (ADMIN vs STAFF); auto-redirect if already logged in |

---

## Architecture

```
Browser (React SPA)
        │
        ▼  HTTP :5173 (Vite dev) / :80 (prod)
  ┌─────────────┐
  │  API Gateway │  :8080  — single entry point, JWT validation, routing
  └──────┬──────┘
         │  routes via Eureka service discovery
  ┌──────▼──────────────────────────────────────────────────┐
  │              Eureka Server  :8761                        │
  └──────┬──────────────────────────────────────────────────┘
         │
  ┌──────┴────────────────────────────────────────────────────────┐
  │  Microservices                                                 │
  │  authservice        :8081   hospitalservice    :8082           │
  │  patientservice     :8083   doctorservice      :8084           │
  │  appointmentservice :8085   billingservice     :8086           │
  │  pricingservice     :8087   pharmacyservice    :8088           │
  │  organizationservice:8089                                      │
  └────────────────────────────────────────────────────────────────┘
         │  each service owns its own PostgreSQL database
  ┌──────▼───────────────────────────────────────────────────────┐
  │  PostgreSQL  :5432                                            │
  │  authdb  appointmentdb  billingdb  doctordb  hospitaldb       │
  │  organizationdb  patientdb  pharmacydb  pricingdb  patientdb  │
  └───────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS (custom design tokens, dark mode) |
| Routing | React Router v6 |
| HTTP | Axios with centralised `axiosConfig.ts` interceptor |
| Auth | JWT stored in `localStorage`, decoded client-side for role info |
| Icons | Lucide React |

### Backend
| | |
|---|---|
| Framework | Spring Boot 3.2 |
| Language | Java 21 |
| Service Discovery | Netflix Eureka |
| Gateway | Spring Cloud Gateway |
| Security | Spring Security + JWT |
| Database | PostgreSQL (one DB per service) |
| Migrations | Flyway |
| Build | Maven |

---

## Service Port Map

| Service | Port | Database |
|---|---|---|
| API Gateway | **8080** | — |
| Eureka Server | **8761** | — |
| Auth Service | **8081** | `authdb` |
| Hospital Service | **8082** | `hospitaldb` |
| Patient Service | **8083** | `patientdb` |
| Doctor Service | **8084** | `doctordb` |
| Appointment Service | **8085** | `appointmentdb` |
| Billing Service | **8086** | `billingdb` |
| Pricing Service | **8087** | `pricingdb` |
| Pharmacy Service | **8088** | `pharmacydb` |
| Organization Service | **8089** | `organizationdb` |
| Frontend (Vite dev) | **5173** | — |

---

## Database Setup

Each microservice auto-creates its schema via **Flyway** on first startup. You only need to create the empty databases:

```sql
-- Run once in psql or pgAdmin
CREATE DATABASE authdb;
CREATE DATABASE appointmentdb;
CREATE DATABASE billingdb;
CREATE DATABASE doctordb;
CREATE DATABASE hospitaldb;
CREATE DATABASE organizationdb;
CREATE DATABASE patientdb;
CREATE DATABASE pharmacydb;
CREATE DATABASE pricingdb;
```

---

## Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 14+ running on `localhost:5432`

### 1 — Create PostgreSQL databases

See [Database Setup](#database-setup) above.

### 2 — Set the DB password environment variable

```powershell
# Windows PowerShell (user-scope, survives reboots)
[System.Environment]::SetEnvironmentVariable("DB_PASSWORD", "your_pg_password", "User")
```

Or add it to `backend/.env` — `.env` is already in `.gitignore`.

### 3 — Start backend services (in order)

```bash
# Terminal 1 — Eureka must start first
cd backend/eurekaserver && mvn spring-boot:run

# Terminal 2 — API Gateway
cd backend/apigateway && mvn spring-boot:run

# Terminals 3-11 — remaining services (any order)
cd backend/authservice        && mvn spring-boot:run
cd backend/hospitalservice    && mvn spring-boot:run
cd backend/patientservice     && mvn spring-boot:run
cd backend/doctorservice      && mvn spring-boot:run
cd backend/appointmentservice && mvn spring-boot:run
cd backend/billingservice     && mvn spring-boot:run
cd backend/pricingservice     && mvn spring-boot:run
cd backend/pharmacyservice    && mvn spring-boot:run
cd backend/organizationservice && mvn spring-boot:run
```

Verify all services are registered at: **http://localhost:8761**

### 4 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** and log in with your admin credentials.

---

## Project Structure

```
unityhospital/
├── backend/
│   ├── apigateway/            # Spring Cloud Gateway — port 8080
│   ├── eurekaserver/          # Netflix Eureka registry — port 8761
│   ├── authservice/           # JWT auth & user accounts — port 8081
│   ├── hospitalservice/       # Appointment types — port 8082
│   ├── patientservice/        # Patient records — port 8083
│   ├── doctorservice/         # Doctor profiles — port 8084
│   ├── appointmentservice/    # Appointment scheduling — port 8085
│   ├── billingservice/        # Invoices & payments — port 8086
│   ├── pricingservice/        # Price plans — port 8087
│   ├── pharmacyservice/       # Drug inventory — port 8088
│   └── organizationservice/   # Hospital profile/company — port 8089
└── frontend/
    ├── public/
    │   └── unity-hospital-logo.png   # Logo (used by favicon)
    ├── src/
    │   ├── api/               # Axios service clients per microservice
    │   ├── assets/
    │   │   └── images/
    │   │       └── unity-hospital-logo.png  # Logo (used by React components)
    │   ├── components/        # Shared UI — Modal, DateInput, TimeInput, ProtectedRoute, LoginGuard …
    │   ├── context/           # AuthContext (JWT decode, isAdmin/isStaff)
    │   ├── layouts/           # AdminLayout — sidebar, dark-mode toggle, logout
    │   └── pages/             # AdminDashboard, AdminDoctors, AdminPatients,
    │                          # AdminAppointments, AdminBilling, AdminPharmacy,
    │                          # AdminStaff, AdminHospital, AdminSettings, AdminLogin
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

---

## User Roles

| Role | Access |
|---|---|
| **ADMIN** | Full access to all modules including Staff management, Billing, Pharmacy, and all edit/delete actions |
| **STAFF / DOCTOR** | Read-only access to Dashboard, Doctors, Patients, Appointments, Hospital profile; edit own data where permitted |

Unauthenticated users are automatically redirected to `/admin/login`. Authenticated users visiting `/admin/login` are redirected to `/admin/dashboard`.

---

## Environment Variables

| Variable | Used by | Description |
|---|---|---|
| `DB_PASSWORD` | All backend services | PostgreSQL password |
| `JWT_SECRET` | `authservice`, `apigateway` | Secret key for signing/verifying JWT tokens |

Set these as OS environment variables or in `backend/.env` (not committed to Git).

---

## Migrating Data to Another PC

```powershell
# 1. Dump all databases (run on source PC)
pg_dump -U postgres -d authdb         -F c -f "C:\db_backup\authdb.backup"
pg_dump -U postgres -d appointmentdb  -F c -f "C:\db_backup\appointmentdb.backup"
pg_dump -U postgres -d billingdb      -F c -f "C:\db_backup\billingdb.backup"
pg_dump -U postgres -d doctordb       -F c -f "C:\db_backup\doctordb.backup"
pg_dump -U postgres -d hospitaldb     -F c -f "C:\db_backup\hospitaldb.backup"
pg_dump -U postgres -d organizationdb -F c -f "C:\db_backup\organizationdb.backup"
pg_dump -U postgres -d patientdb      -F c -f "C:\db_backup\patientdb.backup"
pg_dump -U postgres -d pharmacydb     -F c -f "C:\db_backup\pharmacydb.backup"
pg_dump -U postgres -d pricingdb      -F c -f "C:\db_backup\pricingdb.backup"

# 2. Copy C:\db_backup\ to the target PC, then restore:
pg_restore -U postgres -d authdb         "C:\db_backup\authdb.backup"
pg_restore -U postgres -d appointmentdb  "C:\db_backup\appointmentdb.backup"
# ... repeat for each database
```

---

*Built with ❤️ — Unity Hospital Administration System*
