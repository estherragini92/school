import { useEffect, useState } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaPlus,
  FaCheckDouble,
} from "react-icons/fa";
import "./TeacherMessages.css";

const defaultChats = [
  {
    id: 1,
    name: "Ravi Kumar",
    role: "Parent",
    student: "Emma Watson",
    unread: 2,
    lastMessage: "Can we discuss Emma's performance?",
    messages: [
      {
        id: 1,
        sender: "parent",
        text: "Good morning teacher.",
        time: "09:10 AM",
      },
    ],
  },
];

function TeacherMessages() {
  const [chats, setChats] = useState(defaultChats);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");

  const loadParentMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem("messages")) || [];

    if (allMessages.length === 0) {
      setChats(defaultChats);
      return;
    }

    const parentChat = {
      id: 999,
      name: "Parent Messages",
      role: "Parent",
      student: "Parent Portal",
      unread: allMessages.filter((msg) => msg.sender === "Parent").length,
      lastMessage: allMessages[0]?.text || "",
      messages: allMessages
        .slice()
        .reverse()
        .map((msg) => ({
          id: msg.id,
          sender: msg.sender === "Teacher" ? "teacher" : "parent",
          text: msg.text,
          time: msg.date,
        })),
    };

    setChats([parentChat, ...defaultChats]);
    setSelectedChatId(999);
  };

  useEffect(() => {
    loadParentMessages();

    window.addEventListener("dashboardUpdate", loadParentMessages);
    window.addEventListener("storage", loadParentMessages);

    return () => {
      window.removeEventListener("dashboardUpdate", loadParentMessages);
      window.removeEventListener("storage", loadParentMessages);
    };
  }, []);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const filteredChats = chats.filter((chat) => {
    const keyword = searchTerm.toLowerCase().trim();

    return (
      keyword === "" ||
      chat.name.toLowerCase().includes(keyword) ||
      chat.role.toLowerCase().includes(keyword) ||
      chat.student.toLowerCase().includes(keyword)
    );
  });

  const selectChat = (id) => {
    setSelectedChatId(id);
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat))
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Teacher",
      receiver: "Parent",
      text: messageText.trim(),
      date: new Date().toLocaleString(),
    };

    const oldMessages = JSON.parse(localStorage.getItem("messages")) || [];
    const updatedMessages = [newMessage, ...oldMessages];

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setMessageText("");

    window.dispatchEvent(new Event("dashboardUpdate"));
    loadParentMessages();
  };

  const createNewChat = () => {
    alert("Parent messages will appear automatically when parent sends message.");
  };

  const markAllRead = () => {
    setChats((prev) => prev.map((chat) => ({ ...chat, unread: 0 })));
  };

  const totalUnread = chats.reduce((sum, chat) => sum + Number(chat.unread), 0);

  return (
    <div className="teacher-messages-page">
      <div className="page-title-row">
        <div>
          <h2>Messages</h2>
          <p>Communicate with parents and students</p>
        </div>

        <div className="messages-header-actions">
          <button type="button" onClick={markAllRead}>
            <FaCheckDouble />
            Mark all read
          </button>

          <button type="button" className="new-message-btn" onClick={createNewChat}>
            <FaPlus />
            New Message
          </button>
        </div>
      </div>

      <div className="teacher-chat-layout">
        <div className="chat-sidebar">
          <div className="chat-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="chat-unread-box">
            <span>Unread Messages</span>
            <strong>{totalUnread}</strong>
          </div>

          <div className="chat-list">
            {filteredChats.map((chat) => (
              <button
                type="button"
                key={chat.id}
                className={
                  selectedChatId === chat.id ? "chat-user active" : "chat-user"
                }
                onClick={() => selectChat(chat.id)}
              >
                <div className="chat-avatar">
                  {chat.name.charAt(0).toUpperCase()}
                </div>

                <div className="chat-user-info">
                  <div>
                    <h4>{chat.name}</h4>
                    {chat.unread > 0 && <span>{chat.unread}</span>}
                  </div>

                  <p>
                    {chat.role} · {chat.student}
                  </p>
                  <small>{chat.lastMessage}</small>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-window-header">
                <div className="chat-avatar large">
                  {selectedChat.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{selectedChat.name}</h3>
                  <p>
                    {selectedChat.role} · {selectedChat.student}
                  </p>
                </div>
              </div>

              <div className="chat-messages">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.sender === "teacher"
                        ? "message-row teacher"
                        : "message-row other"
                    }
                  >
                    <div className="message-bubble">
                      <p>{message.text}</p>
                      <span>{message.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-input-box" onSubmit={sendMessage}>
                <button type="button">
                  <FaPaperclip />
                </button>

                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                <button type="button">
                  <FaSmile />
                </button>

                <button type="submit" className="send-chat-btn">
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat">
              <h3>Select a conversation</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherMessages;