import React from 'react';

const COLORS = { primary: "#B45309", card: "#FFFFFF", border: "#E5E7EB", steel: "#374151", steelLight: "#6B7280", success: "#065F46" };

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px", borderLeft: `4px solid ${color || COLORS.primary}` }}>
      <div style={{ fontSize: 12, color: COLORS.steelLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.steel, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.steelLight, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { active: ["#1D4ED8", "#DBEAFE"], completed: ["#065F46", "#D1FAE5"], planning: ["#92400E", "#FEF3C7"], paused: ["#374151", "#F3F4F6"] };
  const [color, bg] = map[status] || map.planning;
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 20, textTransform: "capitalize" }}>{status}</span>;
}

export default function DashboardPage({ projects, user }) {
  const fmtShort = (n) => n >= 1e7 ? (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + " Lac" : Math.round(n).toLocaleString();
  const totalEstimated = projects.reduce((s, p) => s + (p.estimate?.total || 0), 0);
  const totalActual = projects.reduce((s, p) => s + (parseFloat(p.actualCost) || 0), 0);
  const active = projects.filter(p => p.status === "active").length;
  const completed = projects.filter(p => p.status === "completed").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.steel, margin: 0 }}>Welcome back, {user.name.split(" ")[0]} 👋</h2>
        <p style={{ fontSize: 13, color: COLORS.steelLight, margin: "4px 0 0" }}>Here's your construction portfolio overview</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Projects" value={projects.length} sub="All time" color={COLORS.primary} />
        <StatCard label="Active Projects" value={active} sub="In progress" color="#2563EB" />
        <StatCard label="Completed" value={completed} sub="Finished" color="#059669" />
        <StatCard label="Total Estimated" value={fmtShort(totalEstimated)} sub="PKR" color="#D97706" />
      </div>
    </div>
  );
}