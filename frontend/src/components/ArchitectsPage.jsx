import React, { useState } from 'react';

const ARCHITECTS = [
  { id: 1, name: "Ar. Khalid Mehmood", firm: "KM Associates", city: "Lahore", rating: 4.8, projects: 142, phone: "+92-321-1234567", email: "khalid@kmassc.pk", speciality: "Residential" },
  { id: 2, name: "Ar. Sana Raza", firm: "Urban Design Studio", city: "Islamabad", rating: 4.9, projects: 98, phone: "+92-300-9876543", email: "sana@uds.pk", speciality: "Commercial" },
  { id: 3, name: "Ar. Ahmed Bilal", firm: "Future Structures", city: "Karachi", rating: 4.7, projects: 201, phone: "+92-333-5556789", email: "ahmed@fs.pk", speciality: "Both" }
];

export default function ArchitectsPage() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Verified Architects Council</h2>
      <input placeholder="Filter by city or name..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #E5E7EB", marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {ARCHITECTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase())).map(a => (
          <div key={a.id} style={{ background: "#FFF", padding: 16, borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <h4 style={{ margin: "0 0 4px" }}>{a.name}</h4>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "0 0 8px" }}>{a.firm} · {a.city}</p>
            <div style={{ fontSize: 12, background: "#FEF3C7", display: "inline-block", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>⭐ {a.rating} ({a.projects} Clean Delivery)</div>
          </div>
        ))}
      </div>
    </div>
  );
}