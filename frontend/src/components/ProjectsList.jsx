import React, { useState } from "react";
import EstimationDetail from "./EstimationDetail";

const COLORS = {
  primary: "#B45309", primaryLight: "#FEF3C7", primaryDark: "#78350F",
  steel: "#374151", steelLight: "#6B7280", card: "#FFFFFF", border: "#E5E7EB",
};

function StatusBadge({ status }) {
  const map = {
    active: ["#1D4ED8", "#DBEAFE"],
    completed: ["#065F46", "#D1FAE5"],
    planning: ["#92400E", "#FEF3C7"],
    paused: ["#374151", "#F3F4F6"],
  };
  const [color, bg] = map[status] || map.planning;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "2px 10px", borderRadius: 20, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

export default function ProjectsList({ projects, onEdit, onDelete }) {
  const [viewProject, setViewProject] = useState(null);
  const fmtShort = (n) =>
    n >= 1e7 ? (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + " Lac" : Math.round(n).toLocaleString();

  if (viewProject) {
    return <EstimationDetail project={viewProject} onBack={() => setViewProject(null)} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {projects.map((p) => (
        <div key={p.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: COLORS.steel, fontSize: 15 }}>{p.name}</span>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ fontSize: 12, color: COLORS.steelLight }}>
              {p.plotSize} {p.plotUnit} · {p.constructionType} · {p.storyType} story · {p.rooms} rooms
              {p.estimate && <span> · Est: <strong style={{ color: COLORS.primary }}>PKR {fmtShort(p.estimate.total)}</strong></span>}
            </div>
            {p.description && <div style={{ fontSize: 12, color: COLORS.steelLight, marginTop: 4 }}>{p.description}</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setViewProject(p)}
              style={{ padding: "7px 14px", background: COLORS.primary, color: "#FFF", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              View Report
            </button>
            <button onClick={() => onEdit(p)}
              style={{ padding: "7px 14px", background: "transparent", color: COLORS.steelLight, border: `1px solid ${COLORS.border}`, borderRadius: 7, cursor: "pointer", fontSize: 12 }}>
              Edit
            </button>
            <button onClick={() => onDelete(p.id)}
              style={{ padding: "7px 14px", background: "#FEE2E2", color: "#991B1B", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
