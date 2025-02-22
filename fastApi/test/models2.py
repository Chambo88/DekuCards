from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, Computed, DateTime, Double, ForeignKeyConstraint, Index, Integer, JSON, Numeric, PrimaryKeyConstraint, SmallInteger, String, Table, Text, UUID, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB, OID
from sqlalchemy.orm.base import Mapped
from sqlmodel import Field, SQLModel

metadata = SQLModel.metadata


class CardIdentities(SQLModel, table=True):
    __tablename__ = 'CardIdentities'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='CardIdentities_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    set_id: UUID = Field(sa_column=mapped_column('set_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))


class Cards(SQLModel, table=True):
    __tablename__ = 'Cards'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='Card_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    front: str = Field(sa_column=mapped_column('front', Text, nullable=False))
    back: str = Field(sa_column=mapped_column('back', Text, nullable=False))
    card_identity: UUID = Field(sa_column=mapped_column('card_identity', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    created_at: datetime = Field(sa_column=mapped_column('created_at', DateTime, nullable=False, server_default=text('now()')))
    node_version_id: UUID = Field(sa_column=mapped_column('node_version_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))


class NodeHierarchy(SQLModel, table=True):
    __tablename__ = 'NodeHierarchy'
    __table_args__ = (
        PrimaryKeyConstraint('parent_set_id', 'child_set_id', name='GroupHierarchy_pkey'),
    )

    parent_set_id: UUID = Field(sa_column=mapped_column('parent_set_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    child_set_id: UUID = Field(sa_column=mapped_column('child_set_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))


class NodeVersion(SQLModel, table=True):
    __tablename__ = 'NodeVersion'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='NodeVersion_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    version_display_num: str = Field(sa_column=mapped_column('version_display_num', Text, nullable=False))
    version_name: Optional[str] = Field(default=None, sa_column=mapped_column('version_name', Text))
    notes: Optional[str] = Field(default=None, sa_column=mapped_column('notes', Text))
    created_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('created_at', DateTime))
    updated_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('updated_at', DateTime))
    version_seq_num: Optional[int] = Field(default=None, sa_column=mapped_column('version_seq_num', Integer))


class Nodes(SQLModel, table=True):
    __tablename__ = 'Nodes'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='Node_pkey'),
    )

    created_at: datetime = Field(sa_column=mapped_column('created_at', DateTime(True), nullable=False, server_default=text('now()')))
    created_by: UUID = Field(sa_column=mapped_column('created_by', Uuid, nullable=False, server_default=text('auth.uid()')))
    updated_at: datetime = Field(sa_column=mapped_column('updated_at', DateTime, nullable=False, server_default=text('now()')))
    public_set: bool = Field(sa_column=mapped_column('public_set', Boolean, nullable=False, server_default=text('false')))
    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    icon_url: Optional[str] = Field(default=None, sa_column=mapped_column('icon_url', Text))


class PublicNode(SQLModel, table=True):
    __tablename__ = 'PublicNode'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='PublicNode_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    created_at: datetime = Field(sa_column=mapped_column('created_at', DateTime(True), nullable=False, server_default=text('now()')))
    targeted_version: UUID = Field(sa_column=mapped_column('targeted_version', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    description: Optional[str] = Field(default=None, sa_column=mapped_column('description', Text))
    node_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('node_id', Uuid, server_default=text('gen_random_uuid()')))


class SetIdentities(SQLModel, table=True):
    __tablename__ = 'SetIdentities'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='SetIdentity_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    node_id: UUID = Field(sa_column=mapped_column('node_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))


class Sets(SQLModel, table=True):
    __tablename__ = 'Sets'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='CardSets_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    name: str = Field(sa_column=mapped_column('name', Text, nullable=False))
    created_by: UUID = Field(sa_column=mapped_column('created_by', Uuid, nullable=False, server_default=text('auth.uid()')))
    created_at: datetime = Field(sa_column=mapped_column('created_at', DateTime, nullable=False, server_default=text('now()')))
    desciption: Optional[str] = Field(default=None, sa_column=mapped_column('desciption', Text))
    prerequisites: Optional[dict] = Field(default=None, sa_column=mapped_column('prerequisites', JSON))
    node_version_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('node_version_id', Uuid, server_default=text('gen_random_uuid()')))


class UserCards(SQLModel, table=True):
    __tablename__ = 'UserCards'
    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'card_identity_id', name='UserCards_pkey'),
    )

    user_id: UUID = Field(sa_column=mapped_column('user_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    card_identity_id: UUID = Field(sa_column=mapped_column('card_identity_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    times_correct: int = Field(sa_column=mapped_column('times_correct', SmallInteger, nullable=False, server_default=text("'0'::smallint")))
    available: datetime = Field(sa_column=mapped_column('available', DateTime, nullable=False, server_default=text('now()')))
    enabled: bool = Field(sa_column=mapped_column('enabled', Boolean, nullable=False, server_default=text('true')))
    last_shown_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('last_shown_at', DateTime, server_default=text('now()')))


class UserNodes(SQLModel, table=True):
    __tablename__ = 'UserNodes'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='UserNodes_pkey'),
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('gen_random_uuid()')))
    user_id: UUID = Field(sa_column=mapped_column('user_id', Uuid, nullable=False, server_default=text('auth.uid()')))
    node_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('node_id', Uuid, server_default=text('gen_random_uuid()')))
    parent_node_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('parent_node_id', Uuid, server_default=text('gen_random_uuid()')))
    node_version_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('node_version_id', Uuid, server_default=text('gen_random_uuid()')))


class UserSets(SQLModel, table=True):
    __tablename__ = 'UserSets'
    __table_args__ = (
        PrimaryKeyConstraint('user_id', 'set_identity_id', name='UserSets_pkey'),
        {'comment': 'Table to describe relationship between users and cardSets.'}
    )

    user_id: UUID = Field(sa_column=mapped_column('user_id', Uuid, nullable=False, server_default=text('auth.uid()')))
    set_identity_id: UUID = Field(sa_column=mapped_column('set_identity_id', Uuid, nullable=False, server_default=text('gen_random_uuid()')))
    enabled: bool = Field(sa_column=mapped_column('enabled', Boolean, nullable=False, server_default=text('false')))


class Users(SQLModel, table=True):
    __table_args__ = (
        CheckConstraint('email_change_confirm_status >= 0 AND email_change_confirm_status <= 2', name='users_email_change_confirm_status_check'),
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('phone', name='users_phone_key'),
        Index('confirmation_token_idx', 'confirmation_token', unique=True),
        Index('email_change_token_current_idx', 'email_change_token_current', unique=True),
        Index('email_change_token_new_idx', 'email_change_token_new', unique=True),
        Index('reauthentication_token_idx', 'reauthentication_token', unique=True),
        Index('recovery_token_idx', 'recovery_token', unique=True),
        Index('users_email_partial_key', 'email', unique=True),
        Index('users_instance_id_email_idx', 'instance_id'),
        Index('users_instance_id_idx', 'instance_id'),
        Index('users_is_anonymous_idx', 'is_anonymous'),
        {'comment': 'Auth: Stores user login data within a secure schema.',
     'schema': 'auth'}
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid))
    is_sso_user: bool = Field(sa_column=mapped_column('is_sso_user', Boolean, nullable=False, server_default=text('false'), comment='Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.'))
    is_anonymous: bool = Field(sa_column=mapped_column('is_anonymous', Boolean, nullable=False, server_default=text('false')))
    instance_id: Optional[UUID] = Field(default=None, sa_column=mapped_column('instance_id', Uuid))
    aud: Optional[str] = Field(default=None, sa_column=mapped_column('aud', String(255)))
    role: Optional[str] = Field(default=None, sa_column=mapped_column('role', String(255)))
    email: Optional[str] = Field(default=None, sa_column=mapped_column('email', String(255)))
    encrypted_password: Optional[str] = Field(default=None, sa_column=mapped_column('encrypted_password', String(255)))
    email_confirmed_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('email_confirmed_at', DateTime(True)))
    invited_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('invited_at', DateTime(True)))
    confirmation_token: Optional[str] = Field(default=None, sa_column=mapped_column('confirmation_token', String(255)))
    confirmation_sent_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('confirmation_sent_at', DateTime(True)))
    recovery_token: Optional[str] = Field(default=None, sa_column=mapped_column('recovery_token', String(255)))
    recovery_sent_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('recovery_sent_at', DateTime(True)))
    email_change_token_new: Optional[str] = Field(default=None, sa_column=mapped_column('email_change_token_new', String(255)))
    email_change: Optional[str] = Field(default=None, sa_column=mapped_column('email_change', String(255)))
    email_change_sent_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('email_change_sent_at', DateTime(True)))
    last_sign_in_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('last_sign_in_at', DateTime(True)))
    raw_app_meta_data: Optional[dict] = Field(default=None, sa_column=mapped_column('raw_app_meta_data', JSONB))
    raw_user_meta_data: Optional[dict] = Field(default=None, sa_column=mapped_column('raw_user_meta_data', JSONB))
    is_super_admin: Optional[bool] = Field(default=None, sa_column=mapped_column('is_super_admin', Boolean))
    created_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('created_at', DateTime(True)))
    updated_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('updated_at', DateTime(True)))
    phone: Optional[str] = Field(default=None, sa_column=mapped_column('phone', Text, server_default=text('NULL::character varying')))
    phone_confirmed_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('phone_confirmed_at', DateTime(True)))
    phone_change: Optional[str] = Field(default=None, sa_column=mapped_column('phone_change', Text, server_default=text("''::character varying")))
    phone_change_token: Optional[str] = Field(default=None, sa_column=mapped_column('phone_change_token', String(255), server_default=text("''::character varying")))
    phone_change_sent_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('phone_change_sent_at', DateTime(True)))
    confirmed_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('confirmed_at', DateTime(True), Computed('LEAST(email_confirmed_at, phone_confirmed_at)', persisted=True)))
    email_change_token_current: Optional[str] = Field(default=None, sa_column=mapped_column('email_change_token_current', String(255), server_default=text("''::character varying")))
    email_change_confirm_status: Optional[int] = Field(default=None, sa_column=mapped_column('email_change_confirm_status', SmallInteger, server_default=text('0')))
    banned_until: Optional[datetime] = Field(default=None, sa_column=mapped_column('banned_until', DateTime(True)))
    reauthentication_token: Optional[str] = Field(default=None, sa_column=mapped_column('reauthentication_token', String(255), server_default=text("''::character varying")))
    reauthentication_sent_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('reauthentication_sent_at', DateTime(True)))
    deleted_at: Optional[datetime] = Field(default=None, sa_column=mapped_column('deleted_at', DateTime(True)))


t_pg_stat_statements = Table(
    'pg_stat_statements', metadata,
    Column('userid', OID),
    Column('dbid', OID),
    Column('toplevel', Boolean),
    Column('queryid', BigInteger),
    Column('query', Text),
    Column('plans', BigInteger),
    Column('total_plan_time', Double(53)),
    Column('min_plan_time', Double(53)),
    Column('max_plan_time', Double(53)),
    Column('mean_plan_time', Double(53)),
    Column('stddev_plan_time', Double(53)),
    Column('calls', BigInteger),
    Column('total_exec_time', Double(53)),
    Column('min_exec_time', Double(53)),
    Column('max_exec_time', Double(53)),
    Column('mean_exec_time', Double(53)),
    Column('stddev_exec_time', Double(53)),
    Column('rows', BigInteger),
    Column('shared_blks_hit', BigInteger),
    Column('shared_blks_read', BigInteger),
    Column('shared_blks_dirtied', BigInteger),
    Column('shared_blks_written', BigInteger),
    Column('local_blks_hit', BigInteger),
    Column('local_blks_read', BigInteger),
    Column('local_blks_dirtied', BigInteger),
    Column('local_blks_written', BigInteger),
    Column('temp_blks_read', BigInteger),
    Column('temp_blks_written', BigInteger),
    Column('blk_read_time', Double(53)),
    Column('blk_write_time', Double(53)),
    Column('temp_blk_read_time', Double(53)),
    Column('temp_blk_write_time', Double(53)),
    Column('wal_records', BigInteger),
    Column('wal_fpi', BigInteger),
    Column('wal_bytes', Numeric),
    Column('jit_functions', BigInteger),
    Column('jit_generation_time', Double(53)),
    Column('jit_inlining_count', BigInteger),
    Column('jit_inlining_time', Double(53)),
    Column('jit_optimization_count', BigInteger),
    Column('jit_optimization_time', Double(53)),
    Column('jit_emission_count', BigInteger),
    Column('jit_emission_time', Double(53))
)


t_pg_stat_statements_info = Table(
    'pg_stat_statements_info', metadata,
    Column('dealloc', BigInteger),
    Column('stats_reset', DateTime(True))
)


class DekuUsers(Users, table=True):
    __tablename__ = 'DekuUsers'
    __table_args__ = (
        ForeignKeyConstraint(['id'], ['auth.users.id'], ondelete='CASCADE', name='Users_id_fkey'),
        PrimaryKeyConstraint('id', name='Users_pkey')
    )

    id: UUID = Field(sa_column=mapped_column('id', Uuid, server_default=text('auth.uid()')))
    dark_mode: Optional[bool] = Field(default=None, sa_column=mapped_column('dark_mode', Boolean))
