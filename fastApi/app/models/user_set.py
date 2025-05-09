from typing import Optional
import uuid

from sqlalchemy import Boolean, PrimaryKeyConstraint, ForeignKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column

class UserSet(SQLModel, table=True):
    __tablename__ = 'user_set'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='user_set_pkey'),
        ForeignKeyConstraint(['user_id'], ['deku_user.id'], name='fk_user_set_user_id', ondelete='CASCADE'),
        ForeignKeyConstraint(['set_identity_id'], ['set_identity.id'], name='fk_user_set_set_identity_id'),
        ForeignKeyConstraint(['user_node_id'], ['user_node.id'], name='fk_user_set_user_node_id', ondelete='CASCADE'),
        {'comment': 'Table to describe relationship between users and cardSets.'}
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
    set_identity_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    user_node_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True)
        )
    )
    enabled: bool = Field(
        sa_column=mapped_column(Boolean, nullable=False, server_default=text('false'))
    )