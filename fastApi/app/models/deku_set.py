from datetime import datetime
from typing import Any, Dict, Optional, List
import uuid

from pydantic import BaseModel
from sqlalchemy import DateTime, JSON, PrimaryKeyConstraint, ForeignKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy import Column as AlcColumn
from sqlmodel import Field, SQLModel, Column, Float
from sqlalchemy.orm import mapped_column

class Prerequisite(BaseModel):
    name: str
    link: Optional[str] = None

class DekuSet(SQLModel, table=True):
    __tablename__ = 'set'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='set_pkey'),
        ForeignKeyConstraint(
            ['set_identity_id'],
            ['set_identity.id'],
            name='fk_deku_set_set_identity_id', 
            ondelete='CASCADE'
        ),
        ForeignKeyConstraint(
            ['parent_set_id'],
            ['set.id'],
            name='fk_deku_set_parent_set_id'
        ),
        ForeignKeyConstraint(
            ['node_version_id'],
            ['node_version.id'],
            name='fk_deku_set_node_version_id', 
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
    set_identity_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    parent_set_id: Optional[uuid.UUID] = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=True,
            server_default=text('gen_random_uuid()')
        )
    )
    node_version_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    title: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    created_by: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('auth.uid()')
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=text("now()")
        )
    )
    updated_at: datetime = Field(
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
    prerequisites: List[Prerequisite] = Field(
        default_factory=list,
        sa_column=AlcColumn(JSONB, nullable=False),
    )
    relative_x: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )
    relative_y: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )

