from datetime import datetime
from typing import Any, Dict, Optional
import uuid

from sqlalchemy import DateTime, JSON, PrimaryKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel, Column, Float
from sqlalchemy.orm import mapped_column


class Sets(SQLModel, table=True):
    __tablename__ = 'Sets'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='CardSets_pkey'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    set_identity_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    name: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    created_by: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('auth.uid()'))
    )
    created_at: datetime = Field(
        sa_column=Column( 
            DateTime(timezone=True),    
            nullable=False,              
            server_default=text("now()") 
        )
    )
    description: Optional[str] = Field( 
        default=None,
        sa_column=mapped_column(Text)
    )
    prerequisites: Optional[Dict[str, Any]] = Field(
        default=None,
        sa_type=JSON()
    )
    node_version_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    x_relative_node: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )
    y_relative_node: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )