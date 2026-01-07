function Message({ role, text }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <b>{role === "user" ? "You" : "AI"}:</b>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}

export default Message;
