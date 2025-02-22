from datetime import datetime
import uuid

from sqlalchemy import DateTime, PrimaryKeyConstraint, Text, text, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class Cards(SQLModel, table=True):
    __tablename__ = 'Cards'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='Card_pkey'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    )
    front: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    back: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    card_identity: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
    created_at: datetime = Field(
        sa_column=mapped_column(DateTime, nullable=False, server_default=func.now())
    )
    node_version_id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), nullable=False, server_default=text('gen_random_uuid()'))
    )
