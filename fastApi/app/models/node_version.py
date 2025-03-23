from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import DateTime, Integer, PrimaryKeyConstraint, Text, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel, Column
from sqlalchemy.orm import mapped_column


class NodeVersion(SQLModel, table=True):
    __tablename__ = 'node_version'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='node_version_pkey'),
    )

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=mapped_column(PG_UUID(as_uuid=True), server_default=text('gen_random_uuid()'))
    )
    # This is more 1.0.5 etc.
    version_display_num: str = Field(
        sa_column=mapped_column(Text, nullable=False)
    )
    # This is something like, Javascript 6.0 edition!
    version_name: Optional[str] = Field(
        default=None,
        sa_column=mapped_column(Text)
    )
    notes: Optional[str] = Field(
        default=None,
        sa_column=mapped_column(Text)
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
    # This is purely for database sorting etc.
    version_seq_num: Optional[int] = Field(
        default=None,
        sa_column=mapped_column(Integer)
    )
