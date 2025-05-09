from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import DateTime, PrimaryKeyConstraint, ForeignKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel, Column
from sqlalchemy.orm import mapped_column

class PublicNode(SQLModel, table=True):
    __tablename__ = 'public_node'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='public_node_pkey'),
        ForeignKeyConstraint(
            ['current_version'],
            ['node_version.id'],
            name='fk_public_node_current_version'
        ),
        ForeignKeyConstraint(
            ['node_id'],
            ['node.id'],
            name='fk_public_node_node_id',
            ondelete='CASCADE'
        ),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()")
        )
    )
    current_version: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    description: Optional[str] = Field(
        default=None,
        sa_column=mapped_column(Text)
    )
    node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    creator_name: str = Field(
        default="",
        nullable=False
    )
