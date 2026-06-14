import { useState, useEffect } from "react";
import { PlusCircle, Trash2, UserCircle, Sparkles, PanelLeft, PanelRight, X } from "lucide-react";

export default function Sidebar({ messages, chatHistory, isTyping, onNewChat, onClearMessages, onLoadChat, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-logo">
        {!collapsed && <span className="sidebar-logo-icon">🩳</span>}
        {!collapsed && <span className="sidebar-logo-text">ChortGPT</span>}


        <button
          className="sidebar-collapse-btn"
          onClick={() => {
            if (window.innerWidth <= 768) {
              onMobileClose();
            } else {
              setCollapsed(c => !c);
            }
          }}
        >
          {collapsed ? <PanelRight size={16} /> : <PanelLeft size={16} />}
        </button>
      </div>

      {collapsed ? (
        <>
          <button className="sidebar-btn sidebar-btn-icon" onClick={onNewChat} title="New Chat">
            <PlusCircle size={16} />
          </button>
          <button className="sidebar-btn sidebar-btn-icon sidebar-btn-danger" onClick={onClearMessages} title="Clear Messages">
            <Trash2 size={16} />
          </button>
        </>
      ) : (
        <>
          <button className="sidebar-btn" onClick={onNewChat}>
            <PlusCircle size={16} /> New Chat
          </button>
          <button className="sidebar-btn sidebar-btn-danger" onClick={onClearMessages}>
            <Trash2 size={16} /> Clear Messages
          </button>

          <div className="sidebar-section-label">RECENT</div>

          {chatHistory.length === 0 && !messages.some(m => m.role === "user") && (
            <div style={{ fontSize: 12, color: "#444", padding: "8px 10px" }}>No chats yet</div>
          )}

          {messages.some(m => m.role === "user") && (
            <div className="sidebar-item" style={{ opacity: 0.6, cursor: "default", borderLeft: "2px solid #10a37f", paddingLeft: 8 }}>
              {(() => {
                const t = messages.find(m => m.role === "user" && m.type === "text")?.content || "";
                return t.length > 28 ? t.slice(0, 28) + "…" : t;
              })()}
            </div>
          )}

          {chatHistory.map((chat, i) => (
            <div key={i} className="sidebar-item" onClick={() => !isTyping && onLoadChat(chat.messages)}>
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
        </>
      )}
    </aside>
  );
}