from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import engine, Base, get_db
from models import ProjectModel
from schemas import ProjectCreate, ProjectResponse
from constants import MATERIAL_PRICES, MATERIAL_RATES, LABOR_RATES

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BuildPro Estimator Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def compute_estimation_logic(project: ProjectModel):
    # Base conversions
    size = float(project.plotSize)
    if project.plotUnit == "marla":
        sqft = size * 272.25
    elif project.plotUnit == "kanal":
        sqft = size * 5445.0
    else:
        sqft = size

    sqm = sqft * 0.0929
    key = f"{project.constructionType}_{project.storyType}"
    
    m_rate = MATERIAL_RATES.get(key, MATERIAL_RATES["residential_single"])
    l_rate = LABOR_RATES.get(key, LABOR_RATES["residential_single"])
    
    rooms_factor = 1.0 + (int(project.rooms) - 4) * 0.04
    
    materials = {
        "cement": round(m_rate["cement"] * sqm * rooms_factor, 1),
        "steel": round(m_rate["steel"] * sqm * rooms_factor, 1),
        "bricks": int(m_rate["bricks"] * sqm * rooms_factor),
        "sand": round(m_rate["sand"] * sqm * rooms_factor, 1),
        "gravel": round(m_rate["gravel"] * sqm * rooms_factor, 1),
        "tiles": round(m_rate["tiles"] * sqm * rooms_factor, 1)
    }
    
    material_cost = sum(qty * MATERIAL_PRICES[k] for k, qty in materials.items())
    duration = round((sqft / 500.0) * 3 + int(project.rooms) * 0.5)
    workers = {"mason": 4 + int(project.rooms), "carpenter": 2, "electrician": 2, "plumber": 2, "helper": 6}
    
    # Labor pricing calculation based on modern 2026 daily wage limits
    labor_cost = sum(count * (l_rate[role] / 8) * duration * 26 for role, count in workers.items())
    overhead = (material_cost + labor_cost) * 0.08
    total = material_cost + labor_cost + overhead

    return {
        "materials": materials,
        "materialCost": material_cost,
        "laborCost": labor_cost,
        "overhead": overhead,
        "total": total,
        "duration": duration,
        "workers": workers,
        "sqft": sqft,
        "sqm": sqm
    }

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = ProjectModel(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(ProjectModel).all()

@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

@app.get("/api/projects/{project_id}/estimate")
def get_project_estimate(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return compute_estimation_logic(db_project)