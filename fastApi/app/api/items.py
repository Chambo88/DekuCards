from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.item import Item
from app.core.database import get_session

router = APIRouter()

@router.post("/", response_model=Item)
def create_item(item: Item, session: Session = Depends(get_session)):
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.get("/{item_id}", response_model=Item)
def read_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
