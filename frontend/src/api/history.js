export async function fetchIncidents() {
  const API = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API}/incidents`);
  return res.json();
}