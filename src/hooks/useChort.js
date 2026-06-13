import { useState, useRef, useEffect } from "react";
import { CANNED_RESPONSES, PHOTO_RESPONSES, KEYWORD_RESPONSES } from '../data/responses';
import { mergeImages } from '../imageAgent';

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

const STORAGE_KEYS = { messages: "chortgpt_messages" };

const WELCOME = {
  role: "assistant", type: "text",
  content: "Welcome to ChortGPT — the world's most advanced AI assistant (legally distinct from all others). I am powered by cutting-edge Bovine Neural Architecture™. How can I pretend to help you today?",
};

const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

export function useChort() {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState(() => loadMessages() || [WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const attachInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const resetToWelcome = (msg) => {
    const hasUserMessages = messages.some(m => m.role === "user");
    if (hasUserMessages) {
      const title = messages.find(m => m.role === "user" && m.type === "text")?.content || "Untitled";
      setChatHistory(prev => [{ title, messages }, ...prev].slice(0, 10));
    }
    const fresh = [{ role: "assistant", type: "text", content: msg }];
    setMessages(fresh);
    try {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(fresh));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  const simulateResponse = (hasAttachment, userText = "") => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (hasAttachment) {
        setMessages(prev => [...prev, { role: "assistant", type: "text", content: getRandomPhotoIntro() }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", type: "text", content: getResponse(userText) }]);
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
      const preview = ev.target.result;
      setMessages(prev => [...prev, { role: "user", type: "attachment", content: preview, filename: file.name }]);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return {
    // state
    messages,
    chatHistory,
    input,
    isTyping,
    // refs
    attachInputRef,
    bottomRef,
    // handlers
    setInput,
    setMessages,
    handleSend,
    handleAttach,
    handleKeyDown,
    resetToWelcome,
  };
}