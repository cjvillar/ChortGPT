import { PlusCircle, UserCircle, Sparkles } from "lucide-react";



export default function Sidebar({
  messages,
  chatHistory,
  isTyping,
  onNewChat,
  onClearMessages,
  onLoadChat,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🩳</span>
        <span className="sidebar-logo-text">ChortGPT</span>
      </div>

      <button className="sidebar-btn" onClick={onNewChat}>
        <PlusCircle size={16} /> New Chat
      </button>
      <button className="sidebar-btn sidebar-btn-danger" onClick={onClearMessages}>
        Clear Messages
      </button>

      <div className="sidebar-section-label">RECENT</div>

      {chatHistory.length === 0 && !messages.some(m => m.role === "user") && (
        <div style={{ fontSize: 12, color: "#444", padding: "8px 10px" }}>
          No chats yet
        </div>
      )}

      {messages.some(m => m.role === "user") && (
        <div
          className="sidebar-item"
          style={{ opacity: 0.6, cursor: "default", borderLeft: "2px solid #10a37f", paddingLeft: 8 }}
        >
          {(() => {
            const t = messages.find(m => m.role === "user" && m.type === "text")?.content || "";
            return t.length > 28 ? t.slice(0, 28) + "…" : t;
          })()}
        </div>
      )}

      {chatHistory.map((chat, i) => (
        <div
          key={i}
          className="sidebar-item"
          onClick={() => !isTyping && onLoadChat(chat.messages)}
        >
          {chat.title.length > 28 ? chat.title.slice(0, 28) + "…" : chat.title}
        </div>
      ))}

      <div className="flex-1" />

      <div className="sidebar-footer">
        <div className="sidebar-upload-row">
          <div className="sidebar-preview">
            <UserCircle size={36} color="#aaa" />
          </div>
          <div>
            <div className="sidebar-vision-label">Guest User</div>
            <div className="sidebar-vision-sub" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Sparkles size={10} color="#10a37f" /> Broke Boi Plan
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}