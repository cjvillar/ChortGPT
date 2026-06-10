import { useState, useRef, useEffect } from "react";
import { CANNED_RESPONSES, PHOTO_RESPONSES, KEYWORD_RESPONSES } from './responses';

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

const DogPlaceholder = () => (
  <div className="dog-placeholder">
    <span>🐶</span>
    <span>ChortGPT Vision™</span>
  </div>
);

const TypingDots = () => (
  <div style={{ display:"flex", gap:5, alignItems:"center", padding:"4px 0" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width:8, height:8, borderRadius:"50%", background:"#10a37f",
        animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
      }}/>
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
    try { localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      if (cowImage) localStorage.setItem(STORAGE_KEYS.cow, cowImage);
      else localStorage.removeItem(STORAGE_KEYS.cow);
    } catch {}
  }, [cowImage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const resetToWelcome = (msg) => {
    const fresh = [{ role: "assistant", type: "text", content: msg }];
    setMessages(fresh);
    try { localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(fresh)); } catch {}
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
    reader.onload = (ev) => {
      const preview = ev.target.result;
      setMessages(prev => [
        ...prev,
        { role: "user", type: "attachment", content: preview, filename: file.name },
      ]);
      simulateResponse(true);
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

  return (
  <div className="app-root">
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🐄</span>
        <span className="sidebar-logo-text">ChortGPT</span>
      </div>

      <button className="sidebar-btn" onClick={() => resetToWelcome("Fresh conversation! I've cleared my context window, which was basically empty anyway.")}>
        + New Chat
      </button>
      <button className="sidebar-btn sidebar-btn-danger" onClick={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")}>
        Clear Messages
      </button>

      <div className="sidebar-section-label">RECENT</div>
      {["Why is the sky blue?","Write me a poem","Fix my code","What is love?"].map(t => (
        <div key={t} className="sidebar-item">{t}</div>
      ))}

      <div className="flex-1" />

      {/* <div className="sidebar-footer">
        <div className="sidebar-upload-row">
          <div className="sidebar-preview">
            {cowImage
              ? <img src={cowImage} alt="Vision model" className="w-full h-full object-cover" />
              : <DogPlaceholder />}
          </div>
          <div>
            <div className="sidebar-vision-label">Vision Model</div>
            <div className="sidebar-vision-sub">Upload your cow photo</div>
            <button className="sidebar-upload-btn" onClick={() => fileInputRef.current.click()}>
              {cowImage ? "Replace Cow" : "Upload Cow "}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleCowUpload} />
          </div>
        </div>
      </div> */}
    </aside>

    <main className="flex-1 flex flex-col overflow-hidden">
      <header className="chat-header">
        <span className="header-model-badge">ChortGPT-4o (Bovine Edition)</span>
        <span className="header-status-dot" />
        <span className="header-status-text">Definitely thinking</span>
        <button className="header-clear-btn" onClick={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")}>
          🗑 Clear
        </button>
      </header>

      <div className="message-list">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.role === "user" ? "message-row-user" : "message-row-ai"}`}>
            {msg.role === "assistant" && <div className="avatar">🐄</div>}
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
                  {msg.content === "dog"
                    ? <div style={{height:180}}><DogPlaceholder /></div>
                    : <img src={msg.content} alt="Vision result" className="vision-result-img" />}
                  <div className="vision-caption">Image generated by ChortGPT Vision™ · Powered by Bovine Intelligence</div>
                </div>
              )}
            </div>
            {msg.role === "user" && <div className="avatar avatar-user">You</div>}
          </div>
        ))}

        {isTyping && (
          <div className="message-row message-row-ai">
            <div className="avatar">🐄</div>
            <div className="bubble bubble-ai"><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-box">
          <button className="attach-btn" onClick={() => attachInputRef.current.click()} title="Attach file">📎</button>
          <input ref={attachInputRef} type="file" style={{display:"none"}} onChange={handleAttach} />
          <textarea
            className="chat-textarea"
            placeholder="Message ChortGPT..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>↑</button>
        </div>
        <div className="disclaimer">ChortGPT may produce incorrect, absurd, or beef-related information. Results not guaranteed.</div>
      </div>
    </main>
  </div>
);
}