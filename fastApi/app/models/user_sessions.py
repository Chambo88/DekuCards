from datetime import datetime
import uuid
from typing import Optional
from sqlmodel import Column, DateTime, Float, SQLModel, Field
from sqlalchemy import Integer, PrimaryKeyConstraint, ForeignKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import mapped_column

class UserSessions(SQLModel, table=True):
    __tablename__ = 'user_sessions'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='user_sessions_pkey'),
        ForeignKeyConstraint(['user_id'], ['deku_user.id'], name='fk_user_sessions_user_id', ondelete='CASCADE')
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    user_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('auth.uid()')
        )
    )
    wrong_count: int = Field(
        default=0,
        sa_column=mapped_column(Integer)
    )
    correct_count: int = Field(
        default=0,
        sa_column=mapped_column(Integer)
    )
    date_modified: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()")
        )
    )
