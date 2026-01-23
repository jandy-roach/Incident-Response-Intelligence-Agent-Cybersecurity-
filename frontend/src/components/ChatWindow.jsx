import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window bg-gray-50 rounded-md p-4 overflow-y-auto">
      {messages.length === 0 && !loading ? (
        <div className="card empty-state start-investigation">
          <h2>🚨 New Security Incident</h2>
          <p>Describe what you are observing.</p>
          <div className="examples">
            <p><strong>Examples:</strong></p>
            <ul>
              <li>Unexpected outbound traffic</li>
              <li>Unauthorized login attempts</li>
              <li>API abuse or data leakage</li>
            </ul>
          </div>
          <p className="muted">The AI will guide you step-by-step.</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          {loading && <p>AI is thinking...</p>}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
