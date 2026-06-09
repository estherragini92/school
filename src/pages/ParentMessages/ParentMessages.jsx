import { useEffect, useState } from "react";
import { FaPaperPlane, FaUserFriends } from "react-icons/fa";
import "./ParentMessages.css";

function ParentMessages() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    setMessages(JSON.parse(localStorage.getItem("messages")) || []);
  };

  useEffect(() => {
    loadMessages();

    window.addEventListener("dashboardUpdate", loadMessages);
    window.addEventListener("storage", loadMessages);

    return () => {
      window.removeEventListener("dashboardUpdate", loadMessages);
      window.removeEventListener("storage", loadMessages);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

    const newMessage = {
      id: Date.now(),
      sender: "Parent",
      receiver: "Teacher",
      parentEmail: currentUser.email || "parent@school.com",
      text: message.trim(),
      date: new Date().toLocaleString(),
    };

    const oldMessages = JSON.parse(localStorage.getItem("messages")) || [];
    const updatedMessages = [newMessage, ...oldMessages];

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setMessage("");

    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  return (
    <div className="parent-messages-page">
      <div className="messages-header">
        <h2>Messages</h2>
        <p>Communicate with teachers</p>
      </div>

      <div className="messages-card">
        <div className="message-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="button" onClick={sendMessage}>
            <FaPaperPlane />
            Send
          </button>
        </div>

        <div className="message-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === "Parent"
                  ? "message-bubble sent"
                  : "message-bubble received"
              }
            >
              <div className="message-top">
                <FaUserFriends />
                <strong>{msg.sender}</strong>
              </div>

              <p>{msg.text}</p>
              <small>{msg.date}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParentMessages;