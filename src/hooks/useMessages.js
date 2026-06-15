import { useState, useRef, useEffect } from "react";

const STORAGE_KEYS = { messages: "chortgpt_messages" };

export const WELCOME = {
  role: "assistant",
  type: "text",
  content:
    "Welcome to ChortGPT — the world's most advanced AI assistant (legally distinct from all others). How can I pretend to help you today?",
};

const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function useMessages() {
  const [messages, setMessages] = useState(() => loadMessages() || [WELCOME]);
  const bottomRef = useRef(null);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    try {
      const serialised = JSON.stringify(messages.map((m) => ({ ...m, isNew: false })));
      if (serialised.length > 500_000) {
        console.warn("Messages too large to save, skipping localStorage");
        return;
      }
      localStorage.setItem(STORAGE_KEYS.messages, serialised);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Safari keyboard blur adjust
  useEffect(() => {
    const handleFocusIn = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, []);

  const persistMessages = (msgs) => {
    try {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(msgs));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  return { messages, setMessages, bottomRef, persistMessages, STORAGE_KEYS };
}