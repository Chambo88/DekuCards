from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import DateTime, PrimaryKeyConstraint, Text, text, func
from sqlalchemy.dialects.postgresql import JSONB, OID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class PublicNode(SQLModel, table=True):
    __tablename__ = 'PublicNode'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PublicNode_pkey'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    created_at: datetime = Field(
        sa_column=mapped_column(DateTime, nullable=False, server_default=func.now())
    )
    targeted_version: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
    description: Optional[str] = Field(
        default=None,
        sa_column=mapped_column(Text)
    )
    node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )