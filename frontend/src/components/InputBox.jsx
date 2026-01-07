function InputBox({ input, setInput, onSend, disabled }) {
  return (
    <div className="flex gap-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        rows={3}
        className="flex-1 resize-none border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Describe what you are observing..."
      />

      <button
        onClick={onSend}
        disabled={disabled}
        className={`px-4 rounded-md text-white
          ${disabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;
