import { useState, useEffect } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";

const API = import.meta.env.VITE_API_URL;

export default function ChatPanel() {
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
    // Notify others (timeline/status) that messages changed
    window.dispatchEvent(new CustomEvent("messages:changed", { detail: { length: messages.length } }));
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
    
    // Create a local active incident immediately for UX (INC-001)
    let incidentId = "INC-001";
    if (messages.length === 0) {
      const now = new Date().toISOString();
      const localInc = {
        id: incidentId,
        status: "Under Investigation",
        severity: "Analyzing…",
        created_at: now,
        live: true,
      };
      localStorage.setItem("activeIncident", JSON.stringify(localInc));
      window.dispatchEvent(new CustomEvent("incident:created", { detail: localInc }));
    }
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, {
        incident_id: incidentId,
        messages: updatedMessages.map(m => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.text
        }))
      });

      setMessages([
        ...updatedMessages,
        { role: "ai", text: res.data.response }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...updatedMessages,
        { role: "ai", text: "Error contacting backend" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat">
      <div className="chat-window">
        <ChatWindow messages={messages} loading={loading} />
      </div>

      <div className="chat-input">
        <InputBox
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          disabled={loading}
          isFirst={messages.length === 0}
        />
      </div>
    </div>
  );
}
