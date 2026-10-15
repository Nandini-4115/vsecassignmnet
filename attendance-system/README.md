# Attendance Management System

A beginner-friendly college mini project made with React (frontend), Express (backend), and MongoDB (database).

## Folder structure

- `frontend/` — React and Vite user interface
- `backend/` — Express API and MongoDB models

## Requirements
- Node.js and npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Run the project

Open two terminals in VS Code.

### Terminal 1 — backend
```powershell
cd backend
npm install
npm run dev
```

### Terminal 2 — frontend
```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite (usually http://localhost:5173).

## MongoDB
By default the backend connects to `mongodb://127.0.0.1:27017/attendance_system`. The database and collections are created by MongoDB when the first student/attendance record is saved. You do not need MongoDB Compass; it is only an optional graphical viewer. MongoDB Server must be running locally, or set `MONGODB_URI` in `backend/.env` to your Atlas connection string.

## API routes
- `GET /api/health` — check backend and database status
- `GET /api/students` — list students
- `POST /api/students` — add student (`name`, `rollNumber`)
- `DELETE /api/students/:id` — delete student
- `GET /api/attendance?date=YYYY-MM-DD` — get attendance for a date
- `POST /api/attendance` — save attendance (`studentId`, `date`, `status`)
