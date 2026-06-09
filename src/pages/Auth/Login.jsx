
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSchool,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserFriends,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("admin");
  const [formData, setFormData] = useState({
    email: "admin@school.com",
    password: "admin123",
  });

  const roleCredentials = {
    admin: {
      email: "admin@school.com",
      password: "admin123",
    },
    teacher: {
      email: "teacher@school.com",
      password: "teacher123",
    },
    parent: {
      email: "parent@school.com",
      password: "parent123",
    },
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData(roleCredentials[selectedRole]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(formData.email, formData.password, role);

    if (!result.success) {
      alert(result.message);
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        role: role,
        email: formData.email,
      })
    );

    localStorage.setItem("role", role);
    localStorage.setItem("isLoggedIn", "true");

    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else if (role === "parent") {
      navigate("/parent-dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <FaSchool />
          <h1>EduSmart</h1>
        </div>

        <h2>School Management System</h2>
        <p>
          Login as Admin, Teacher or Parent to access role-based dashboard and
          school features.
        </p>
      </div>

      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Select your role and login</p>

        <div className="role-selector">
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => handleRoleChange("admin")}
          >
            <FaUserShield />
            Admin
          </button>

          <button
            type="button"
            className={role === "teacher" ? "active" : ""}
            onClick={() => handleRoleChange("teacher")}
          >
            <FaChalkboardTeacher />
            Teacher
          </button>

          <button
            type="button"
            className={role === "parent" ? "active" : ""}
            onClick={() => handleRoleChange("parent")}
          >
            <FaUserFriends />
            Parent
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="demo-login">
          <h4>Demo Login</h4>
          <p>Admin: admin@school.com / admin123</p>
          <p>Teacher: teacher@school.com / teacher123</p>
          <p>Parent: parent@school.com / parent123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
