import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [searchText, setSearchText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = () => {
      const teacherNotifications =
        JSON.parse(localStorage.getItem("teacherNotifications")) || [];

      const announcements =
        JSON.parse(localStorage.getItem("announcements")) || [];

      setNotifications([...teacherNotifications, ...announcements]);
    };

    loadNotifications();

    window.addEventListener("dashboardUpdate", loadNotifications);
    window.addEventListener(
      "teacherNotificationUpdate",
      loadNotifications
    );

    return () => {
      window.removeEventListener("dashboardUpdate", loadNotifications);
      window.removeEventListener(
        "teacherNotificationUpdate",
        loadNotifications
      );
    };
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);

    window.dispatchEvent(
      new CustomEvent("commonSearch", {
        detail: e.target.value.toLowerCase(),
      })
    );
  };

  return (
    <header className="header">
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <FaBell
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {notifications.length > 0 && (
            <span className="notification-count">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>

              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((note, index) => (
                  <div
                    className="notification-item"
                    key={note.id || index}
                  >
                    <strong>
                      {note.title || note.text || "Notification"}
                    </strong>

                    <p>{note.message || note.description || ""}</p>

                    <small>{note.date || note.time || ""}</small>
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>

        <div className="profile-box">
          <div className="profile-circle-header">S</div>
          <div>
            <h4>Sarah Johnson</h4>
            <p>Teacher</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;