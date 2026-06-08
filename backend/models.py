from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    client = Column(String(255))
    status = Column(String(50), default="planning")
    location = Column(String(255))
    budget = Column(Float, default=0.0)
    plotSize = Column(Float, nullable=False)
    plotUnit = Column(String(50), default="marla")
    constructionType = Column(String(100), default="residential")
    storyType = Column(String(50), default="single")
    rooms = Column(Integer, default=4)
    actualCost = Column(String(255), default="")
    description = Column(Text, default="")