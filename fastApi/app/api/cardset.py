from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from schemas import CreateCardSet
from services.cardset_service import create_cardset, delete_cardset
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

@router.delete(
    "/cardset/{cardset_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an existing flashcard set"
)
def delete_cardset_endpoint(
    cardset_id: str,
    session: Session = Depends(get_session)
):
    try:
        result = delete_cardset(session, cardset_id)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the card set"
        )

# @router.delete(
#     "/node/{node_id}",
#     status_code=status.HTTP_200_OK,
#     summary="Delete an existing node"
# )
# def delete_node_endpoint(
#     node_id: str,
#     session: Session = Depends(get_session)
# ):
#     try:
#         result = delete_node(session, node_id)
#         return result
#     except ValueError as ve:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
#     except Exception as e:
#         session.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred while deleting the node"
#         )