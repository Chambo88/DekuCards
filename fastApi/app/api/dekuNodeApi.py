from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import uuid
import logging
from services.set_service import create_deku_set
from services.node_service import create_deku_node
from schemas.node_schema import CreateNodeSetPayload, DeleteNodePayload
from services.tree_service import tree_service
from core.database import get_session
from core.auth import validate_token, TokenData


logger = logging.getLogger(__name__)
router = APIRouter()

# Create cardset button - creates a node and a child set
@router.post(
    "/setnode",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new flashcard set (and Node if needed)"
)
def create_node_set(
    payload: CreateNodeSetPayload,
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
            new_node, new_user_node, new_version = create_deku_node(
                session, 
                payload.data.node, 
                payload.user_id
            )
            new_set, new_user_set, new_set_identity = create_deku_set(
                session = session, 
                deku_set = payload.data.set, 
                user_id = payload.user_id,
                node_id = new_node.id, 
                user_node_id = new_user_node.id,
                node_version_id = new_version.id,
                parent_set_id=payload.data.set.parent_set_id
            )
        return {
            "node_id": new_node.id,
            "user_node_id": new_user_node.id,
            "node_version_id": new_version.id,
            "set_id": new_set.id,
            "user_set_id": new_user_set.id,
            "set_identity_id": new_set_identity.id
        }
    except Exception as e:
        logger.error("Unexpected error: %s", e)
        raise HTTPException(status_code=500, detail="Server error during cardset (node + set) creation.")

@router.delete(
    "/set/{set_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an existing DekuSet"
)
def delete_node(
    set_id: uuid.UUID,
    payload: DeleteNodePayload,
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


# @router.post(
#     "/node",
#     status_code=status.HTTP_201_CREATED,
#     summary="Create a new flashcard set (and Node if needed)"
# )
# def create_node(
#     payload: CreateNodePayload,
#     session: Session = Depends(get_session),
#     token: TokenData = Depends(validate_token),
# ):
#     try:
#         node = payload.data
#         user_id = payload.user_id
#         if user_id != token.sub:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="You are not authorized to modify another user's data"
#             )
#         create_cardset(session, node)
#         logger.info(f"Card set created with ID")
#         return
#     except ValueError as ve:
#         logger.info(f"create flashcard bad request data.")
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
#     except Exception as e:
#         logger.error("ok")
#         session.rollback()
#         logger.info(f"Internal error")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred while creating the card set"
#         )

# @router.delete(
#     "/cardset/{cardset_id}",
#     status_code=status.HTTP_200_OK,
#     summary="Delete an existing flashcard set"
# )
# def delete_cardset_endpoint(
#     cardset_id: str,
#     session: Session = Depends(get_session)
# ):
#     try:
#         result = delete_cardset(session, cardset_id)
#         return result
#     except ValueError as ve:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
#     except Exception as e:
#         logger.error("ok")
#         session.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="An error occurred while deleting the card set"
#         )

# # @router.delete(
# #     "/node/{node_id}",
# #     status_code=status.HTTP_200_OK,
# #     summary="Delete an existing node"
# # )
# # def delete_node_endpoint(
# #     node_id: str,
# #     session: Session = Depends(get_session)
# # ):
# #     try:
# #         result = delete_node(session, node_id)
# #         return result
# #     except ValueError as ve:
# #         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
# #     except Exception as e:
# #         session.rollback()
# #         raise HTTPException(
# #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #             detail="An error occurred while deleting the node"
# #         )