import Message from "./Message";

function ChatWindow({ messages, loading }) {
  return (
    <div style={{ background: "#f4f4f4", padding: "15px", minHeight: "300px" }}>
      {messages.map((msg, index) => (
        <Message key={index} role={msg.role} text={msg.text} />
      ))}
      {loading && <p>AI is thinking...</p>}
    </div>
  );
}

export default ChatWindow;
