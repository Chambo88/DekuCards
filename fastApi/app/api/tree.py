from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import uuid

from services.tree_service import tree_service
from app.core.database import get_session

router = APIRouter()

@router.get(
    "/tree",
    status_code=status.HTTP_200_OK,
    summary="Retrieve the tree structure for a user"
)
def get_tree_structure(
    user_id: uuid.UUID,
    session: Session = Depends(get_session)
):
    try:
        tree_data = tree_service(session, user_id)
        return tree_data
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )
