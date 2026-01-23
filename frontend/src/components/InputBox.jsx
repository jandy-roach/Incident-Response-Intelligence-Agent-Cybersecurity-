function InputBox({ input, setInput, onSend, disabled, isFirst }) {
  const label = isFirst ? "▶ Start Investigation" : "▶ Send Update";

  return (
    <div style={{ width: "100%" }}>
      <label className="input-label">🧠 Analyst Input</label>
      <div className="flex gap-2" style={{ marginTop: 6 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          rows={4}
          className="input-textarea"
          placeholder="Describe the security issue you are seeing (logs, alerts, behavior)..."
        />

        <button
          onClick={onSend}
          disabled={disabled}
          className={`send-button ${disabled ? "disabled" : ""}`}
          aria-label={label}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export default InputBox;
