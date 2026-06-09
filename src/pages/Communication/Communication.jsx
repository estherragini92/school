import { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaBell,
  FaPaperPlane,
  FaEnvelope,
  FaSms,
  FaUsers,
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import "./Communication.css";

const defaultParents = [
  {
    id: 1,
    name: "Ravi Kumar",
    student: "Arjun Kumar",
    phone: "9876543210",
    email: "ravi@example.com",
  },
  {
    id: 2,
    name: "Suresh Sharma",
    student: "Priya Sharma",
    phone: "9876501234",
    email: "suresh@example.com",
  },
];

const defaultAnnouncements = [
  {
    id: 1,
    title: "Annual Day Celebration",
    audience: "All Parents",
    priority: "High",
    date: "2026-06-05",
    status: "Published",
    message: "Annual Day celebration will be held on June 5.",
  },
  {
    id: 2,
    title: "Exam Timetable Released",
    audience: "Grade 5",
    priority: "Medium",
    date: "2026-06-07",
    status: "Scheduled",
    message: "Exam timetable has been released.",
  },
];

const emptyAnnouncement = {
  title: "",
  audience: "All Parents",
  priority: "Medium",
  date: new Date().toISOString().split("T")[0],
  status: "Published",
  message: "",
};

const emptyBroadcast = {
  type: "Email",
  recipients: "All Parents",
  customPhone: "",
  customEmail: "",
  subject: "",
  message: "",
};

function Communication() {
  const [activeTab, setActiveTab] = useState("announcements");

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("announcements");
    return saved ? JSON.parse(saved) : defaultAnnouncements;
  });

  const [parents] = useState(() => {
    const savedParents = localStorage.getItem("parents");
    return savedParents ? JSON.parse(savedParents) : defaultParents;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [broadcastHistory, setBroadcastHistory] = useState(() => {
    const saved = localStorage.getItem("broadcastHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [announcementForm, setAnnouncementForm] = useState({
    ...emptyAnnouncement,
  });

  const [broadcastForm, setBroadcastForm] = useState({
    ...emptyBroadcast,
  });

  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("broadcastHistory", JSON.stringify(broadcastHistory));
  }, [broadcastHistory]);

  const addNotification = (text) => {
    const newNotification = {
      id: Date.now(),
      text,
      time: new Date().toLocaleString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const openEditAnnouncement = (announcement) => {
    setEditingId(announcement.id);

    setAnnouncementForm({
      title: announcement.title || "",
      audience: announcement.audience || "All Parents",
      priority: announcement.priority || "Medium",
      date: announcement.date || new Date().toISOString().split("T")[0],
      status: announcement.status || "Published",
      message: announcement.message || "",
    });

    setShowAnnouncementModal(true);
  };

  const closeAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setEditingId(null);
    setAnnouncementForm({ ...emptyAnnouncement });
  };

  const sendTeacherNotification = (announcement) => {
    const notification = {
      id: Date.now(),
      title: announcement.title,
      message: announcement.message,
      audience: announcement.audience,
      priority: announcement.priority,
      type: "Announcement",
      date: new Date().toLocaleString(),
      read: false,
    };

    const oldNotifications =
      JSON.parse(localStorage.getItem("teacherNotifications")) || [];

    localStorage.setItem(
      "teacherNotifications",
      JSON.stringify([notification, ...oldNotifications])
    );

    window.dispatchEvent(new Event("teacherNotificationUpdate"));
    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const saveAnnouncement = (e) => {
    e.preventDefault();

    if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
      alert("Please enter title and message");
      return;
    }

    const newAnnouncement = {
      id: editingId || Date.now(),
      title: announcementForm.title.trim(),
      audience: announcementForm.audience,
      priority: announcementForm.priority,
      date: announcementForm.date,
      status: announcementForm.status,
      message: announcementForm.message.trim(),
    };

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((item) => (item.id === editingId ? newAnnouncement : item))
      );

      addNotification(`${newAnnouncement.title} announcement updated`);
    } else {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      addNotification(`${newAnnouncement.title} announcement created`);
    }

    sendTeacherNotification(newAnnouncement);
    closeAnnouncementModal();
  };

  const deleteAnnouncement = (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    const selectedAnnouncement = announcements.find((item) => item.id === id);

    setAnnouncements((prev) => prev.filter((item) => item.id !== id));

    if (selectedAnnouncement) {
      addNotification(`${selectedAnnouncement.title} announcement deleted`);
    }
  };

  const getRecipients = () => {
    if (broadcastForm.recipients === "All Parents") {
      return parents.map((parent) => ({
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
      }));
    }

    if (broadcastForm.recipients === "Custom Number") {
      return [
        {
          name: "Custom Parent",
          phone: broadcastForm.customPhone,
          email: broadcastForm.customEmail,
        },
      ];
    }

    return [];
  };

  const sendBroadcastToParentMessages = (sentRecord) => {
    const oldMessages = JSON.parse(localStorage.getItem("messages")) || [];

    const parentMessages = sentRecord.recipients.map((parent, index) => ({
      id: Date.now() + index,
      sender: "Admin",
      receiver: "Parent",
      parentName: parent.name,
      email: parent.email,
      phone: parent.phone,
      subject: sentRecord.subject,
      text: sentRecord.message,
      date: sentRecord.time,
      type: sentRecord.type,
    }));

    localStorage.setItem(
      "messages",
      JSON.stringify([...parentMessages, ...oldMessages])
    );

    window.dispatchEvent(new Event("dashboardUpdate"));
  };

const sendBroadcastEmail = async (sentRecord) => {
  try {
    for (const parent of sentRecord.recipients) {
      if (!parent.email) continue;

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "af9d57ed-1bc8-4484-bd58-929ebe0682e2",
            subject: sentRecord.subject,
            from_name: "EduSmart School",
            name: parent.name,
            email: parent.email,
            message: sentRecord.message,
          }),
        }
      );

      const result = await response.json();
      console.log(result);
    }
  } catch (error) {
    console.error("Email error:", error);
  }
};

  const sendBroadcast = (e) => {
    e.preventDefault();

    if (!broadcastForm.subject.trim() || !broadcastForm.message.trim()) {
      alert("Please enter subject and message");
      return;
    }

    if (
      broadcastForm.recipients === "Custom Number" &&
      !broadcastForm.customPhone.trim()
    ) {
      alert("Please enter parent phone number");
      return;
    }

    const recipients = getRecipients();

    if (recipients.length === 0) {
      alert("No recipients selected.");
      return;
    }

    const sentRecord = {
      id: Date.now(),
      type: broadcastForm.type,
      recipients,
      subject: broadcastForm.subject.trim(),
      message: broadcastForm.message.trim(),
      time: new Date().toLocaleString(),
      status: "Delivered",
    };

    setBroadcastHistory((prev) => [sentRecord, ...prev]);
    sendBroadcastToParentMessages(sentRecord);

    if (
  broadcastForm.type === "Email" ||
  broadcastForm.type === "Email + SMS"
) {
  sendBroadcastEmail(sentRecord);
}

    addNotification(
      `${broadcastForm.type} broadcast sent to ${recipients.length} recipient(s)`
    );

    alert(
      "Message sent successfully in frontend simulation.\n\nReal SMS/Email needs backend + SMS/Email API."
    );

    setBroadcastForm({ ...emptyBroadcast });
  };

  const deleteBroadcast = (id) => {
    if (!window.confirm("Delete this broadcast history?")) return;

    setBroadcastHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const keyword = searchTerm.toLowerCase().trim();

    return (
      keyword === "" ||
      item.title.toLowerCase().includes(keyword) ||
      item.audience.toLowerCase().includes(keyword) ||
      item.priority.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword) ||
      item.message.toLowerCase().includes(keyword)
    );
  });

  const filteredNotifications = notifications.filter((item) => {
    const keyword = searchTerm.toLowerCase().trim();

    return (
      keyword === "" ||
      item.text.toLowerCase().includes(keyword) ||
      item.time.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="communication-page">
      <div className="page-title-row">
        <div>
          <h2>Communication</h2>
          <p>Manage announcements, notifications and broadcasts</p>
        </div>

        {activeTab === "announcements" && (
          <button
            type="button"
            className="add-btn"
            onClick={() => {
              setEditingId(null);
              setAnnouncementForm({
                title: "",
                audience: "All Parents",
                priority: "Medium",
                date: new Date().toISOString().split("T")[0],
                status: "Published",
                message: "",
              });
              setShowAnnouncementModal(true);
            }}
          >
            <FaPlus />
            New Announcement
          </button>
        )}
      </div>

      <div className="communication-tabs">
        <button
          type="button"
          className={activeTab === "announcements" ? "active" : ""}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements
        </button>

        <button
          type="button"
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>

        <button
          type="button"
          className={activeTab === "broadcast" ? "active" : ""}
          onClick={() => setActiveTab("broadcast")}
        >
          Broadcast
        </button>
      </div>

      {activeTab !== "broadcast" && (
        <div className="comm-search-card">
          <FaSearch />
          <input
            type="text"
            placeholder="Search communication records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="communication-card">
          <table>
            <thead>
              <tr>
                <th>Announcement</th>
                <th>Audience</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="announcement-title">
                        <FaBullhorn />
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                        </div>
                      </div>
                    </td>

                    <td>{item.audience}</td>

                    <td>
                      <span
                        className={
                          item.priority === "High"
                            ? "priority high"
                            : item.priority === "Low"
                            ? "priority low"
                            : "priority medium"
                        }
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td>{item.date}</td>

                    <td>
                      <span
                        className={
                          item.status === "Published"
                            ? "comm-status published"
                            : "comm-status scheduled"
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => openEditAnnouncement(item)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 25 }}>
                    No announcements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="notification-grid">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => (
              <div className="notification-card" key={note.id}>
                <div className="notification-icon">
                  <FaBell />
                </div>
                <div>
                  <h4>{note.text}</h4>
                  <p>{note.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="notification-card">
              <div className="notification-icon">
                <FaBell />
              </div>
              <div>
                <h4>No notifications yet</h4>
                <p>Create announcement or send broadcast</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "broadcast" && (
        <div className="broadcast-layout">
          <div className="broadcast-form-card">
            <h3>Send Broadcast Message</h3>

            <form onSubmit={sendBroadcast}>
              <div className="broadcast-type">
                <button
                  type="button"
                  className={broadcastForm.type === "Email" ? "active" : ""}
                  onClick={() =>
                    setBroadcastForm({ ...broadcastForm, type: "Email" })
                  }
                >
                  <FaEnvelope />
                  Email
                </button>

                <button
                  type="button"
                  className={broadcastForm.type === "SMS" ? "active" : ""}
                  onClick={() =>
                    setBroadcastForm({ ...broadcastForm, type: "SMS" })
                  }
                >
                  <FaSms />
                  SMS
                </button>

                <button
                  type="button"
                  className={
                    broadcastForm.type === "Email + SMS" ? "active" : ""
                  }
                  onClick={() =>
                    setBroadcastForm({
                      ...broadcastForm,
                      type: "Email + SMS",
                    })
                  }
                >
                  <FaPaperPlane />
                  Email + SMS
                </button>
              </div>

              <div className="form-group">
                <label>Recipients</label>
                <select
                  value={broadcastForm.recipients}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      recipients: e.target.value,
                    })
                  }
                >
                  <option>All Parents</option>
                  <option>Custom Number</option>
                </select>
              </div>

              {broadcastForm.recipients === "Custom Number" && (
                <>
                  <div className="form-group">
                    <label>Parent Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter parent mobile number"
                      value={broadcastForm.customPhone}
                      onChange={(e) =>
                        setBroadcastForm({
                          ...broadcastForm,
                          customPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {(broadcastForm.type === "Email" ||
                    broadcastForm.type === "Email + SMS") && (
                    <div className="form-group">
                      <label>Parent Email</label>
                      <input
                        type="email"
                        placeholder="parent@email.com"
                        value={broadcastForm.customEmail}
                        onChange={(e) =>
                          setBroadcastForm({
                            ...broadcastForm,
                            customEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={broadcastForm.subject}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      subject: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Type your message here..."
                  value={broadcastForm.message}
                  onChange={(e) =>
                    setBroadcastForm({
                      ...broadcastForm,
                      message: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>

              <button className="send-btn" type="submit">
                <FaPaperPlane />
                Send Broadcast
              </button>
            </form>
          </div>

          <div className="broadcast-stats-card">
            <h3>Broadcast Analytics</h3>

            <div className="broadcast-stat">
              <FaUsers />
              <div>
                <p>Total Parents</p>
                <h2>{parents.length}</h2>
              </div>
            </div>

            <div className="broadcast-stat">
              <FaEnvelope />
              <div>
                <p>Email Sent</p>
                <h2>
                  {
                    broadcastHistory.filter(
                      (item) =>
                        item.type === "Email" || item.type === "Email + SMS"
                    ).length
                  }
                </h2>
              </div>
            </div>

            <div className="broadcast-stat">
              <FaSms />
              <div>
                <p>SMS Sent</p>
                <h2>
                  {
                    broadcastHistory.filter(
                      (item) =>
                        item.type === "SMS" || item.type === "Email + SMS"
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          <div className="broadcast-history-card">
            <h3>Broadcast History</h3>

            {broadcastHistory.length > 0 ? (
              broadcastHistory.map((item) => (
                <div className="broadcast-history-item" key={item.id}>
                  <div>
                    <h4>
                      <FaCheckCircle /> {item.subject}
                    </h4>
                    <p>{item.message}</p>
                    <small>
                      {item.type} · {item.recipients.length} recipient(s) ·{" "}
                      {item.time}
                    </small>
                  </div>

                  <button type="button" onClick={() => deleteBroadcast(item.id)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p>No broadcast history yet.</p>
            )}
          </div>
        </div>
      )}

      {showAnnouncementModal && (
        <div className="modal-overlay">
          <div className="communication-modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Announcement" : "New Announcement"}</h3>

              <button type="button" onClick={closeAnnouncementModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveAnnouncement}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Audience</label>
                  <select
                    value={announcementForm.audience}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        audience: e.target.value,
                      })
                    }
                  >
                    <option>All Parents</option>
                    <option>All Students</option>
                    <option>All Teachers</option>
                    <option>Grade 5</option>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={announcementForm.priority}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={announcementForm.date}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={announcementForm.status}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Published</option>
                    <option>Scheduled</option>
                  </select>
                </div>

                <div className="form-group full">
                  <label>Message</label>
                  <textarea
                    value={announcementForm.message}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        message: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeAnnouncementModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communication;