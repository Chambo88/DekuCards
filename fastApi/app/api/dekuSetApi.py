from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from sqlmodel import Session
import uuid
import logging
from schemas.set_schema import DeleteSetPayload, UpdateSetPayload
from services.set_service import delete_deku_set, update_deku_set
from schemas.node_schema import CreateNodeSetPayload, DekuNodeBase, DekuSetBase
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData


logger = logging.getLogger(__name__)
router = APIRouter()

# Create cardset button - creates a node and a child set

@router.put(
    "/set/{set_id}",
    status_code=status.HTTP_200_OK,
    summary="Update an existing DekuSet"
)
def update_set(
    set_id: uuid.UUID,
    payload: UpdateSetPayload,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    token_user_id = uuid.UUID(token.sub)
    if payload.user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        with session.begin():
            set_id = update_deku_set(
                session, 
                payload.data.set, 
                payload.user_id
            )
        return {
            "set_id": set_id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during dekuSet update.")
    
@router.delete(
    "/set/{set_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an existing DekuSet"
)
def delete_set(
    set_id: uuid.UUID,
    payload: DeleteSetPayload,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token)
):
    token_user_id = uuid.UUID(token.sub)
    if payload.user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to fetch this user's data"
        )

    try:
        with session.begin():
            set_id = delete_deku_set(
                session, 
                payload.set_id, 
                payload.user_id
            )
        return {
            "set_id": set_id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during delete dekuSet")
