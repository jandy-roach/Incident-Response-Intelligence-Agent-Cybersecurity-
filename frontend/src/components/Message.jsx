function Message({ role, text }) {
  let severityColor = null;

  if (role === "ai") {
    if (text.includes("SEVERITY:\nHigh")) severityColor = "red";
    else if (text.includes("SEVERITY:\nMedium")) severityColor = "yellow";
    else if (text.includes("SEVERITY:\nLow")) severityColor = "green";
  }

  return (
    <div className={`message-row ${role}`}>
      <div className="message-meta">
        <span className="message-badge">{role === "user" ? "USER" : "AI"}</span>
        {severityColor && <span className={`severity-dot ${severityColor}`} />}
      </div>

      <div className="message-body">
        <pre className="message-text">{text}</pre>
      </div>
    </div>
  );
}

export default Message;
