import { Trash2 } from "lucide-react";

export default function ChatHeader({
    onClear
}) {
    return (

        <header className="chat-header">
            <span className="header-model-badge">ChortGPT-4o (Smort Edition)</span>
            <span className="header-status-dot" />
            <span className="header-status-text">Definitely thinking</span>
            <button className="header-clear-btn" onClick={onClear}>
                <Trash2 size={12} color="#aaa" /> Clear
            </button>
        </header>

    );
}