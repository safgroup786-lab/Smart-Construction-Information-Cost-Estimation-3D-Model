from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Toggle comment depending on PostgreSQL or MySQL usage
SQLALCHEMY_DATABASE_URL = "sqlite:///./smartcost.db"
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:admin123@localhost:3306/buildpro"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()