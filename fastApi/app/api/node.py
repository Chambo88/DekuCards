from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import logging
from schemas.node_schema import CreateNodePayload
from services.cardset_service import create_cardset, delete_cardset
from core.database import get_session
from core.auth import validate_token, TokenData

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/node",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flashcard set (and Node if needed)"
)
def create_node(
    payload: CreateNodePayload,
    session: Session = Depends(get_session),
    token: TokenData = Depends(validate_token),
):
    try:
        node = payload.data
        user_id = payload.user_id
        if user_id != token.sub:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to modify another user's data"
            )
        create_cardset(session, node)
        logger.info(f"Card set created with ID")
        return
    except ValueError as ve:
        logger.info(f"create flashcard bad request data.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        session.rollback()
        logger.info(f"Internal error")
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