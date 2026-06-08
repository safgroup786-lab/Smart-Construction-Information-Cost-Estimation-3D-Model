import React, { useState } from "react";

const COLORS = {
  primary: "#B45309",
  primaryLight: "#FEF3C7",
  primaryDark: "#78350F",
  accent: "#D97706",
  steel: "#374151",
  steelLight: "#6B7280",
  card: "#FFFFFF",
  border: "#E5E7EB",
  danger: "#991B1B",
  dangerBg: "#FEE2E2",
  sidebar: "#1C1917",
};

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "contractor", company: "" });
  const [error, setError] = useState("");

  const DEMO_USERS = [
    { id: 1, name: "Admin User", email: "admin@buildpro.pk", password: "admin123", role: "admin", company: "BuildPro Systems" },
    { id: 2, name: "Ahmed Contractor", email: "ahmed@contractor.pk", password: "pass123", role: "contractor", company: "Ahmed Construction" },
  ];

  function handleSubmit() {
    setError("");
    if (tab === "login") {
      const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
      if (user) { 
        onLogin(user); 
      } else { 
        setError("Invalid credentials. Try admin@buildpro.pk / admin123");
      }
    } else {
      if (!form.name || !form.email || !form.password) { 
        setError("All fields are required.");
        return; 
      }
      if (form.password.length < 6) { 
        setError("Password must be at least 6 characters."); 
        return;
      }
      const newUser = { id: Math.random(), ...form };
      onLogin(newUser);
    }
  }

  const inp = { fontSize: 14, padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, width: "100%", outline: "none", background: "#fafafa", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.sidebar} 0%, #2D1B0A 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: COLORS.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 24 }}>🏗️</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FFF", letterSpacing: -0.5 }}>BuildPro</div>
              <div style={{ fontSize: 12, color: "#D6D3D1", letterSpacing: 1.5 }}>COST ESTIMATOR</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#A8A29E", marginTop: 4 }}>Pakistan's Smart Construction Planning System</p>
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, padding: 32, boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={{ flex: 1, padding: "8px 0", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize",
                  background: tab === t ? COLORS.card : "transparent",
                  color: tab === t ? COLORS.primary : COLORS.steelLight,
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                  transition: "all 0.2s" }}>
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {error && <div style={{ background: COLORS.dangerBg, color: COLORS.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "register" && (
              <input style={inp} placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            )}
            <input style={inp} placeholder="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={inp} placeholder="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
         
            {tab === "register" && (
              <>
                <input style={inp} placeholder="Company / Firm Name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                <select style={inp} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="contractor">Contractor</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            <button onClick={handleSubmit}
              style={{ padding: "12px 0", background: COLORS.primary, color: "#FFF", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.3, transition: "background 0.2s" }}>
              {tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          {tab === "login" && (
            <div style={{ marginTop: 20, padding: "12px 14px", background: COLORS.primaryLight, borderRadius: 8, fontSize: 12 }}>
              <strong style={{ color: COLORS.primaryDark }}>Demo Accounts:</strong>
              <div style={{ color: COLORS.steel, marginTop: 4 }}>Admin: admin@buildpro.pk / admin123</div>
              <div style={{ color: COLORS.steel }}>Contractor: ahmed@contractor.pk / pass123</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}