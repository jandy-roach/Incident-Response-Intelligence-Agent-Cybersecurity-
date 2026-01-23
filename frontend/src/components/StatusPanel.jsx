import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function StatusPanel() {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`${API}/incidents`);
        const data = await res.json();
        if (data && data.length > 0) setIncident(data[data.length - 1]);
        else {
          const active = localStorage.getItem("activeIncident");
          if (active) setIncident(JSON.parse(active));
        }
      } catch (e) {
        const active = localStorage.getItem("activeIncident");
        if (active) setIncident(JSON.parse(active));
      }
    }

    fetchLatest();

    function onCreated(e) {
      setIncident(e.detail);
    }
    window.addEventListener("incident:created", onCreated);
    return () => window.removeEventListener("incident:created", onCreated);
  }, []);

  // If no incident exists yet, show draft status
  if (!incident) {
    return (
      <div className="status-bar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><strong>⚪ Status:</strong> Draft</div>
          <div>Severity: Not Assessed</div>
        </div>
      </div>
    );
  }

  const status = incident.status || "Under Investigation";
  const severity = incident.severity || "Pending";

  const statusDot = status === "Resolved" ? "🟢" : status === "Under Investigation" ? "🟡" : "⚪";
  const severityIcon = severity === "High" ? "🔴" : severity === "Medium" ? "🟠" : "🟢";

  // Handle resolved action
  async function markResolved() {
    const updated = { ...incident, status: "Resolved", severity: "High (Resolved)" };
    localStorage.setItem("activeIncident", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("incident:updated", { detail: updated }));
    setIncident(updated);
  }

  return (
    <div className="status-bar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><strong>{statusDot} Status:</strong> {status}</div>
        <div>{severity === "Pending" ? "Severity: Pending" : <span>{severityIcon} Severity: {severity}</span>}</div>
      </div>
      {status !== "Resolved" && (
        <div style={{ marginTop: 8 }}>
          <button className="send-button" onClick={markResolved}>Mark Resolved</button>
        </div>
      )}
    </div>
  );
} 
