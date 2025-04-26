from datetime import datetime, timezone
from typing import Optional, Tuple
import uuid
from fastapi import HTTPException, status
from sqlalchemy import select, and_
from sqlmodel import Session 
from models import CardIdentity, DekuSet, UserSet, UserCard, Card, SetIdentity, UserNode, DekuNode
from schemas.card_schema import CardBase

def create_card(
    session: Session,
    card: CardBase,
    user_id: uuid.UUID,
    node_id: uuid.UUID,
    set_id: uuid.UUID,
):
    now = datetime.now(timezone.utc)

    stmt = (
        select(DekuSet, UserSet, UserNode)
        .join(
            UserSet,
            and_(
                UserSet.user_id == user_id,
                UserSet.set_identity_id == DekuSet.set_identity_id,
            ),
        )
        .join(
            UserNode,
            and_(
                UserNode.node_id == node_id,
                UserNode.user_id == user_id,
            ),
        )
        .where(DekuSet.id == set_id)
    )
    result: Optional[Tuple[DekuSet, UserSet, UserNode]] = session.exec(stmt).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No such set (or permission) for user {user_id} and set {set_id}"
        )

    set_db, user_set_db, user_node = result

    if set_db.created_by != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this set."
        )

    card_identity = CardIdentity(set_identity_id=set_db.set_identity_id)
    session.add(card_identity)
    session.flush()

    new_card = Card(
        id=card.id,
        card_identity_id=card_identity.id,
        parent_set_id=set_id,
        front=card.front,
        back=card.back,
        node_version_id=set_db.node_version_id,
        created_at=now,
        updated_at=now,
        created_by=user_id,
    )

    new_user_card = UserCard(
        user_id=user_id,
        card_identity_id=card_identity.id,
        user_node_id=user_node.id,
        times_correct=card.times_correct,
        user_set_id=user_set_db.id,
        available_date=now,
        enabled=card.enabled,
        last_shown_at_date=card.last_shown_at_date,
        streak_start_date=now,
    )

    session.add_all([new_card, new_user_card])

    return new_card, new_user_card, card_identity

def update_card(
        session: Session, 
        card_data: CardBase, 
        user_id: uuid.UUID
    ):

    card_db = session.get(Card, card_data.id)
    if not card_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set not found")
    
    user_card_db : UserCard = session.exec(
        select(UserCard)
        .where(
            UserCard.user_id == user_id,
            UserCard.card_identity_id == card_db.card_identity_id
        )
    ).scalar_one()

    if not user_card_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User card not found for user {user_id} and {card_db.card_identity_id}"
        )
    
    if not user_id == card_db.created_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this card."
        )

    card_db.front = card_data.front
    card_db.back = card_data.back
    card_db.updated_at = datetime.now(timezone.utc)

    user_card_db.enabled = card_data.enabled
    user_card_db.available_date = card_data.available_date
    user_card_db.last_shown_at_date = card_data.last_shown_at_date
    user_card_db.times_correct = card_data.times_correct

    return card_data.id

# This is used specifically to delete a card in a user tree that they own, do not use for public cards
# They need to be handled differently (To only delete the relevant version)
def delete_deku_card(session: Session, card_id: str, user_id: str):
    deku_card_db = session.get(Card, card_id)
    if not deku_card_db:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Card not found")

    if not user_id == deku_card_db.created_by:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this card."
        )

    sid = deku_card_db.card_identity_id
    
    card_identity : CardIdentity = session.exec(
        select(CardIdentity)
        .where(
            CardIdentity.id == sid
        )
    ).first()

    session.delete(card_identity)

    return {"message": "Cardset deleted successfully"}
