# Foundation System — Functional Specification Document (FSD)

*Project*: General Givers Family — Foundation Management System

*Tech stack*: Java (monolithic backend — Spring Boot recommended), PostgreSQL (port 5433, user peter, password manu), Next.js (frontend), JWT for authentication, Flyway for DB migrations.

*Purpose*
This document describes the functional requirements, data model, API design, pages, authentication/authorization, reporting requirements and a practical implementation plan for a Foundation Management System. The system will be run locally during development and deployed later.

---

## 1. High-level overview

The system will provide:

* A modern public-facing landing site: Home, About, Projects, Donate, Contact.
* Member signup/login and profile management.
* Admin dashboard for managing users, projects, visits to children homes, funds raised, and generating reports.
* Roles: SUPER_USER, CHAIRMAN, SECRETARY, TREASURER, and MEMBER (regular members).
* Backend: Java monolith (Spring Boot), exposing RESTful JSON APIs.
* Frontend: Next.js (React) for both landing pages and admin UI.
* Database: PostgreSQL on localhost:5433 with credentials peter / manu.

---

## 2. Actors & roles

* *Guest*: Browse landing pages and projects; can donate (guest checkout or register first).
* *Member*: Can sign up, login, view personal dashboard, donate, and view project participation history.
* *Super User*: Full system administration (manage users, roles, system settings).
* *Chairman*: View reports, approve high-level activities, oversee projects.
* *Secretary*: Manage communications, events, meeting records, and project updates.
* *Treasurer*: Manage funds, create financial records, view and generate financial reports.

Permissions matrix (high-level):

* CRUD Projects: Super User, Chairman, Secretary
* Record Visits: Secretary, Chairman
* Manage Users / Roles: Super User
* Manage Donations & Financial records: Treasurer, Super User
* View Reports: Chairman, Treasurer, Super User

---

## 3. Functional requirements

### 3.1 Public landing site (Next.js)

* Home: hero section, mission & vision (from provided image content), highlights of recent projects, CTA to Donate and Join.
* About: foundation story, leadership, contact.
* Projects: list of projects with filters (active, past), project detail page with images and donation CTA.
* Donate: donation form (one-time donation for MVP) with the ability to either input card details (or integrate a payment provider later). For local dev, allow simulated payments.
* Contact: contact form.

### 3.2 Authentication & Authorization

* Signup: name, email, password, phone (optional), address (optional). Email verification can be stubbed for local dev.
* Login: email + password. Return JWT token (access token) with expiration; frontend stores token securely (httpOnly cookie recommended; for MVP local dev storing in memory/localStorage acceptable but note security tradeoffs).
* Roles assigned by Super User.
* Passwords hashed (BCrypt) in DB.

### 3.3 Member features

* Profile page: view/edit profile, change password.
* View donation history.
* View joined projects or involvement history.

### 3.4 Admin Dashboard (Next.js, protected)

* Manage Users: list, create, edit, deactivate, assign roles.
* Manage Projects: CRUD projects, upload images, set target and status (active/completed).
* Manage Visits: record visits to children homes with date, participants, notes, photos.
* Donations & Funds: list donations (donor, amount, date, project if any, payment status), export CSV, refund/cancel operations (if needed later).
* Reports: pre-built reports (see section 6).

### 3.5 Non-functional requirements

* Local-first development with easy setup.
* Use environment variables for sensitive settings.
* Migration tool (Flyway) for DB schema changes.
* Logging and structured error responses.
* Input validation and server-side checks.
* Simple role-based access control.

---

## 4. Data model (high-level)

### Entities

* users (id, name, email, password_hash, phone, role, is_active, created_at, updated_at)
* roles (id, name) — optional normalized table
* projects (id, title, description, status, target_amount, funds_raised, start_date, end_date, created_by, created_at)
* donations (id, donor_user_id (nullable for guest), donor_name, email, amount, date, method, status, project_id)
* visits (id, visit_date, location, notes, participants_json, created_by, photos_json)
* audit_logs (id, user_id, action_type, entity, entity_id, details_json, timestamp)
* children_homes (id, name, location, contact, notes) — if you need to track homes specifically

### Suggested SQL schema (Postgres)

```sql
-- Run in a database named general_givers (create manually or via migration)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, ACTIVE, COMPLETED
  target_amount NUMERIC(12,2) DEFAULT 0,
  funds_raised NUMERIC(12,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_user_id UUID REFERENCES users(id),
  donor_name TEXT,
  email TEXT,
  amount NUMERIC(12,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  method TEXT,
  status TEXT DEFAULT 'COMPLETED', -- PENDING, COMPLETED, FAILED, REFUNDED
  project_id UUID REFERENCES projects(id)
);

CREATE TABLE children_homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  contact TEXT,
  notes TEXT
);

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date DATE NOT NULL,
  location TEXT,
  children_home_id UUID REFERENCES children_homes(id),
  notes TEXT,
  participants JSONB,
  created_by UUID REFERENCES users(id),
  photos JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  action_type TEXT,
  entity TEXT,
  entity_id UUID,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

*Connection string example*:

```
jdbc:postgresql://localhost:5433/general_givers?user=peter&password=manu
```

---

## 5. Backend API design (RESTful)

Base path: /api/v1
Authentication: Authorization: Bearer <jwt> header.

### Auth

* POST /api/v1/auth/signup — body: {name,email,password,phone} -> 201 + user (email verification optional)
* POST /api/v1/auth/login — body: {email,password} -> 200 + {accessToken, expiresIn, user}
* POST /api/v1/auth/refresh — refresh token flow (optional)

### Users

* GET /api/v1/users — list (admin only)
* GET /api/v1/users/:id — get user
* PUT /api/v1/users/:id — update user (admin or owner)
* PATCH /api/v1/users/:id/role — change role (super user)
* DELETE /api/v1/users/:id — deactivate (super user)

### Projects

* GET /api/v1/projects — list public projects (filters: status)
* GET /api/v1/projects/:id — detail
* POST /api/v1/projects — create (admin roles)
* PUT /api/v1/projects/:id — update
* DELETE /api/v1/projects/:id — delete

### Donations

* POST /api/v1/donations — create donation (guest or logged in)
* GET /api/v1/donations — list (admin or treasurer), supports filters and pagination
* GET /api/v1/donations/:id — detail

### Visits

* POST /api/v1/visits — record a visit
* GET /api/v1/visits — list visits (filter by date range)

### Reports

* GET /api/v1/reports/funds-by-month?year=2025 — aggregated monthly funds
* GET /api/v1/reports/projects-progress — projects with % funded
* GET /api/v1/reports/visits?from=YYYY-MM-DD&to=YYYY-MM-DD — visits summary

---

## 6. Reporting requirements (examples)

Provide the following pre-built reports in the admin dashboard (CSV export available):

1. *Funds raised (period)*: total donations by day/week/month; breakdown by project; top donors.
2. *Projects status*: list projects with target vs funded and percent complete.
3. *Visits log*: visits performed between dates, participants, notes, photos count.
4. *Users & Roles*: count per role, active/inactive accounts.
5. *Donation ledger*: list of all donations with status, donor, method.

Each report endpoint should accept from, to, projectId, and pagination parameters.

---

## 7. Security & Operational notes

* *Password storage*: always BCrypt.
* *JWT*: short-lived access tokens (e.g., 15m) + optional refresh tokens.
* *CORS*: restrict frontend origins in production.
* *Rate limiting*: basic limit on auth endpoints.
* *Input validation*: use server-side validation for all API payloads.
* *Sensitive config*: keep DB credentials, JWT secret in environment variables. For local dev, .env.local (Next.js) and application-local.yml for Spring Boot can be used, but never check secrets into source control.

Sample env keys:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/general_givers
SPRING_DATASOURCE_USERNAME=peter
SPRING_DATASOURCE_PASSWORD=manu
JWT_SECRET=replace_this_with_secure_random
FRONTEND_URL=http://localhost:3000
```

---

## 8. Local setup & run instructions (MVP)

### Prereqs

* Java 17+ (17)
* Maven
* Node.js 18+
* PostgreSQL running on port 5433; create database general_givers and user peter with password manu (or use provided connection string)

## 9. Implementation suggestions & libraries

### Backend (Java / Spring Boot)

* Spring Boot Web, Spring Security, Spring Data JPA, Flyway, PostgreSQL JDBC driver, MapStruct (optional), Lombok (optional), Validation (hibernate-validator), JWT library (jjwt or spring-security-oauth2-jose), Springdoc OpenAPI for API docs.

### Frontend (Next.js)

* Next.js 14+, React, Tailwind CSS (or Chakra UI) for a modern look, react-query or SWR for data fetching, apexcharts (or recharts) for charts in the admin dashboard, react-hook-form + zod for forms.

---

## 12. Roadmap & MVP scope

*MVP (phase 1)*

* Landing pages (Home, About, Projects, Donate).
* User signup/login with JWT.
* Admin dashboard with user management, project CRUD, donation recording, and basic reports.
* Postgres DB and Flyway migrations.

*Phase 2*

* Payment gateway integration (Stripe/PayPal).
* Email verification and notifications.
* Advanced reporting & scheduled exports.
* Role-based UI enhancements.

## 13. Deliverables

* Full codebase: backend/ (Spring Boot monolith) and frontend/ (Next.js app).
* Database migration scripts (Flyway SQL files).
* OpenAPI (Swagger) spec for all API endpoints.
* Documentation: README, this FSD, setup scripts, deployment notes.