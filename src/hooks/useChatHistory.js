import { useState } from "react";
import { WELCOME } from "./useMessages";

export function useChatHistory(messages, setMessages, persistMessages) {
    const [chatHistory, setChatHistory] = useState([]);

    const resetToWelcome = (msg) => {
        const hasUserMessages = messages.some((m) => m.role === "user");

        if (hasUserMessages) {
            const title =
                messages.find((m) => m.role === "user" && m.type === "text")?.content ||
                "Untitled";
            setChatHistory((prev) => [{ title, messages }, ...prev].slice(0, 10));
        }

        const fresh = [{ ...WELCOME, content: msg }];
        setMessages(fresh);
        persistMessages(fresh);
    };

    return { chatHistory, resetToWelcome };
}