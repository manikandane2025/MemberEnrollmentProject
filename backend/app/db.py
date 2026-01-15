from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///./data/app.db"
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
