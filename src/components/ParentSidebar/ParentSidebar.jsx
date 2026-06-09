import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaCalendarCheck,
  FaChartBar,
  FaClipboardList,
  FaComments,
  FaBell,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ParentSidebar.css";

function ParentSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/parent-dashboard", icon: <FaTachometerAlt /> },
    { name: "Child Info", path: "/parent-child", icon: <FaUserGraduate /> },
   
    { name: "Messages", path: "/parent-messages", icon: <FaComments /> },
    
  ];

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="parent-sidebar">
      <div className="parent-logo-box">
        <div className="parent-logo-icon">👨‍👩‍👧</div>
        <h2>EduSmart</h2>
        <p>Parent Portal</p>
      </div>

      <nav className="parent-sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "parent-menu-link active" : "parent-menu-link"
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button className="parent-logout-btn" onClick={logout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default ParentSidebar;