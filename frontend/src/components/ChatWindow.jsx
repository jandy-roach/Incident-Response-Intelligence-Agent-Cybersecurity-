import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="bg-gray-50 rounded-md p-4 h-96 overflow-y-auto">
      {messages.map((msg, index) => (
        <Message key={index} role={msg.role} text={msg.text} />
      ))}
      {loading && <p>AI is thinking...</p>}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
