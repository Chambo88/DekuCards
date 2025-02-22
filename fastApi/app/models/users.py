# from datetime import datetime
# from typing import Dict, Any, Optional
# import uuid

# from sqlalchemy import Boolean, CheckConstraint, Computed, DateTime, Index, PrimaryKeyConstraint, SmallInteger, String, Text, UniqueConstraint, text
# from sqlalchemy.types import TypeDecorator, JSON
# from sqlalchemy.dialects.postgresql import JSONB
# from sqlalchemy.dialects.postgresql import UUID as PG_UUID
# from sqlmodel import Field, SQLModel
# from sqlalchemy.orm import mapped_column

# class Users(SQLModel):
#     __table_args__ = (
#         CheckConstraint('email_change_confirm_status >= 0 AND email_change_confirm_status <= 2', name='users_email_change_confirm_status_check'),
#         PrimaryKeyConstraint('id', name='users_pkey'),
#         UniqueConstraint('phone', name='users_phone_key'),
#         Index('confirmation_token_idx', 'confirmation_token', unique=True),
#         Index('email_change_token_current_idx', 'email_change_token_current', unique=True),
#         Index('email_change_token_new_idx', 'email_change_token_new', unique=True),
#         Index('reauthentication_token_idx', 'reauthentication_token', unique=True),
#         Index('recovery_token_idx', 'recovery_token', unique=True),
#         Index('users_email_partial_key', 'email', unique=True),
#         Index('users_instance_id_email_idx', 'instance_id'),
#         Index('users_instance_id_idx', 'instance_id'),
#         Index('users_is_anonymous_idx', 'is_anonymous'),
#         {'comment': 'Auth: Stores user login data within a secure schema.', 'schema': 'auth'}
#     )

#     id: uuid.UUID = Field(
#         sa_column=mapped_column(PG_UUID(as_uuid=True))
#     )
#     is_sso_user: bool = Field(
#         sa_column=mapped_column(Boolean, nullable=False, server_default=text('false'), comment='Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.')
#     )
#     is_anonymous: bool = Field(
#         sa_column=mapped_column(Boolean, nullable=False, server_default=text('false'))
#     )
#     instance_id: Optional[uuid.UUID] = Field(
#         default=None,
#         sa_column=mapped_column(PG_UUID(as_uuid=True))
#     )
#     aud: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     role: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     email: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     encrypted_password: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     email_confirmed_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     invited_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     confirmation_token: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     confirmation_sent_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     recovery_token: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     recovery_sent_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     email_change_token_new: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     email_change: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255))
#     )
#     email_change_sent_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     last_sign_in_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )

#     raw_app_meta_data: Optional[Dict[str, Any]] = Field(
#         default=None,
#         sa_type=JSONB()
#     )
#     raw_user_meta_data: Optional[Dict[str, Any]] = Field(
#         default=None,
#         sa_type=JSONB()
#     )
#     is_super_admin: Optional[bool] = Field(
#         default=None,
#         sa_column=mapped_column(Boolean)
#     )
#     created_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     updated_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     phone: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(Text, server_default=text("NULL::character varying"))
#     )
#     phone_confirmed_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     phone_change: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(Text, server_default=text("''::character varying"))
#     )
#     phone_change_token: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255), server_default=text("''::character varying"))
#     )
#     phone_change_sent_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     confirmed_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True),
#             Computed('LEAST(email_confirmed_at, phone_confirmed_at)', persisted=True)
#         )
#     )
#     email_change_token_current: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255), server_default=text("''::character varying"))
#     )
#     email_change_confirm_status: Optional[int] = Field(
#         default=None,
#         sa_column=mapped_column(SmallInteger, server_default=text('0'))
#     )
#     banned_until: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     reauthentication_token: Optional[str] = Field(
#         default=None,
#         sa_column=mapped_column(String(255), server_default=text("''::character varying"))
#     )
#     reauthentication_sent_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
#     deleted_at: Optional[datetime] = Field(
#         default=None,
#         sa_column=mapped_column(DateTime(True))
#     )
