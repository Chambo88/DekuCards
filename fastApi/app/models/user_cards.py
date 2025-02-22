from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import Boolean, DateTime, PrimaryKeyConstraint, SmallInteger, text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class UserCards(SQLModel, table=True):
    __tablename__ = 'UserCards'
    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'card_identity_id', name='UserCards_pkey'),
    )

    user_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
    card_identity_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
    times_correct: int = Field(
        sa_column=mapped_column(SmallInteger, nullable=False, server_default=text("'0'::smallint"))
    )
    available: datetime = Field(
        sa_column=mapped_column(DateTime, nullable=False, server_default=func.now())
    )
    enabled: bool = Field(
        sa_column=mapped_column(Boolean, nullable=False, server_default=text('true'))
    )
    last_shown_at: Optional[datetime] = Field(
        default=None,
        sa_column=mapped_column(DateTime, server_default=func.now())
    )