import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserTie,
  FaBookOpen,
  FaRupeeSign,
  FaPlus,
  FaBell,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";
import TeacherDashboard from "../TeacherDashboard/TeacherDashboard";


function Dashboard() {
  const navigate = useNavigate();
const { currentUser } = useAuth();
  const [data, setData] = useState({
    students: [],
    staff: [],
    classes: [],
    payments: [],
    approvals: [],
    notifications: [],
    documents: [],
    certificates: [],
  });


  const [showNotifications, setShowNotifications] = useState(false);

  const loadDashboardData = () => {
    setData({
      students: JSON.parse(localStorage.getItem("students")) || [],
      staff: JSON.parse(localStorage.getItem("staff")) || [],
      classes: JSON.parse(localStorage.getItem("classes")) || [],
      payments: JSON.parse(localStorage.getItem("feePayments")) || [],
      approvals: JSON.parse(localStorage.getItem("approvalRequests")) || [],
      notifications: JSON.parse(localStorage.getItem("notifications")) || [],
      documents: JSON.parse(localStorage.getItem("documents")) || [],
      certificates: JSON.parse(localStorage.getItem("certificates")) || [],
    });
  };

  useEffect(() => {
    loadDashboardData();

    window.addEventListener("dashboardUpdate", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);

    return () => {
      window.removeEventListener("dashboardUpdate", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
    };
  }, []);

  const totalRevenue = data.payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pendingApprovals = data.approvals.filter(
    (item) => item.status === "Pending"
  );

  const recentActivities = [
    ...data.students.slice(0, 2).map((s) => ({
      text: `${s.name} admitted to Grade ${s.className}`,
      type: "student",
    })),
    ...data.payments.slice(0, 2).map((p) => ({
      text: `${p.student || p.name || "Student"} paid ₹${p.amount}`,
      type: "fee",
    })),
    ...data.documents.slice(0, 1).map((d) => ({
      text: `${d.title} uploaded`,
      type: "document",
    })),
  ];

  const alerts = [
    ...data.notifications.slice(0, 2),
    ...pendingApprovals.slice(0, 2).map((item) => ({
      id: item.id,
      text: `${item.title} from ${item.requestedBy}`,
    })),
  ];

  const approveRequest = (id) => {
    const updated = data.approvals.map((item) =>
      item.id === id ? { ...item, status: "Approved" } : item
    );

    localStorage.setItem("approvalRequests", JSON.stringify(updated));
    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const rejectRequest = (id) => {
    const updated = data.approvals.map((item) =>
      item.id === id ? { ...item, status: "Rejected" } : item
    );

    localStorage.setItem("approvalRequests", JSON.stringify(updated));
    window.dispatchEvent(new Event("dashboardUpdate"));
  };
if (currentUser?.role === "teacher") {
  return <TeacherDashboard />;
}

if (currentUser?.role === "parent") {
  return <div className="dashboard-page"><h2>Parent Dashboard</h2></div>;
}

  return (
    <div className="dashboard-page">
      <div className="dashboard-title-row">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome Back, {currentUser?.name || "Admin"}. Here’s what’s happening today.</p>
        </div>

        <div className="dashboard-actions">
          
          <button
            className="blue-action-btn"
            onClick={() => navigate("/communication")}
          >
            <FaBell /> New Announcement
          </button>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <FaUsers />
          <h3>{data.students.length || 0}</h3>
          <p>Total Students</p>
        </div>

        <div className="dashboard-stat-card">
          <FaUserTie />
          <h3>{data.staff.length || 0}</h3>
          <p>Total Staff</p>
        </div>

        <div className="dashboard-stat-card">
          <FaBookOpen />
          <h3>{data.classes.length || 0}</h3>
          <p>Total Classes</p>
        </div>

        <div className="dashboard-stat-card">
          <FaRupeeSign />
          <h3>₹{totalRevenue.toLocaleString("en-IN")}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>Live update from today</p>

          {recentActivities.length > 0 ? (
            recentActivities.map((item, index) => (
              <div className="activity-item" key={index}>
                <span className="activity-dot">✓</span>
                <p>{item.text}</p>
              </div>
            ))
          ) : (
            <p>No recent activity</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Alerts</h3>
          <p>{alerts.length} unread notifications</p>

          {alerts.length > 0 ? (
            alerts.map((item) => (
              <div className="alert-item" key={item.id}>
                <FaExclamationTriangle />
                <p>{item.text}</p>
              </div>
            ))
          ) : (
            <p>No alerts</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Pending Approvals</h3>
          <p>Require your action</p>

          {pendingApprovals.length > 0 ? (
            pendingApprovals.slice(0, 3).map((item) => (
              <div className="approval-mini-card" key={item.id}>
                <div>
                  <h4>{item.requestedBy}</h4>
                  <p>{item.reason}</p>
                </div>

                <div className="approval-mini-actions">
                  <button onClick={() => approveRequest(item.id)}>
                    <FaCheck /> Approve
                  </button>
                  <button onClick={() => rejectRequest(item.id)}>
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending approvals</p>
          )}
        </div>
      </div>

      
      {showNotifications && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          {alerts.length > 0 ? (
            alerts.map((item) => <p key={item.id}>{item.text}</p>)
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;