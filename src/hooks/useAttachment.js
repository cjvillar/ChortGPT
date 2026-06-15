import { useRef } from "react";
import { mergeImages } from "../imageAgent";
import { PHOTO_RESPONSES } from "../data/responses";

const getRandomPhotoIntro = () =>
    PHOTO_RESPONSES[Math.floor(Math.random() * PHOTO_RESPONSES.length)];

export function useAttachment(setMessages, setIsTyping) {
    const attachInputRef = useRef(null);

    const handleAttach = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (ev) => {
            const preview = ev.target.result;

            setMessages((prev) => [
                ...prev,
                { role: "user", type: "attachment", content: preview, filename: file.name, isNew: true },
            ]);
            setIsTyping(true);

            await new Promise((res) => setTimeout(res, 600 + Math.random() * 500));

            try {
                const mergedImage = await mergeImages(preview);
                setIsTyping(false);
                setMessages((prev) => [
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

    return { attachInputRef, handleAttach };
}