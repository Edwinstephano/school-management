# School Management System

Full-stack school management system with role-based dashboards for Admin, Principal, Teacher, Staff, and Parent.

## Tech Stack

- **Backend**: Django, Django REST Framework, SimpleJWT, SQLite
- **Frontend**: React + Vite, Tailwind CSS, React Router, Axios

## Backend Setup

```bash
cd /home/School-management
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py createsuperuser  # then set role=ADMIN in /admin
python3 manage.py runserver 8001
```

### Configure data

1. Open `http://localhost:8000/admin/`.
2. For your superuser, set `role = ADMIN`.
3. Create users for:
   - Principal (`role=PRINCIPAL`)
   - Teacher (`role=TEACHER`)
   - Staff (`role=STAFF`)
   - Parent (`role=PARENT`)
4. For each parent user, create a `ParentProfile`.
5. Create `ClassRoom` entries.
6. Create `Student` entries linked to `ClassRoom` and `ParentProfile`.

## Frontend Setup

```bash
cd /home/bsoft/School-management/frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Authentication

- Login via `/login` with your Django username/password.
- Tokens are stored in `localStorage` (`access`, `refresh`).
- Axios interceptors automatically attach the `Authorization: Bearer <access>` header and refresh the token via `/api/auth/refresh/` when needed.

## Roles & Dashboards

- **Admin**
  - `/admin`: System stats (students count).
  - `/students`: Create/update/delete students.
  - `/meetings`: Manage meetings.

- **Principal**
  - `/principal`: Students count + classes overview.
  - `/students`: Shared student management.
  - `/meetings`: Create meetings for classes.

- **Teacher**
  - `/teacher`: Todays classes and quick link to attendance.
  - `/attendance`: Mark attendance per class and date (PRESENT/ABSENT/LATE).
  - `/staff/exams`: Enter exam results.

- **Staff**
  - `/staff/exams`: Results entry.

- **Parent**
  - `/parent`: Children summary + recent notifications.
  - `/parent/notifications`: All notifications (attendance alerts, exam results, meetings) with mark-as-read.

## Core Features

- **Student Management**
  - Admin/Principal create, edit, delete students.
  - Fields: name, roll number, class (ClassRoom), parent (ParentProfile), address, phone, email, photo.

- **Attendance**
  - Teacher selects class & date and marks each student as PRESENT, ABSENT, or LATE.
  - Bulk save to `/api/attendance/bulk_create/`.
  - ABSENT students automatically generate notifications for their parents.

- **Exams & Results**
  - Staff/Teacher define exams and enter marks, totals, grades, and remarks.
  - Results saved in bulk via `/api/results/bulk_create/`.
  - Parents receive notifications when results are published.

- **Meetings**
  - Principal (or Admin) creates meetings with title, description, date, time, class, and location.
  - Parents of students in the class receive meeting notifications.

- **Notifications**
  - Notification types: Attendance Alert, Exam Result, Parent Meeting.
  - Parents see notifications on dashboard and notifications page.
  - Notifications can be marked as read.

## API Overview

- Auth:
  - `POST /api/auth/login/`
  - `POST /api/auth/refresh/`

- Students:
  - `GET /api/students/`
  - `POST /api/students/`
  - `GET/PUT/DELETE /api/students/{id}/`

- Attendance:
  - `POST /api/attendance/bulk_create/`
  - `GET /api/attendance/class/{class_id}/?date=YYYY-MM-DD`
  - `GET /api/attendance/student/{student_id}/`

- Exams:
  - `POST /api/exams/`
  - `GET /api/exams/`

- Results:
  - `POST /api/results/bulk_create/`
  - `GET /api/results/student/{student_id}/`

- Meetings:
  - `POST /api/meetings/`
  - `GET /api/meetings/`

- Notifications:
  - `GET /api/notifications/`
  - `PATCH /api/notifications/{id}/mark_read/`

## Notes

- This project is configured for local development (DEBUG=True, CORS open). For production, tighten CORS, set allowed hosts, and secure the secret key.
