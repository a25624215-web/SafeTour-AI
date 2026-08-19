# SafeTour-AI Database Architecture Documentation

## 📌 Overview
The SafeTour-AI database is designed for high-availability tourist safety telemetry, AI-driven risk assessment, geofence danger tracking, emergency SOS dispatching, and crowd monitoring.

Supports:
- **Microsoft SQL Server** (`schema.sql`)
- **PostgreSQL** (`schema_postgres.sql`)
- **SQLite** (`schema_sqlite.sql`)
- **SQLAlchemy ORM** (`backend/models.py`)

---

## 🗺️ Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ EMERGENCY_CONTACTS : has
    USERS ||--o{ SAFETY_REPORTS : files
    USERS ||--o{ SOS_ALERTS : triggers
    USERS ||--o{ TRIPS : creates
    USERS ||--o{ LOCATION_HISTORY : transmits
    LOCATIONS ||--o{ SAFETY_REPORTS : occurs_at
    LOCATIONS ||--o{ SAFETY_ALERTS : targets

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string phone
        string role
        string profile_image
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    EMERGENCY_CONTACTS {
        int id PK
        int user_id FK
        string name
        string phone
        string relationship
        boolean is_primary
        datetime created_at
    }

    LOCATIONS {
        int id PK
        string name
        string address
        string city
        string state
        string country
        decimal latitude
        decimal longitude
        decimal safety_score
        string crowd_density
        string lighting_condition
        datetime created_at
    }

    GEOFENCE_ZONES {
        int id PK
        string name
        string description
        string zone_type
        string risk_level
        decimal latitude
        decimal longitude
        decimal radius_km
        string advisory_message
        boolean is_active
        datetime created_at
    }

    SAFETY_REPORTS {
        int id PK
        int user_id FK
        int location_id FK
        string report_type
        string severity
        string description
        decimal latitude
        decimal longitude
        string status
        datetime created_at
        datetime resolved_at
    }

    SOS_ALERTS {
        int id PK
        int user_id FK
        string caller_name
        decimal latitude
        decimal longitude
        string emergency_type
        string message
        string status
        string dispatched_to
        datetime created_at
        datetime resolved_at
    }

    SAFETY_ALERTS {
        int id PK
        int location_id FK
        string title
        string description
        string alert_type
        string severity
        string status
        datetime valid_until
        datetime created_at
    }

    TRIPS {
        int id PK
        int user_id FK
        string destination
        string start_location
        date start_date
        date end_date
        string safety_rating
        string status
        datetime created_at
    }

    LOCATION_HISTORY {
        int id PK
        int user_id FK
        decimal latitude
        decimal longitude
        decimal speed_kmh
        int battery_level
        datetime recorded_at
    }
```

---

## 📊 Database Schema Details

| Table | Description | Key Indexes |
| :--- | :--- | :--- |
| `users` | Tourist profiles, auth credentials & roles | `idx_users_email` |
| `emergency_contacts` | Trusted emergency phone numbers & relations | `user_id` FK |
| `locations` | Tourist spots, safety scores & crowd telemetry | `latitude`, `longitude` |
| `geofence_zones` | Hazard & restricted safety perimeters | `idx_zones_coords` |
| `safety_reports` | Crowdsourced incident logs & danger flags | `idx_reports_user`, `idx_reports_coords` |
| `sos_alerts` | Live emergency triggers & dispatch logs | `idx_sos_user`, `idx_sos_status` |
| `safety_alerts` | Public safety advisories & warnings | `location_id` FK |
| `trips` | Itineraries & trip safety ratings | `idx_trips_user` |
| `location_history` | Continuous GPS breadcrumb trails | `idx_location_history_user` |

---

## 🚀 How to Initialize & Seed the Database

### Method 1: Using Python CLI (Recommended)
```bash
# Run from SafeTour-AI root
python backend/seed.py
```
This automatically initializes the SQLite database (`safetour_ai.db`) and seeds standard Indian tourist destinations, hazard zones, and test users.

### Method 2: SQL Scripts
* **Microsoft SQL Server**: Run `database/schema.sql` followed by `database/seed_data.sql`.
* **PostgreSQL**: Execute `psql -d safetour_ai -f database/schema_postgres.sql` and `database/seed_data.sql`.
* **SQLite**: `sqlite3 safetour_ai.db < database/schema_sqlite.sql && sqlite3 safetour_ai.db < database/seed_data.sql`.
