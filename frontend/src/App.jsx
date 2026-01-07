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
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          🛡️ Incident Response Intelligence Agent
        </h1>
        <p className="text-sm text-gray-500">
          Guided security incident investigation & response
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Conversation */}
        <main className="flex-1 flex flex-col bg-gray-50">

          <div className="flex-1 overflow-y-auto p-6">
            <ChatWindow messages={messages} loading={loading} />
          </div>

          <div className="border-t bg-white p-4">
            <InputBox
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              disabled={loading}
            />
          </div>

        </main>

        {/* RIGHT: Incident Panel */}
        <aside className="w-80 bg-white border-l p-4 hidden md:block">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Incident Status
          </h2>

          <div className="text-sm text-gray-600 space-y-2">
            <p><b>Status:</b> Under Investigation</p>
            <p><b>Severity:</b> Determined by AI</p>
            <p><b>Last Update:</b> Live</p>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Follow AI guidance and confirm when the issue is resolved.
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;
