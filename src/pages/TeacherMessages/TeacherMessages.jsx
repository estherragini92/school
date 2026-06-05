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
      {
        id: 2,
        sender: "parent",
        text: "Can we discuss Emma's performance?",
        time: "09:12 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Student",
    student: "Marcus Johnson",
    unread: 0,
    lastMessage: "I submitted the assignment.",
    messages: [
      {
        id: 1,
        sender: "student",
        text: "I submitted the assignment.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "teacher",
        text: "Good. I will check it today.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Sophia Chen Parent",
    role: "Parent",
    student: "Sophia Chen",
    unread: 1,
    lastMessage: "Thank you for the update.",
    messages: [
      {
        id: 1,
        sender: "teacher",
        text: "Sophia is doing very well in class.",
        time: "10:00 AM",
      },
      {
        id: 2,
        sender: "parent",
        text: "Thank you for the update.",
        time: "10:20 AM",
      },
    ],
  },
];

function TeacherMessages() {
  
const [chats, setChats] = useState(() => {
  const saved = localStorage.getItem("teacherMessages");
  return saved ? JSON.parse(saved) : defaultChats;
});

useEffect(() => {
  const parentMessages =
    JSON.parse(localStorage.getItem("messages")) || [];

  if (parentMessages.length > 0) {
    setChats((prev) => {
      const otherChats = prev.filter((chat) => chat.id !== 999);

      return [
        {
          id: 999,
          name: "Parent",
          role: "Parent",
          student: "Student",
          unread: parentMessages.length,
          lastMessage: parentMessages[parentMessages.length - 1]?.text || "",
          messages: parentMessages.map((msg) => ({
            id: msg.id,
            sender: msg.sender === "Parent" ? "parent" : "teacher",
            text: msg.text,
            time: msg.date,
          })),
        },
        ...otherChats,
      ];
    });
  }
}, []);



  const [selectedChatId, setSelectedChatId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    localStorage.setItem("teacherMessages", JSON.stringify(chats));
    window.dispatchEvent(new Event("dashboardUpdate"));
  }, [chats]);

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
      sender: "teacher",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              lastMessage: messageText.trim(),
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );

    const oldNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    localStorage.setItem(
      "notifications",
      JSON.stringify([
        {
          id: Date.now(),
          text: `New message sent to ${selectedChat?.name}`,
          time: new Date().toLocaleString(),
        },
        ...oldNotifications,
      ])
    );

    setMessageText("");
    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const createNewChat = () => {
    const name = prompt("Enter parent/student name:");
    if (!name) return;

    const newChat = {
      id: Date.now(),
      name,
      role: "Parent",
      student: "New Student",
      unread: 0,
      lastMessage: "New conversation started",
      messages: [
        {
          id: Date.now() + 1,
          sender: "teacher",
          text: "New conversation started",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
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

                  <p>{chat.role} · {chat.student}</p>
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
                  placeholder="Type your message..."
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