import Header from "./components/Header";
import ChatPanel from "./components/ChatPanel";
import IncidentHistory from "./components/IncidentHistory";
import StatusPanel from "./components/StatusPanel";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="layout">
        <IncidentHistory />
        <ChatPanel />
      </div>
      <StatusPanel />
    </div>
  );
}
