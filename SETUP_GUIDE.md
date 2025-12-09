# School Management System - Setup Guide

This guide will help you clone and run the School Management System on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:
- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads/)

## Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Edwinstephano/school-management.git
cd school-management
```

## Step 2: Backend Setup (Django)

### 2.1 Create a Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Run Database Migrations

```bash
python manage.py migrate
```

### 2.4 Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 2.5 Start the Django Development Server

```bash
python manage.py runserver
```

The backend will be running at: **http://localhost:8000**

## Step 3: Frontend Setup (React + Vite)

Open a **new terminal window** (keep the backend running in the first terminal).

### 3.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Node Dependencies

```bash
npm install
```

### 3.3 Start the Development Server

```bash
npm run dev
```

The frontend will be running at: **http://localhost:5173**

## Step 4: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Log in with the superuser credentials you created
3. Start using the School Management System!

## Project Structure

```
school-management/
├── backend/              # Django project settings
├── core/                 # Main Django app (models, views, APIs)
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Auth)
│   │   └── api/          # API client
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
└── db.sqlite3           # SQLite database (created after migrations)
```

## Features

- **Role-based Access Control**: Admin, Principal, Teachers, Staff, and Parents
- **Student Management**: Add, edit, and view student records
- **Attendance Tracking**: Mark and view attendance records
- **Exam Results**: Enter and view exam results
- **Parent Notifications**: Send notifications to parents
- **Parent-Teacher Meetings**: Schedule and manage meetings
- **Classroom Management**: Organize students by classrooms

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
python manage.py runserver 8001
```

**Database errors:**
```bash
# Delete db.sqlite3 and run migrations again
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Issues

**Port already in use:**
Edit `frontend/vite.config.js` and change the port number.

**Module not found errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

If you encounter any issues, please check:
1. All prerequisites are installed correctly
2. Virtual environment is activated (for backend)
3. Both backend and frontend servers are running
4. You're using the correct URLs (localhost:8000 for backend, localhost:5173 for frontend)

## License

This project is for educational purposes.
