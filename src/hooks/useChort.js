import { useState } from "react";
import { useMessages } from "./useMessages";
import { useChatHistory } from "./useChatHistory";
import { useChatInput } from "./useChatInput";
import { useAttachment } from "./useAttachment";

export function useChort() {
    const [isTyping, setIsTyping] = useState(false);

    const { messages, setMessages, bottomRef, persistMessages } = useMessages();
    const { chatHistory, resetToWelcome } = useChatHistory(messages, setMessages, persistMessages);
    const {
        input, setInput,
        showLimitModal, setShowLimitModal,
        textareaRef,
        handleSend, handleKeyDown,
    } = useChatInput(setMessages, setIsTyping);
    const { attachInputRef, handleAttach } = useAttachment(setMessages, setIsTyping);

    return {
        // state
        messages,
        chatHistory,
        input,
        isTyping,
        showLimitModal,
        // refs
        attachInputRef,
        bottomRef,
        textareaRef,
        // handlers
        setInput,
        setMessages,
        setShowLimitModal,
        handleSend,
        handleAttach,
        handleKeyDown,
        resetToWelcome,
    };
}