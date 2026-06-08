import React, { useState } from "react";

const COLORS = {
  primary: "#B45309",
  steel: "#374151",
  steelLight: "#6B7280",
  card: "#FFFFFF",
  border: "#E5E7EB",
};

export default function ProjectForm({ onSave, onCancel, initial, calcEstimate }) {
  const [form, setForm] = useState(initial || {
    name: "", plotSize: "", plotUnit: "sqft", rooms: "4", constructionType: "residential", storyType: "single", description: "", status: "planning", actualCost: "",
  });

  const inp = {
    fontSize: 14, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8,
    width: "100%", outline: "none", background: "#FAFAFA", fontFamily: "inherit", boxSizing: "border-box",
  };

  function handleSave() {
    if (!form.name || !form.plotSize) { 
      alert("Project name and plot size are required."); 
      return;
    }
    // Calculate estimate matrix data dynamically
    const estimate = calcEstimate(form);
    onSave({ ...form, estimate, id: form.id || Math.random(), createdAt: form.createdAt || new Date().toLocaleDateString() });
  }

  return (
    <div style={{ background: COLORS.card, borderRadius: 14, padding: 28, border: `1px solid ${COLORS.border}` }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.steel, margin: "0 0 24px" }}>{initial ? "Edit Project" : "Create New Project"}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Label>Project Name *</Label>
          <input style={inp} placeholder="e.g. Green Valley Residence" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div>
          <Label>Plot Size *</Label>
          <input style={inp} type="number" placeholder="Enter size" value={form.plotSize} onChange={e => setForm({ ...form, plotSize: e.target.value })} />
        </div>
        <div>
          <Label>Size Unit</Label>
          <select style={inp} value={form.plotUnit} onChange={e => setForm({ ...form, plotUnit: e.target.value })}>
            <option value="sqft">Square Feet (sq.ft)</option>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
          </select>
        </div>

        <div>
          <Label>Number of Rooms</Label>
          <input style={inp} type="number" min="1" max="30" placeholder="4" value={form.rooms} onChange={e => setForm({ ...form, rooms: e.target.value })} />
        </div>
        <div>
          <Label>Status</Label>
          <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <Label>Construction Type</Label>
          <select style={inp} value={form.constructionType} onChange={e => setForm({ ...form, constructionType: e.target.value })}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <Label>Story Type</Label>
          <select style={inp} value={form.storyType} onChange={e => setForm({ ...form, storyType: e.target.value })}>
            <option value="single">Single Story</option>
            <option value="double">Double Story</option>
          </select>
        </div>

        <div>
          <Label>Actual Cost (PKR) — optional</Label>
          <input style={inp} type="number" placeholder="For budget comparison" value={form.actualCost} onChange={e => setForm({ ...form, actualCost: e.target.value })} />
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <Label>Description</Label>
          <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="Additional project notes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button onClick={handleSave} style={{ padding: "11px 28px", background: COLORS.primary, color: "#FFF", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          {initial ? "Update Project" : "Create & Estimate"}
        </button>
        <button onClick={onCancel} style={{ padding: "11px 20px", background: "transparent", color: COLORS.steelLight, border: `1.5px solid ${COLORS.border}`, borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.steelLight, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 }}>{children}</div>;
}