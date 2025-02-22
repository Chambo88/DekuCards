from typing import Optional
import uuid

from sqlalchemy import Boolean, ForeignKeyConstraint, PrimaryKeyConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


class DekuUsers(SQLModel, table=True):
    __tablename__ = 'DekuUsers'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='Users_pkey'),
    )

    id: uuid.UUID = Field(
        sa_column=mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=text('auth.uid()'))
    )
    dark_mode: Optional[bool] = Field(
        default=None,
        sa_column=mapped_column(Boolean)
    )