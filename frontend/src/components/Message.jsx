function Message({ role, text }) {
  let severityColor = null;

  if (role === "ai") {
    if (text.includes("SEVERITY:\nHigh")) severityColor = "red";
    else if (text.includes("SEVERITY:\nMedium")) severityColor = "orange";
    else if (text.includes("SEVERITY:\nLow")) severityColor = "green";
  }

return (
  <div className="mb-4">
    <div className="text-xs text-gray-500 mb-1">
      {role === "user" ? "USER INPUT" : "AI RESPONSE"}
    </div>
    <div className="bg-white border p-3 text-sm whitespace-pre-wrap">
      {text}
    </div>
  </div>
);
}

export default Message;
