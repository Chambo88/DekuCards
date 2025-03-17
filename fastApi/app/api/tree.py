from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import uuid
import logging
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/tree",
    status_code=status.HTTP_200_OK,
    summary="Retrieve the tree structure for a user"
)
def get_tree_structure(
    user_id: uuid.UUID,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    logger.info("Fetching tree data")
    try:
        if user_id != token.sub:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to modify another user's data"
            )
        tree_data = tree_service(session, user_id)
        return tree_data
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )
