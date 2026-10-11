from app.repositories.employee_repository import search_employees


def find_employees(search: str, limit: int = 50) -> list[dict]:
    normalized_search = search.strip()

    if not normalized_search:
        raise ValueError("Search query cannot be empty.")

    return search_employees(
        search=normalized_search,
        limit=limit,
    )
