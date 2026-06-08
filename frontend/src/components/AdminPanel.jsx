import React from 'react';

const COLORS = { card: "#FFFFFF", border: "#E5E7EB", steel: "#374151", steelLight: "#6B7280", primary: "#B45309" };

export default function AdminPanel({ projects, users }) {
  const fmtShort = (n) => n >= 1e7 ? (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + " Lac" : Math.round(n).toLocaleString();
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.steel, margin: "0 0 20px" }}>Admin Control Centre</h2>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.steel, margin: "0 0 14px" }}>Registered Platform Users</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", color: COLORS.steelLight }}>
              <th style={{ padding: 10, textAlign: "left" }}>Name</th>
              <th style={{ padding: 10, textAlign: "left" }}>Email</th>
              <th style={{ padding: 10, textAlign: "left" }}>Role</th>
              <th style={{ padding: 10, textAlign: "left" }}>Company</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 10, fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: 10 }}>{u.email}</td>
                <td style={{ padding: 10, textTransform: "capitalize" }}>{u.role}</td>
                <td style={{ padding: 10, color: COLORS.steelLight }}>{u.company || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}