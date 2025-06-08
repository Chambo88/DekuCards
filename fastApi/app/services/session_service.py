from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List
import uuid
from sqlalchemy import select, func, cast, Date
from sqlmodel import Session
from models import UserSessions 

def update_user_session(user_id: uuid.UUID, is_right: bool, session: Session, user_timezone: str):
    user_current_date = cast(func.now().op('AT TIME ZONE')(user_timezone), Date)
    stored_user_date = cast(UserSessions.date_modified.op('AT TIME ZONE')(user_timezone), Date)

    statement = select(UserSessions).where(
        UserSessions.user_id == user_id,
        stored_user_date == user_current_date
    )
    
    user_session_db = session.exec(statement).one_or_none()

    if user_session_db:
        if is_right:
            user_session_db.correct_count += 1
        else:
            user_session_db.wrong_count += 1
        user_session_db.date_modified = datetime.now(timezone.utc)
    else:
        user_session_db = UserSessions(
            user_id=user_id,
            correct_count=1 if is_right else 0,
            wrong_count=1 if not is_right else 0
        )

    session.add(user_session_db)
    session.commit()
    session.refresh(user_session_db)

    return user_session_db

def get_user_session_history(session: Session, user_id: uuid.UUID) -> List[Dict[str, Any]]:
    one_year_ago = datetime.now(timezone.utc) - timedelta(days=366)

    statement = select(UserSessions).where(
        UserSessions.user_id == user_id,
        UserSessions.date_modified >= one_year_ago
    ).order_by(UserSessions.date_modified)

    user_sessions_db = session.exec(statement).scalars().all()

    formatted_session_data: List[Dict[str, Any]] = []
    for session_record in user_sessions_db:
        formatted_session_data.append({
            "correct": session_record.correct_count,
            "wrong": session_record.wrong_count,
            "date": session_record.date_modified.isoformat()
        })
    return formatted_session_data

