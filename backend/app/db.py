import sqlite3
from sqlmodel import SQLModel, create_engine

DATABASE_URL = "sqlite:///./data/app.db"
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    run_migrations()


def column_exists(cursor: sqlite3.Cursor, table: str, column: str) -> bool:
    cursor.execute(f"PRAGMA table_info({table})")
    return any(row[1] == column for row in cursor.fetchall())


def table_exists(cursor: sqlite3.Cursor, table: str) -> bool:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,))
    return cursor.fetchone() is not None


def run_migrations() -> None:
    conn = sqlite3.connect("data/app.db")
    cursor = conn.cursor()

    # Add columns to member if missing
    member_columns = {
        "identity_status": "TEXT",
        "identity_attempts": "INTEGER DEFAULT 0",
        "identity_last_checked": "TEXT",
        "identity_notes": "TEXT",
        "eligibility_status": "TEXT",
        "eligibility_code": "TEXT",
        "eligibility_attempts": "INTEGER DEFAULT 0",
        "eligibility_last_checked": "TEXT",
        "eligibility_notes": "TEXT",
    }

    for column, col_type in member_columns.items():
        if not column_exists(cursor, "member", column):
            cursor.execute(f"ALTER TABLE member ADD COLUMN {column} {col_type}")

    # Create audit tables if missing
    if not table_exists(cursor, "identityaudit"):
        cursor.execute(
            """
            CREATE TABLE identityaudit (
                id TEXT PRIMARY KEY,
                member_id TEXT,
                result TEXT,
                reason TEXT,
                created_at TEXT
            )
            """
        )

    if not table_exists(cursor, "eligibilityaudit"):
        cursor.execute(
            """
            CREATE TABLE eligibilityaudit (
                id TEXT PRIMARY KEY,
                member_id TEXT,
                result TEXT,
                code TEXT,
                reason TEXT,
                created_at TEXT
            )
            """
        )

    if not table_exists(cursor, "plan"):
        cursor.execute(
            """
            CREATE TABLE plan (
                id TEXT PRIMARY KEY,
                name TEXT,
                tier TEXT,
                premium REAL,
                deductible REAL,
                oop_max REAL,
                coverage_summary TEXT,
                network TEXT,
                active INTEGER
            )
            """
        )

    if not table_exists(cursor, "memberplan"):
        cursor.execute(
            """
            CREATE TABLE memberplan (
                id TEXT PRIMARY KEY,
                member_id TEXT,
                plan_id TEXT,
                selected_at TEXT
            )
            """
        )

    if not table_exists(cursor, "document"):
        cursor.execute(
            """
            CREATE TABLE document (
                id TEXT PRIMARY KEY,
                member_id TEXT,
                filename TEXT,
                content_type TEXT,
                size_bytes INTEGER,
                stored_path TEXT,
                created_at TEXT
            )
            """
        )

    conn.commit()
    conn.close()
