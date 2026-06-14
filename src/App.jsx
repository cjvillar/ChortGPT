import { useChort } from "./hooks/useChort";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/Chat/ChatHeader";
import MessageList from "./components/Chat/MessageList";
import { InputArea } from "./components/Chat/inputArea";
import { PlanLimitModal } from "./components/Modals/PlanLimitModal";

export default function ChortGPT() {
  const {
    messages, chatHistory, input, isTyping,
    attachInputRef, bottomRef,
    setInput, setMessages,
    handleSend, handleAttach, handleKeyDown,
    resetToWelcome, showLimitModal,
    setShowLimitModal,
  } = useChort();


  return (
    <div className="app-root">

      <Sidebar
        messages={messages}
        chatHistory={chatHistory}
        isTyping={isTyping}
        onNewChat={() => resetToWelcome("Fresh conversation! I've cleared my context window, which was basically empty anyway.")}
        onClearMessages={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")}
        onLoadChat={(msgs) => setMessages(msgs)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">

        <ChatHeader onClear={() => resetToWelcome("Messages cleared! Don't worry, I already forgot everything. I forget things instantly.")} />


        <MessageList
          messages={messages}
          isTyping={isTyping}
          bottomRef={bottomRef}
        />

        <InputArea
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onAttach={handleAttach}
          onKeyDown={handleKeyDown}
          attachInputRef={attachInputRef}
        />

      </main>

      {showLimitModal && (
        <PlanLimitModal
          onClose={() => setShowLimitModal(false)}
          onNewChat={() => {
            setShowLimitModal(false);
            resetToWelcome("Fresh conversation! ...");
          }}
        />
      )}
    </div>
  );
}