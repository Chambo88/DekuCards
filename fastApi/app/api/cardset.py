from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from schemas import CreateCardSet
from services.cardset_service import create_cardset
from app.core.database import get_session  # assuming you have this dependency set up

router = APIRouter()

@router.post(
    "/cardset",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flashcard set (and Node if needed)"
)
def create_flashcard_set(
    flashcard_set: CreateCardSet,
    session: Session = Depends(get_session)
):
    try:
        created_set = create_cardset(session, flashcard_set)
        return created_set
    except ValueError as ve:
        # Likely due to invalid input or missing node.
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        # Roll back in case of any unexpected error.
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the card set"
        )