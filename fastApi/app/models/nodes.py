from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import Boolean, DateTime, PrimaryKeyConstraint, Text, text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel, Column
from sqlalchemy.orm import mapped_column


class Nodes(SQLModel, table=True):
    __tablename__ = 'Nodes'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='Node_pkey'),
    )

    created_at: datetime = Field(
        sa_column=Column( 
            DateTime(timezone=True),    
            nullable=False,              
            server_default=text("now()") 
        )
    )
    created_by: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('auth.uid()'))
    )
    updated_at: datetime = Field(
        sa_column=mapped_column('updated_at', DateTime(True), nullable=False, server_default=text('now()'))
    )
    public_set: bool = Field(
        sa_column=mapped_column(Boolean, nullable=False, server_default=text('false'))
    )
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    icon_url: Optional[str] = Field(
        default=None,
        sa_column=mapped_column(Text)
    )