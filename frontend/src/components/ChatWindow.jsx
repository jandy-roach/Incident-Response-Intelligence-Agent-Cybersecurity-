import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      style={{
        background: "#f4f4f4",
        padding: "15px",
        minHeight: "300px",
        maxHeight: "400px",
        overflowY: "auto"
      }}
    >
      {messages.map((msg, index) => (
        <Message key={index} role={msg.role} text={msg.text} />
      ))}
      {loading && <p>AI is thinking...</p>}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
