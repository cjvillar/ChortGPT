import { useState, useRef, useEffect } from "react";
import { PlusCircle, Trash2, Clock, MessageSquare, Send, Paperclip, UserCircle, Sparkles } from "lucide-react";
import { CANNED_RESPONSES, PHOTO_RESPONSES, KEYWORD_RESPONSES } from './responses';
import { mergeImages } from './imageAgent'
import { Shorts } from "./Shorts";

//Response logic
const getResponse = (input) => {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      const pool = entry.responses;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return CANNED_RESPONSES[Math.floor(Math.random() * CANNED_RESPONSES.length)];
};

const getRandomPhotoIntro = () =>
  PHOTO_RESPONSES[Math.floor(Math.random() * PHOTO_RESPONSES.length)];


const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: "50%", background: "#10a37f",
        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
      }} />
    ))}
  </div>
);

// localStorage 

const STORAGE_KEYS = { messages: "chortgpt_messages", cow: "chortgpt_cow" };

const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

const WELCOME = {
  role: "assistant", type: "text",
  content: "Welcome to ChortGPT — the world's most advanced AI assistant (legally distinct from all others). I am powered by cutting-edge Bovine Neural Architecture™. How can I pretend to help you today?",
};

//Main 
export default function ChortGPT() {
  const [chatHistory, setChatHistory] = useState([]); // list of past chats
  const [messages, setMessages] = useState(() => loadMessages() || [WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cowImage, setCowImage] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEYS.cow) || null; } catch { return null; }
  });
  const fileInputRef = useRef(null);
  const attachInputRef = useRef(null);
  const bottomRef = useRef(null);



  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages)); } catch { }
  }, [messages]);

  useEffect(() => {
    try {
      if (cowImage) localStorage.setItem(STORAGE_KEYS.cow, cowImage);
      else localStorage.removeItem(STORAGE_KEYS.cow);
    } catch { }
  }, [cowImage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const resetToWelcome = (msg) => {
    // Save current chat to history if it has any user messages
    const hasUserMessages = messages.some(m => m.role === "user");
    if (hasUserMessages) {
      const title = messages.find(m => m.role === "user" && m.type === "text")?.content || "Untitled";
      setChatHistory(prev => [{ title, messages }, ...prev].slice(0, 10)); // keep last 10
    }

    const fresh = [{ role: "assistant", type: "text", content: msg }];
    setMessages(fresh);
    try { localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(fresh)); } catch { }
  };

  const simulateResponse = (hasAttachment, userText = "") => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (hasAttachment) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", type: "text", content: getRandomPhotoIntro() },
          { role: "assistant", type: "image", content: cowImage || "dog" },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", type: "text", content: getResponse(userText) },
        ]);
      }
    }, 1400 + Math.random() * 800);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: "user", type: "text", content: trimmed }]);
    setInput("");
    simulateResponse(false, trimmed);
  };

  const handleAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const preview = ev.target.result; // base64 string

      // user uploaded image
      setMessages(prev => [
        ...prev,
        { role: "user", type: "attachment", content: preview, filename: file.name },
      ]);

      //merge response
      setIsTyping(true);
      try {
        const mergedImage = await mergeImages(preview);
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          { role: "assistant", type: "text", content: getRandomPhotoIntro() },
          { role: "assistant", type: "image", content: mergedImage },
        ]);
      } catch (err) {
        setIsTyping(false);
        console.error("mergeImages failed:", err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCowUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCowImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // gets a title from the first user message
  const chatTitle = messages.find(m => m.role === "user" && m.type === "text")?.content;

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🩳</span>
          <span className="sidebar-logo-text">ChortGPT</span>
        </div>

        <button className="sidebar-btn" onClick={() => resetToWelcome("Fresh conversation! I've cleared my context window, which was basically empty anyway.")}>
          <PlusCircle size={16} /> New Chat
        </button>
        <button className="sidebar-btn sidebar-btn-danger" onClick={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")}>
          Clear Messages
        </button>


        <div className="sidebar-section-label">RECENT</div>

        {/* No chats yet */}
        {chatHistory.length === 0 && !messages.some(m => m.role === "user") && (
          <div style={{ fontSize: 12, color: "#444", padding: "8px 10px" }}>No chats yet</div>
        )}

        {/* Active chOrt */}
        {messages.some(m => m.role === "user") && (
          <div className="sidebar-item" style={{ opacity: 0.6, cursor: "default", borderLeft: "2px solid #10a37f", paddingLeft: 8 }}>
            {(() => {
              const t = messages.find(m => m.role === "user" && m.type === "text")?.content || "";
              return t.length > 28 ? t.slice(0, 28) + "…" : t;
            })()}
          </div>
        )}

        {/* Past chOrts */}
        {chatHistory.map((chat, i) => (
          <div key={i} className="sidebar-item" onClick={() => !isTyping && setMessages(chat.messages)}>
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

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="chat-header">
          <span className="header-model-badge">ChortGPT-4o (Smort Edition)</span>
          <span className="header-status-dot" />
          <span className="header-status-text">Definitely thinking</span>
          <button className="header-clear-btn" onClick={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")}>
            <Trash2 size={12} color="#aaa" /> Clear
          </button>
        </header>

        <div className="message-list">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role === "user" ? "message-row-user" : "message-row-ai"}`}>
              {msg.role === "assistant" && <div className="avatar"><Shorts size={24} /></div>}
              <div className="message-content">
                {msg.type === "text" && (
                  <div className={`bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                    {msg.content}
                  </div>
                )}
                {msg.type === "attachment" && (
                  <div className="attach-bubble">
                    <img src={msg.content} alt={msg.filename} className="attach-img" />
                    <div className="attach-name">{msg.filename}</div>
                  </div>
                )}

                {msg.type === "image" && (
                  <div className="vision-result">
                    <img
                      src={msg.content}
                      alt="Generated result"
                      className="vision-result-img"
                    />
                    <div className="vision-caption">
                      Image generated by ChortGPT Vision™ · Powered by Bovine Intelligence
                    </div>
                  </div>
                )}
              </div>
              {msg.role === "user" && <div className="avatar avatar-user">You</div>}
            </div>
          ))}

          {isTyping && (
            <div className="message-row message-row-ai">
              <div className="avatar"><Shorts size={24}  /></div>
              <div className="bubble bubble-ai"><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-box">
            <button className="attach-btn" onClick={() => attachInputRef.current.click()} title="Attach file"><Paperclip size={18} /></button>
            <input ref={attachInputRef} type="file" style={{ display: "none" }} onChange={handleAttach} />
            <textarea
              className="chat-textarea"
              placeholder="Message ChortGPT..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim()}> <Send size={16} /></button>
          </div>
          <div className="disclaimer">ChortGPT may produce incorrect, absurd, or beef-related information. Results not guaranteed.</div>
        </div>
      </main>
    </div>
  );
}