import os
import sqlite3
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_DIR = BASE_DIR / "database"
DATABASE_FILE = DATABASE_DIR / "safetour.db"

# Default to local SQLite database if not specified in environment
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATABASE_FILE}")

# For SQLite, enable check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency for yielding database session per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Create all tables in the database if they do not exist.
    """
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)
    import models  # Ensure all models are imported before creating tables
    Base.metadata.create_all(bind=engine)


def get_connection():
    """SQLite database se raw connection create karta hai."""
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(
        DATABASE_FILE,
        check_same_thread=False
    )
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    """schema.sql ya ORM ko execute karke tables create karta hai."""
    init_db()


def execute_query(query, parameters=()):
    """INSERT, UPDATE aur DELETE queries ke liye."""
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(query, parameters)
        connection.commit()
        return cursor.lastrowid
    finally:
        connection.close()


def fetch_one(query, parameters=()):
    """Ek database record return karta hai."""
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(query, parameters)
        result = cursor.fetchone()
        return dict(result) if result else None
    finally:
        connection.close()


def fetch_all(query, parameters=()):
    """Multiple database records return karta hai."""
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(query, parameters)
        results = cursor.fetchall()
        return [dict(row) for row in results]
    finally:
        connection.close()
