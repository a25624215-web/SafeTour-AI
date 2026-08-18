import sqlite3
from pathlib import Path

# SafeTour-AI project ka root folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Database folder
DATABASE_DIR = BASE_DIR / "database"

# SQLite database file
DATABASE_FILE = DATABASE_DIR / "safetour.db"


def get_connection():
    """SQLite database se connection create karta hai."""

    DATABASE_DIR.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(
        DATABASE_FILE,
        check_same_thread=False
    )

    connection.row_factory = sqlite3.Row

    return connection


def init_database():
    """schema.sql ko execute karke tables create karta hai."""

    schema_file = DATABASE_DIR / "schema.sql"

    if not schema_file.exists():
        raise FileNotFoundError(
            f"Database schema not found: {schema_file}"
        )

    connection = get_connection()

    try:
        with open(schema_file, "r", encoding="utf-8") as file:
            schema = file.read()

        connection.executescript(schema)
        connection.commit()

        print("SafeTour AI database initialized successfully.")

    except Exception as error:
        connection.rollback()
        print(f"Database initialization failed: {error}")
        raise

    finally:
        connection.close()


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
