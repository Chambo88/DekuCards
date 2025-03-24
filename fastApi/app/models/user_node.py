import uuid
from typing import Optional
from sqlmodel import Float, SQLModel, Field
from sqlalchemy import PrimaryKeyConstraint, ForeignKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import mapped_column

class UserNode(SQLModel, table=True):
    __tablename__ = 'user_node'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='user_node_pkey'),
        ForeignKeyConstraint(['user_id'], ['deku_user.id'], name='fk_user_node_user_id'),
        ForeignKeyConstraint(['node_id'], ['node.id'], name='fk_user_node_node_id'),
        ForeignKeyConstraint(['parent_node_id'], ['node.id'], name='fk_user_node_parent_node_id'),
        ForeignKeyConstraint(['node_version_id'], ['node_version.id'], name='fk_user_node_node_version_id'),
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
    node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    parent_node_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    node_version_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            server_default=text('gen_random_uuid()')
        )
    )
    node_enabled: bool = Field(default=True, nullable=False)
    position_x: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )
    position_y: float = Field(
        sa_column=mapped_column(Float, nullable=False)
    )