import { useState, useEffect } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat history on page load
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (loading) return;
    if (!input) return;

    const updatedMessages = [
      ...messages,
      { role: "user", text: input }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        messages: updatedMessages.map(m => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text
        }))
      });

      setMessages([
        ...updatedMessages,
        { role: "ai", text: res.data.response }
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "ai", text: "Error contacting backend" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <h1>Incident Response Intelligence Agent</h1> 
      <ChatWindow messages={messages} loading={loading} />
      <br />
      <InputBox
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        disabled={loading}
      />
    </div>
  );
}

export default App;
