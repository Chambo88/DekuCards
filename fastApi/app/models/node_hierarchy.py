import uuid

from sqlalchemy import  PrimaryKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class NodeHierarchy(SQLModel, table=True):
    __tablename__ = 'NodeHierarchy'
    __table_args__ = (
        PrimaryKeyConstraint('parent_set_id', 'child_set_id', name='GroupHierarchy_pkey'),
    )

    parent_set_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
    child_set_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )