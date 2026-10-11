from sqlalchemy import text
from app.database import engine

def search_employees(search: str, limit: int = 50) -> list[dict]:
    query = text("""
        SELECT
            id,
            name,
            email,
            department,
            designation,
            date_of_joining
        FROM employees
        WHERE name LIKE :pattern
           OR department LIKE :pattern
        ORDER BY name
        LIMIT :limit
    """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {
                "pattern": f"{search}%",
                "limit": limit,
            },
        )

        return [dict(row) for row in result.mappings().all()]
