import uuid

from sqlalchemy import PrimaryKeyConstraint, ForeignKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column

class CardIdentity(SQLModel, table=True):
    __tablename__ = 'card_identity'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='card_identity_pkey'),
        ForeignKeyConstraint(['set_identity_id'], ['set_identity.id'], name='fk_card_identity_set_identitiy_id',  ondelete='CASCADE'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            primary_key=True,
            server_default=text('gen_random_uuid()')
        )
    )
    set_identity_id: uuid.UUID = Field(
        sa_column=mapped_column(
            PG_UUID(as_uuid=True),
            nullable=False,
            server_default=text('gen_random_uuid()')
        )
    )
