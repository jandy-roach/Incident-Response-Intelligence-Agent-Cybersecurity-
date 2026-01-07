function InputBox({ input, setInput, onSend }) {
  return (
    <>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "10px" }}
        placeholder="Type your message..."
      />

      <br /><br />

      <button onClick={onSend} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </>
  );
}

export default InputBox;
