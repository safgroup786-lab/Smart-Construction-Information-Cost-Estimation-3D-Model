import React, { useState } from "react";
import { COLORS } from "../colors";
import ModelViewer3D from "./ModelViewer3D";

// Replicate backend estimation logic on the frontend (no API dependency needed)
function computeEstimate(project) {
  const MATERIAL_PRICES = { cement: 1540, steel: 280, bricks: 21, sand: 85, gravel: 200, tiles: 350 };
  const MATERIAL_RATES = {
    residential_single: { cement: 0.45, steel: 3.5, bricks: 550, sand: 0.6, gravel: 0.4, tiles: 0.9 },
    residential_double: { cement: 0.55, steel: 4.2, bricks: 650, sand: 0.75, gravel: 0.5, tiles: 1.1 },
    commercial_single: { cement: 0.6, steel: 5.0, bricks: 700, sand: 0.8, gravel: 0.55, tiles: 0.7 },
    commercial_double: { cement: 0.75, steel: 6.5, bricks: 800, sand: 1.0, gravel: 0.7, tiles: 0.8 },
  };
  const LABOR_RATES = {
    residential_single: { mason: 2200, carpenter: 2500, electrician: 2800, plumber: 2600, helper: 1500 },
    residential_double: { mason: 2400, carpenter: 2700, electrician: 3000, plumber: 2800, helper: 1600 },
    commercial_single: { mason: 2600, carpenter: 3000, electrician: 3500, plumber: 3200, helper: 1800 },
    commercial_double: { mason: 3000, carpenter: 3400, electrician: 4000, plumber: 3800, helper: 2000 },
  };

  const size = parseFloat(project.plotSize);
  let sqft = size;
  if (project.plotUnit === "marla") sqft = size * 272.25;
  else if (project.plotUnit === "kanal") sqft = size * 5445.0;
  const sqm = sqft * 0.0929;
  const key = `${project.constructionType}_${project.storyType}`;
  const m_rate = MATERIAL_RATES[key] || MATERIAL_RATES["residential_single"];
  const l_rate = LABOR_RATES[key] || LABOR_RATES["residential_single"];
  const rooms_factor = 1.0 + (parseInt(project.rooms) - 4) * 0.04;

  const materials = {
    cement: Math.round(m_rate.cement * sqm * rooms_factor * 10) / 10,
    steel: Math.round(m_rate.steel * sqm * rooms_factor * 10) / 10,
    bricks: Math.round(m_rate.bricks * sqm * rooms_factor),
    sand: Math.round(m_rate.sand * sqm * rooms_factor * 10) / 10,
    gravel: Math.round(m_rate.gravel * sqm * rooms_factor * 10) / 10,
    tiles: Math.round(m_rate.tiles * sqm * rooms_factor * 10) / 10,
  };

  const material_cost = Object.entries(materials).reduce((s, [k, qty]) => s + qty * MATERIAL_PRICES[k], 0);
  const duration = Math.round((sqft / 500.0) * 3 + parseInt(project.rooms) * 0.5);
  const workers = { mason: 4 + parseInt(project.rooms), carpenter: 2, electrician: 2, plumber: 2, helper: 6 };
  const labor_cost = Object.entries(workers).reduce((s, [role, count]) => s + count * (l_rate[role] / 8) * duration * 26, 0);
  const overhead = (material_cost + labor_cost) * 0.08;
  const total = material_cost + labor_cost + overhead;

  return { materials, materialCost: material_cost, laborCost: labor_cost, overhead, total, duration, workers, sqft, sqm };
}

export default function EstimationDetail({ project, onBack }) {
  const est = project.estimate || computeEstimate(project);

  const materialRows = [
    { name: "Cement", unit: "Bags", qty: est.materials.cement, price: 1540 },
    { name: "Steel", unit: "Kg", qty: est.materials.steel, price: 280 },
    { name: "Bricks", unit: "Pcs", qty: est.materials.bricks, price: 21 },
    { name: "Sand", unit: "cu.ft", qty: est.materials.sand, price: 85 },
    { name: "Gravel / Aggregate", unit: "cu.ft", qty: est.materials.gravel, price: 200 },
    { name: "Floor Tiles", unit: "sq.ft", qty: est.materials.tiles, price: 350 },
  ];

  const fmt = (n) => "PKR " + Math.round(n).toLocaleString("en-PK");

  return (
    <div style={{ padding: "4px 0" }}>
      <button onClick={onBack} style={{ marginBottom: 16, padding: "8px 14px", background: COLORS.border, border: "none", borderRadius: 6, cursor: "pointer", color: COLORS.steel, fontWeight: 600 }}>
        ← Back to Projects
      </button>

      <ModelViewer3D project={project} />

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
        <h2 style={{ margin: "0 0 8px", color: COLORS.steel }}>{project.name} — Cost Analysis Report (2026)</h2>
        <p style={{ margin: "0 0 4px", color: COLORS.steelLight, fontSize: 13 }}>
          {project.plotSize} {project.plotUnit} · {project.constructionType} · {project.storyType} story · {project.rooms} rooms
        </p>
        <p style={{ margin: "0 0 20px", color: COLORS.steelLight, fontSize: 13 }}>
          Area: {Math.round(est.sqft)} sq.ft ({Math.round(est.sqm)} sq.m) · Estimated Duration: {est.duration} months
        </p>

        <h3 style={{ marginTop: 24, color: COLORS.primary }}>Material Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: `2px solid ${COLORS.border}` }}>
              <th style={{ padding: 10, textAlign: "left" }}>Material</th>
              <th style={{ padding: 10, textAlign: "right" }}>Quantity</th>
              <th style={{ padding: 10, textAlign: "right" }}>Unit</th>
              <th style={{ padding: 10, textAlign: "right" }}>Rate (PKR)</th>
              <th style={{ padding: 10, textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {materialRows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 10 }}>{r.name}</td>
                <td style={{ padding: 10, textAlign: "right" }}>{r.qty}</td>
                <td style={{ padding: 10, textAlign: "right", color: COLORS.steelLight }}>{r.unit}</td>
                <td style={{ padding: 10, textAlign: "right" }}>{r.price.toLocaleString()}</td>
                <td style={{ padding: 10, textAlign: "right", fontWeight: 600 }}>{fmt(r.qty * r.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Material Cost", val: est.materialCost, color: "#1D4ED8" },
            { label: "Labor Cost", val: est.laborCost, color: "#059669" },
            { label: "Overhead (8%)", val: est.overhead, color: "#D97706" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#F9FAFB", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.steelLight, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{fmt(item.val)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 18, background: COLORS.primaryLight, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: COLORS.primaryDark }}>Total Projected Cost</span>
          <strong style={{ fontSize: 20, color: COLORS.primaryDark }}>{fmt(est.total)}</strong>
        </div>
      </div>
    </div>
  );
}
