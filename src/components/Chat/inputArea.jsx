import { Send, Paperclip } from "lucide-react";

export function InputArea({ input, onInputChange, onSend, onAttach, onKeyDown, attachInputRef }) {
  return (
    <div className="input-area">
      <div className="input-box">
        <button className="attach-btn" onClick={() => attachInputRef.current.click()} title="Attach file">
          <Paperclip size={18} />
        </button>
        <input ref={attachInputRef} type="file" style={{ display: "none" }} onChange={onAttach} />
        <textarea
          className="chat-textarea"
          placeholder="Message ChortGPT..."
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button className="send-btn" onClick={onSend} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>
      <div className="disclaimer">ChortGPT definitely hallucinates. Results not guaranteed.</div>
    </div>
  );
}