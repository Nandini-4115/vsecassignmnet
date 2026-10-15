
import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }

      setIsLoggedIn(true);
      setMessage("Login successful!");
      await getStudents();
    } catch (error) {
      setLoginError(
        "incorrect password."
      );
    }
  }

  // Get all students
  async function getStudents() {
    try {
      const response = await fetch(`${API}/students`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load students");
      }

      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Get attendance for selected date
  async function getAttendance(selectedDate) {
    if (!selectedDate) {
      setRecords([]);
      return;
    }

    try {
      const response = await fetch(
        `${API}/attendance?date=${selectedDate}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load attendance");
      }

      setRecords(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Load students when the app starts
  useEffect(() => {
    getStudents();
  }, []);

  // Add a new student
  async function addStudent(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          rollNo: rollNo.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not add student");
      }

      setName("");
      setRollNo("");
      setMessage("Student added successfully!");

      await getStudents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Mark a student Present or Absent
  async function markAttendance(studentId, status) {
    if (!date) {
      setMessage("Please select a date first.");
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId,
          date,
          status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save attendance");
      }

      setMessage(`${status} attendance saved successfully!`);

      await getAttendance(date);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Find a student's saved attendance
  function getStatus(studentId) {
    const record = records.find(
      item => item.studentId === studentId
    );

    return record ? record.status : "Not Marked";
  }

  // Dashboard totals
  const presentCount = records.filter(
    record => record.status === "Present"
  ).length;

  const absentCount = records.filter(
    record => record.status === "Absent"
  ).length;

  const notMarkedCount = Math.max(
    0,
    students.length - records.length
  );

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <form className="login-box" onSubmit={handleLogin}>
          <div className="login-icon"></div>

          <h1>Attendance Portal</h1>
          <p className="login-description">
            Login to manage student attendance
          </p>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {loginError && (
            <p className="login-error">{loginError}</p>
          )}

          <button type="submit" className="login-button">
            Login
          </button>

          
        </form>
      </div>
    );
  }

  // ATTENDANCE DASHBOARD
  return (
    <div className="container">
      <header className="dashboard-header">
        <div>
          <p className="portal-label">STUDENT MANAGEMENT</p>
          <h1>Attendance Management System</h1>
          <p className="welcome-text">
            Welcome, {username}!
          </p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={() => {
            setIsLoggedIn(false);
            setUsername("");
            setPassword("");
            setDate("");
            setRecords([]);
            setMessage("");
          }}
        >
          Logout
        </button>
      </header>

      {message && (
        <p className="message">{message}</p>
      )}

      <section className="panel">
        <h2>Register New Student</h2>

        <form className="student-form" onSubmit={addStudent}>
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNo}
            onChange={e => setRollNo(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "+ Add Student"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Daily Attendance</h2>

        <div className="date-row">
          <label htmlFor="attendance-date">
            Select Attendance Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={e => {
              const selectedDate = e.target.value;
              setDate(selectedDate);
              setRecords([]);
              getAttendance(selectedDate);
            }}
          />
        </div>

        <div className="summary">
          <div className="summary-card total-card">
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>

          <div className="summary-card present-card">
            <span>Present</span>
            <strong>{date ? presentCount : "—"}</strong>
          </div>

          <div className="summary-card absent-card">
            <span>Absent</span>
            <strong>{date ? absentCount : "—"}</strong>
          </div>

          <div className="summary-card pending-card">
            <span>Not Marked</span>
            <strong>{date ? notMarkedCount : "—"}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Student Attendance Records</h2>

        {!date && (
          <p className="info-message">
            Select a date before marking attendance.
          </p>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Attendance Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map(student => {
                const status = getStatus(student._id);

                return (
                  <tr key={student._id}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>

                    <td>
                      <span
                        className={
                          "status " +
                          status.toLowerCase().replace(" ", "-")
                        }
                      >
                        {status}
                      </span>
                    </td>

                    <td className="action-cell">
                      <button
                        type="button"
                        className="present-button"
                        disabled={!date}
                        onClick={() =>
                          markAttendance(student._id, "Present")
                        }
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        className="absent-button"
                        disabled={!date}
                        onClick={() =>
                          markAttendance(student._id, "Absent")
                        }
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-row">
                    No students registered yet. Add a student above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        Attendance Management System
      </footer>
    </div>
  );
}

export default App;
