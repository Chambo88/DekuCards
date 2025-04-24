import uuid

from sqlalchemy import PrimaryKeyConstraint, ForeignKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column

class SetIdentity(SQLModel, table=True):
    __tablename__ = 'set_identity'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='set_identity_pkey'),
        ForeignKeyConstraint(['node_id'], ['node.id'], name='fk_set_identity_node_id', ondelete='CASCADE'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    node_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
