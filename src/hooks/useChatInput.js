import { useState, useRef } from "react";
import {
    CANNED_RESPONSES,
    PHOTO_RESPONSES,
    KEYWORD_RESPONSES,
    BAD_WORD_RESPONSES,
    HAPPY_RESPONSES,
    SAD_RESPONSES,
    QUESTION_RESPONSES,
    COMPLEX_RESPONSES,
} from "../data/responses";
import { Filter } from "bad-words";
import { scoreSentiment } from "../utils/sentiment";

const filter = new Filter();

const SAFE_PATTERN = /^[0-9+\-*/().\s^%]+$/;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isQuestion = (str) => str.trim().endsWith("?");
const hasLotsOfWords = (str) => str.trim().split(/\s+/).length > 6;
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
        return pick(responses);
    } catch {
        return "I tried the maths. The maths did not cooperate.";
    }
};

const getResponse = (input) => {
    const lower = input.toLowerCase();
    // profanity
    if (filter.isProfane(lower)) return pick(BAD_WORD_RESPONSES);
    // math
    if (isMathExpression(lower)) return getMathResponse(lower);

    // keyword response
    for (const entry of KEYWORD_RESPONSES) {
        if (entry.keywords.some((kw) => lower.includes(kw))) return pick(entry.responses);
    }

    // sentiment no keywords match use sentiment
    const score = scoreSentiment(input);
    if (score >= 1) return pick(HAPPY_RESPONSES);
    if (score <= -1) return pick(SAD_RESPONSES);

    //questions ending in ?
    if (isQuestion(input)) return pick(QUESTION_RESPONSES);
    if (hasLotsOfWords(input)) return pick(COMPLEX_RESPONSES);
    // rand fallback responses
    return pick(CANNED_RESPONSES);
};

const getRandomPhotoIntro = () =>
    PHOTO_RESPONSES[Math.floor(Math.random() * PHOTO_RESPONSES.length)];

const LIMIT = 3;

export function useChatInput(setMessages, setIsTyping) {
    const [input, setInput] = useState("");
    const [questionCount, setQuestionCount] = useState(0);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const textareaRef = useRef(null);

    const simulateResponse = (hasAttachment, userText = "") => {
        setIsTyping(true);
        const delay = 1400 + Math.random() * 800;

        setTimeout(() => {
            const response = hasAttachment ? getRandomPhotoIntro() : getResponse(userText);
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", type: "text", content: response, isNew: true },
            ]);
        }, delay);
    };

    const handleSend = () => {
        if (questionCount >= LIMIT) {
            setShowLimitModal(true);
            return;
        }

        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages((prev) => [...prev, { role: "user", type: "text", content: trimmed }]);
        setInput("");
        setQuestionCount((c) => c + 1);
        simulateResponse(false, trimmed);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return {
        input,
        setInput,
        showLimitModal,
        setShowLimitModal,
        textareaRef,
        handleSend,
        handleKeyDown,
        simulateResponse,
    };
}