from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import uuid
import logging
from services.card_service import delete_deku_card, update_card, create_card
from schemas.card_schema import CreateCardPayload, UpdateCardPayload, DeleteCardPayload
from core.database import get_session
from core.auth import validate_token, TokenData


logger = logging.getLogger(__name__)
router = APIRouter()

# Create cardset button - creates a node and a child set
@router.post(
    "/card",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flashcard"
)
def post_card(
    payload: CreateCardPayload,
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
            new_card, new_user_card, new_card_identity = create_card(
                session, 
                payload.data.card, 
                payload.user_id,
                payload.node_id,
                payload.set_id
            )
        return {
            "card_id": new_card.id,
            "user_card_id": new_user_card.id,
            "card_identity_id": new_card_identity.id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during card creation.")

@router.put(
    "/card/{card_id}",
    status_code=status.HTTP_200_OK,
    summary="Update an existing DekuSet"
)
def put_card(
    card_id: uuid.UUID,
    payload: UpdateCardPayload,
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
            card_id = update_card(
                session, 
                payload.data.card, 
                payload.user_id
            )
        return {
            "card_id": card_id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during card update.")
    
@router.delete(
    "/card/{card_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an existing DekuSet"
)
def delete_card(
    set_id: uuid.UUID,
    payload: DeleteCardPayload,
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
            set_id = delete_deku_card(
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

