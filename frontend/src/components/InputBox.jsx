function InputBox({ input, setInput, onSend, disabled }) {
  return (
    <>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "10px" }}
        placeholder="Type your message..."
        disabled={disabled}
      />

      <br /><br />

      <button
        onClick={onSend}
        disabled={disabled}
        style={{
          padding: "10px 20px",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        {disabled ? "Waiting..." : "Send"}
      </button>
    </>
  );
}

export default InputBox;
