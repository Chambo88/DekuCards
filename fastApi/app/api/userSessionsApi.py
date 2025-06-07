from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session
import uuid
import logging
from schemas.user_session_schema import UpdateUserSessionBase
from services.session_service import update_user_session, get_user_session_history
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/usersessions",
    status_code=status.HTTP_200_OK,
    summary="Update session results.",
)
def post_user_session(
    payload: UpdateUserSessionBase,
    request: Request,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token),
):
    timezone = request.headers.get("X-Timezone")
    if not timezone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-Timezone header is missing."
        )

    try:
        with session.begin():
            user_session_id = update_user_session(
                uuid.UUID(token.sub),
                payload.is_correct,
                session, 
                timezone, 
            )
        return {
            "user_session_id": user_session_id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during user session update.")
    
@router.get(
    "/usersessions/{user_id}",
    status_code=status.HTTP_200_OK,
    summary="Retrieve the tree structure for a user"
)
def get_user_sessions(
    user_id: uuid.UUID,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    token_user_id = uuid.UUID(token.sub)
    if user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        session_data = get_user_session_history(session, user_id)
        return {"sessionData": session_data}
    except Exception as e:
        session.rollback()
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the tree structure"
        )
