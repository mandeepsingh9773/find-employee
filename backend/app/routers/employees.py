import logging

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from app.schemas import EmployeeResponse
from app.services.employee_service import find_employees

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("", response_model=list[EmployeeResponse])
def get_employees(
    search: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(default=50, ge=1, le=100),
):
    try:
        return find_employees(search=search, limit=limit)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except SQLAlchemyError:
        logger.exception("Database error while searching employees")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to search employees at this time.",
        ) from None
