from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import uuid
import logging
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

# @router.get("/tree/test")
# def test_tree_endpoint():
#     return {"message": "Tree endpoint is working"}

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

    return {"Test ": 123}
    token_user_id = uuid.UUID(token.sub)
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )
    try:

        tree_data = tree_service(session, user_id)
        return tree_data
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )
