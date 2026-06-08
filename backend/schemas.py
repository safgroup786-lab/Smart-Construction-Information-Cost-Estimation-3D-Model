from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    client: Optional[str] = None
    status: str = "planning"
    location: Optional[str] = None
    budget: float = 0.0
    plotSize: float
    plotUnit: str = "marla"
    constructionType: str = "residential"
    storyType: str = "single"
    rooms: int = 4
    actualCost: Optional[str] = ""
    description: Optional[str] = ""

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True