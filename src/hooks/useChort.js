import { useState, useRef, useEffect } from "react";
import { CANNED_RESPONSES, PHOTO_RESPONSES, KEYWORD_RESPONSES, BAD_WORD_RESPONSES, HAPPY_RESPONSES, SAD_RESPONSES, QUESTION_RESPONSES, COMPLEX_RESPONSES } from '../data/responses';
import { mergeImages } from '../imageAgent';
import { Filter } from "bad-words";
import Sentiment from 'sentiment';


//Note to self: Might be time to refactor chort.js

const sentimentAnalyzer = new Sentiment();

const SAFE_PATTERN = /^[0-9+\-*/().\s^%]+$/; //allow basic ops 

const isMathExpression = (str) => SAFE_PATTERN.test(str.trim());

const getMathResponse = (input) => {
    if (!SAFE_PATTERN.test(input.trim())) {
        return "I tried the maths. The maths did not cooperate.";
    }

    try {
        const result = Function(`"use strict"; return (${input.trim()})`)();
        if (typeof result !== "number" || !isFinite(result)) {
            return "I got a number but I don't trust it.";
        }
        const responses = [
            `Uh... ${result}?`,
            `I got ${result}. What did you get?`,
            `${result}. Don't check my work.`,
            `Pretty sure it's ${result}. I did the maths.`,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    } catch {
        return "I tried the maths. The maths did not cooperate.";
    }
};

// catch bad words and respond
const filter = new Filter();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];


const getResponse = async (input) => {
    const lower = input.toLowerCase();
    // profanity
    if (filter.isProfane(lower)) return pick(BAD_WORD_RESPONSES);
    // math
    if (isMathExpression(lower)) return getMathResponse(lower);

    for (const entry of KEYWORD_RESPONSES) {
        if (entry.keywords.some(kw => lower.includes(kw))) return pick(entry.responses);
    }

    // sentiment nokeywords match use sentiment
    const { score } = sentimentAnalyzer.analyze(input);
    if (score >= 3) return pick(HAPPY_RESPONSES);
    if (score <= -3) return pick(SAD_RESPONSES);

    // compromise lazy loaded 
    const nlp = (await import('compromise')).default;
    const doc = nlp(input);

    if (doc.questions().length > 0) return pick(QUESTION_RESPONSES);
    if (doc.nouns().length > 2) return pick(COMPLEX_RESPONSES);


    // rand fallback responses
    return pick(CANNED_RESPONSES);
};


const getRandomPhotoIntro = () =>
    PHOTO_RESPONSES[Math.floor(Math.random() * PHOTO_RESPONSES.length)];

const STORAGE_KEYS = { messages: "chortgpt_messages" };

const WELCOME = {
    role: "assistant", type: "text",
    content: "Welcome to ChortGPT — the world's most advanced AI assistant (legally distinct from all others). I am powered by cutting-edge Bovine Neural Architecture™. How can I pretend to help you today?",
};

const LIMIT = 3;

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

    // token usage modal
    const [questionCount, setQuestionCount] = useState(0);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const attachInputRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        try {
            const serialised = JSON.stringify(messages);
            if (serialised.length > 500_000) {
                console.warn("Messages too large to save, skipping localStorage");
                return;
            }
            localStorage.setItem(STORAGE_KEYS.messages, serialised);
        } catch (error) {
            console.error("Failed to save to localStorage:", error);
        }
    }, [messages]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        const handleFocusOut = (e) => {
            // resets Safari window when leaving the textarea
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                window.scrollTo(0, 0);
            }
        };

        document.addEventListener('focusout', handleFocusOut);

        return () => {
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);

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

        const delay = 1400 + Math.random() * 800;

        setTimeout(async () => {
            const response = hasAttachment
                ? getRandomPhotoIntro()
                : await getResponse(userText);

            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: "assistant", type: "text", content: response
            }]);
        }, delay);
    };

    const handleSend = () => {
        if (questionCount >= LIMIT) {
            setShowLimitModal(true);
            return;
        }

        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { role: "user", type: "text", content: trimmed }]);
        setInput("");
        setQuestionCount(c => c + 1);
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

            await new Promise(res => setTimeout(res, 600 + Math.random() * 500)); //small delay

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
        showLimitModal,
        // refs
        attachInputRef,
        bottomRef,
        textareaRef,
        // handlers
        setShowLimitModal,
        setInput,
        setMessages,
        handleSend,
        handleAttach,
        handleKeyDown,
        resetToWelcome,
    };
}