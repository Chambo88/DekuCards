from datetime import datetime
from decimal import Decimal
from typing import Any, Optional
import uuid

from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, Computed, DateTime, Double, ForeignKeyConstraint, Index, Integer, JSON, Numeric, PrimaryKeyConstraint, SmallInteger, String, Table, Text, UUID, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB, OID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlmodel import Field, SQLModel
from sqlalchemy.orm import mapped_column


metadata = SQLModel.metadata












# ---------------------------
# Nodes Table
# ---------------------------



# ---------------------------
# PublicNode Table
# ---------------------------



# ---------------------------
# SetIdentities Table
# ---------------------------



# ---------------------------
# Sets Table
# ---------------------------



