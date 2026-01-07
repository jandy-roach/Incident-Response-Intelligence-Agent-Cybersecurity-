function Message({ role, text }) {
  let severityColor = null;

  if (role === "ai") {
    if (text.includes("SEVERITY:\nHigh")) severityColor = "red";
    else if (text.includes("SEVERITY:\nMedium")) severityColor = "orange";
    else if (text.includes("SEVERITY:\nLow")) severityColor = "green";
  }

  return (
    <div style={{ marginBottom: "15px" }}>
      <b>{role === "user" ? "You" : "AI"}:</b>

      {severityColor && (
        <div
          style={{
            display: "inline-block",
            marginLeft: "10px",
            padding: "2px 8px",
            borderRadius: "5px",
            background: severityColor,
            color: "white",
            fontSize: "12px"
          }}
        >
          {severityColor.toUpperCase()}
        </div>
      )}

      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}

export default Message;
