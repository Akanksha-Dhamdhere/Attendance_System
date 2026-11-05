
import React, { useState } from "react";
import TeacherLogin from "./Component/TeacherLogin.jsx";
import StudentLogin from "./Component/StudentLogin.jsx";
import "./Component/Login.css";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleTeacherLogin = (user, token) => {
    setLoggedInUser(user);

    if (token) {
      localStorage.setItem("attendanceToken", token);
    }

    setPage("teacherDashboard");
  };

  if (page === "teacher") {
    return (
      <TeacherLogin
        onBack={() => setPage("home")}
        onLoginSuccess={handleTeacherLogin}
      />
    );
  }

  if (page === "student") {
    return <StudentLogin onBack={() => setPage("home")} />;
  }

  if (page === "teacherDashboard") {
    return (
      <div className="home-page">
        <div className="home-overlay">
          <img
            src="/clg_logo.jpg"
            alt="College Logo"
            className="college-logo"
          />

          <h1>Welcome, {loggedInUser?.name || "Teacher"}!</h1>

          <p className="college-name">
            Government college of Engineering&Research
            <br />
            Avasari Khurad,Pune
          </p>

          <h2>Digital Attendance Management System</h2>

          <button
            className="login-card"
            onClick={() => {
              localStorage.removeItem("attendanceToken");
              setLoggedInUser(null);
              setPage("home");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-overlay">
        <img
          src="/clg_logo.jpg"
          alt="College Logo"
          className="college-logo"
        />

        <h1>College Attendance Management System</h1>

        <p className="college-name">
          Government college of Engineering&Research
          <br />
          Avasari Khurad,Pune
        </p>

        <div className="login-options">
          <button
            className="login-card"
            onClick={() => setPage("teacher")}
          >
            <span className="card-icon">👨‍🏫</span>
            <h2>Teacher</h2>
            <p>Manage student attendance and records</p>
            <span className="card-action">Continue →</span>
          </button>

          <button
            className="login-card"
            onClick={() => setPage("student")}
          >
            <span className="card-icon">🎓</span>
            <h2>Student</h2>
            <p>View your attendance history</p>
            <span className="card-action">Continue →</span>
          </button>
        </div>

        <footer>Digital Attendance Management System</footer>
      </div>
    </div>
  );
}
