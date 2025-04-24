from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from sqlmodel import Session
import uuid
import logging
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

# Fetch tree strucutre, 
@router.get(
    "/tree/{user_id}",
    status_code=status.HTTP_200_OK,
    summary="Retrieve the tree structure for a user"
)
def get_tree_structure(
    user_id: uuid.UUID,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    logger.error("Fetching tree data") # todo change the log level
    logger.error(user_id)
    logger.error(token.sub)

    token_user_id = uuid.UUID(token.sub)
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        tree_data = tree_service(session, user_id)
        print(tree_data)
        return tree_data
    except Exception as e:
        logger.error("ok1")
        session.rollback()
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )

