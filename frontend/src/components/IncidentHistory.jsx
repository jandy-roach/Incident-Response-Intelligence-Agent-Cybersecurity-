import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/history";

export default function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);
  const [localIncident, setLocalIncident] = useState(null);

  useEffect(() => {
    fetchIncidents().then(setIncidents);
    // Load any locally-created active incident
    const active = localStorage.getItem("activeIncident");
    if (active) setLocalIncident(JSON.parse(active));
  }, []);

  useEffect(() => {
    function onCreated(e) {
      setLocalIncident(e.detail);
    }
    window.addEventListener("incident:created", onCreated);
    return () => window.removeEventListener("incident:created", onCreated);
  }, []);

  return (
    <div className="history">
      <h3 className="section" style={{ padding: "12px" }}>Incidents</h3>

      {incidents.length === 0 ? (
        <div style={{ padding: "0 12px" }}>
          <div className="text-xs text-gray-500 mt-2">Incident Timeline</div>
          <div className="mt-3">
            <div className={`incident-item sidebar-item ${localIncident && localIncident.live ? 'active' : ''}`}>• Active Investigation {localIncident && localIncident.live ? <span style={{color:'#ef4444', marginLeft:8}}> (LIVE)</span> : null}</div>
            <div className="incident-item sidebar-item">• Waiting for AI assessment</div>
          </div>

          {localIncident && (
            <div className={`incident-item active`} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>{localIncident.id}</div>
                <div>{localIncident.status}</div>
              </div>
              <div className="text-xs text-gray-500">Severity: {localIncident.severity}</div>
            </div>
          )}
        </div>
      ) : (
        <>
          {incidents.map((inc) => (
            <div key={inc.id} className="incident-item">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div># {inc.id}</div>
                <div>{inc.severity}</div>
              </div>

              <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
                <a
                  className="text-xs text-blue-600 hover:underline"
                  href={`${import.meta.env.VITE_API_URL}/incidents/${inc.id}/report`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Generate Report
                </a>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
