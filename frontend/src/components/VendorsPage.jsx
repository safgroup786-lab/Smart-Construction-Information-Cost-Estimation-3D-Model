import React from 'react';

const VENDORS = [
  { id: 1, name: "Pakistan Steel Mills", category: "Steel & Iron", city: "Karachi", rating: 4.8, verified: true },
  { id: 2, name: "Maple Leaf Cement", category: "Cement", city: "Lahore", rating: 4.7, verified: true },
  { id: 3, name: "Kohistan Brick Works", category: "Bricks & Blocks", city: "Islamabad", rating: 4.5, verified: true }
];

export default function VendorsPage() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Supply Chain Logistics Marketplace</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {VENDORS.map(v => (
          <div key={v.id} style={{ background: "#FFF", padding: 16, borderRadius: 12, border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ margin: 0 }}>{v.name}</h4>
              <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 12 }}>{v.category} · {v.city}</p>
            </div>
            <span style={{ color: "#065F46", background: "#D1FAE5", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✓ Verified Contractor Supply</span>
          </div>
        ))}
      </div>
    </div>
  );
}