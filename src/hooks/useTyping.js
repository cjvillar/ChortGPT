import { useState, useEffect } from "react";

export function useTyping(text, speed = 18) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        setDisplayed("");
        if (!text) return;

        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return displayed;
}