import React, { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import ProjectsList from "./components/ProjectsList";
import ProjectForm from "./components/ProjectForm";
import AdminPanel from "./components/AdminPanel";
import ArchitectsPage from "./components/ArchitectsPage";
import VendorsPage from "./components/VendorsPage";
import DashboardPage from "./components/Dashboard";

const COLORS = {
  primary: "#B45309", primaryLight: "#FEF3C7", primaryDark: "#78350F", accent: "#D97706",
  steel: "#374151", steelLight: "#6B7280", bg: "#FFFBF5", card: "#FFFFFF", border: "#E5E7EB",
  sidebar: "#1C1917", sidebarText: "#E7E5E4", sidebarActive: "#D97706",
};

// Frontend estimation logic (mirrors backend)
function calcEstimate(form) {
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

  const size = parseFloat(form.plotSize);
  let sqft = size;
  if (form.plotUnit === "marla") sqft = size * 272.25;
  else if (form.plotUnit === "kanal") sqft = size * 5445.0;
  const sqm = sqft * 0.0929;
  const key = `${form.constructionType}_${form.storyType}`;
  const m_rate = MATERIAL_RATES[key] || MATERIAL_RATES["residential_single"];
  const l_rate = LABOR_RATES[key] || LABOR_RATES["residential_single"];
  const rooms_factor = 1.0 + (parseInt(form.rooms) - 4) * 0.04;

  const materials = {
    cement: Math.round(m_rate.cement * sqm * rooms_factor * 10) / 10,
    steel: Math.round(m_rate.steel * sqm * rooms_factor * 10) / 10,
    bricks: Math.round(m_rate.bricks * sqm * rooms_factor),
    sand: Math.round(m_rate.sand * sqm * rooms_factor * 10) / 10,
    gravel: Math.round(m_rate.gravel * sqm * rooms_factor * 10) / 10,
    tiles: Math.round(m_rate.tiles * sqm * rooms_factor * 10) / 10,
  };

  const material_cost = Object.entries(materials).reduce((s, [k, qty]) => s + qty * MATERIAL_PRICES[k], 0);
  const duration = Math.round((sqft / 500.0) * 3 + parseInt(form.rooms) * 0.5);
  const workers = { mason: 4 + parseInt(form.rooms), carpenter: 2, electrician: 2, plumber: 2, helper: 6 };
  const labor_cost = Object.entries(workers).reduce((s, [role, count]) => s + count * (l_rate[role] / 8) * duration * 26, 0);
  const overhead = (material_cost + labor_cost) * 0.08;
  const total = material_cost + labor_cost + overhead;

  return { materials, materialCost: material_cost, laborCost: labor_cost, overhead, total, duration, workers, sqft, sqm };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 1, name: "Admin User", email: "admin@buildpro.pk", role: "admin", company: "BuildPro Systems" },
    ]);
  }, []);

  if (!user) return <AuthPage onLogin={setUser} />;

  const navBtn = (id, label) => (
    <button
      key={id}
      onClick={() => { setPage(id); setShowForm(false); setEditProject(null); }}
      style={{ background: page === id ? COLORS.sidebarActive : "transparent", color: "#FFF", border: "none", padding: 12, borderRadius: 8, textAlign: "left", cursor: "pointer", fontSize: 14 }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: COLORS.sidebar, color: COLORS.sidebarText, padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🏗️</span>
            <div>
              <div style={{ fontWeight: 700, color: "#FFF", fontSize: 16 }}>BuildPro</div>
              <div style={{ fontSize: 10, color: "#A8A29E", letterSpacing: 1.5 }}>COST ESTIMATOR</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navBtn("dashboard", "📊 Dashboard")}
          {navBtn("projects", "📐 Estimates Pipeline")}
          {user.role === "admin" && navBtn("admin", "🔑 Admin Panel")}
          {navBtn("architects", "🏛️ Architects")}
          {navBtn("vendors", "🚚 Vendors Supply")}
        </div>
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontSize: 12, color: "#78716C", marginBottom: 8, paddingLeft: 12 }}>{user.name}</div>
          <button onClick={() => setUser(null)} style={{ background: "transparent", color: "#F87171", border: "none", padding: "10px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer", fontSize: 14, width: "100%" }}>
            ← Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {page === "dashboard" && <DashboardPage projects={projects} user={user} />}
        {page === "admin" && user.role === "admin" && <AdminPanel projects={projects} users={users} />}
        {page === "architects" && <ArchitectsPage />}
        {page === "vendors" && <VendorsPage />}

        {page === "projects" && !showForm && !editProject && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: COLORS.steel }}>Active Project Matrix</h2>
              <button
                onClick={() => setShowForm(true)}
                style={{ background: COLORS.primary, color: "#FFF", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}
              >
                + New Project
              </button>
            </div>
            {projects.length === 0 ? (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: COLORS.steelLight }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p>No projects yet. Click "+ New Project" to create your first estimate.</p>
              </div>
            ) : (
              <ProjectsList
                projects={projects}
                onEdit={(p) => setEditProject(p)}
                onDelete={(id) => setProjects(projects.filter(p => p.id !== id))}
              />
            )}
          </div>
        )}

        {page === "projects" && showForm && !editProject && (
          <ProjectForm
            calcEstimate={calcEstimate}
            onSave={(newProj) => { setProjects([...projects, newProj]); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {page === "projects" && editProject && (
          <ProjectForm
            initial={editProject}
            calcEstimate={calcEstimate}
            onSave={(updated) => {
              setProjects(projects.map(p => p.id === updated.id ? updated : p));
              setEditProject(null);
            }}
            onCancel={() => setEditProject(null)}
          />
        )}
      </div>
    </div>
  );
}
