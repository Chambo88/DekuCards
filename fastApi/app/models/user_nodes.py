from typing import Optional
import uuid

from sqlalchemy import PrimaryKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class UserNodes(SQLModel, table=True):
    __tablename__ = 'UserNodes'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='UserNodes_pkey'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    user_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('auth.uid()'))
    )
    node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    parent_node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    node_version_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )