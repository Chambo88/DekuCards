from datetime import datetime
import uuid

from sqlalchemy import DateTime as SADateTime, PrimaryKeyConstraint, ForeignKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel, Column
from sqlalchemy.orm import mapped_column

class Card(SQLModel, table=True):
    __tablename__ = 'card'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='card_pkey'),
        ForeignKeyConstraint(
            ['card_identity_id'],
            ['card_identity.id'],
            name='fk_card_card_identity_id',
            ondelete='CASCADE'
        ),
        ForeignKeyConstraint(
            ['node_version_id'],
            ['node_version.id'],
            name='fk_card_node_version_id',
            ondelete='CASCADE'
        ),
        ForeignKeyConstraint(
            ['parent_set_id'],
            ['set.id'],
            name='fk_card_set_id',
            ondelete='CASCADE'
        ),
        ForeignKeyConstraint(['created_by'], ['deku_user.id'], name='fk_node_created_by'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            primary_key=True,
            server_default=text('gen_random_uuid()')
        )
    )
    front: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    back: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    parent_set_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    card_identity_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            SADateTime(timezone=True),
            nullable=False,
            server_default=text("now()")
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            SADateTime(timezone=True),
            nullable=False,
            server_default=text("now()")
        )
    )
    node_version_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
    created_by: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('auth.uid()')
        )
    )
