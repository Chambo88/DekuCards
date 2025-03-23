"""Adding Fk's back

Revision ID: 8944c8bf9b18
Revises: 85c1bcc4df41
Create Date: 2025-03-22 18:08:42.247399

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '8944c8bf9b18'
down_revision: Union[str, None] = '85c1bcc4df41'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # For DekuSet (table "set")
    op.create_foreign_key(
        'fk_set_set_identity_id',  # constraint name
        source_table='set',
        referent_table='set_identity',
        local_cols=['set_identity_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_set_parent_set_id',
        source_table='set',
        referent_table='set',
        local_cols=['parent_set_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_set_node_version_id',
        source_table='set',
        referent_table='node_version',
        local_cols=['node_version_id'],
        remote_cols=['id']
    )

    # For Card (table "card")
    op.create_foreign_key(
        'fk_card_card_identity',
        source_table='card',
        referent_table='card_identity',
        local_cols=['card_identity'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_card_node_version_id',
        source_table='card',
        referent_table='node_version',
        local_cols=['node_version_id'],
        remote_cols=['id']
    )

    # For CardIdentity (table "card_identity")
    op.create_foreign_key(
        'fk_card_identity_set_id',
        source_table='card_identity',
        referent_table='set',
        local_cols=['set_id'],
        remote_cols=['id']
    )

    # For Node (table "node")
    op.create_foreign_key(
        'fk_node_created_by',
        source_table='node',
        referent_table='deku_user',
        local_cols=['created_by'],
        remote_cols=['id']
    )

    # For PublicNode (table "public_node")
    op.create_foreign_key(
        'fk_public_node_current_version',
        source_table='public_node',
        referent_table='node_version',
        local_cols=['current_version'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_public_node_node_id',
        source_table='public_node',
        referent_table='node',
        local_cols=['node_id'],
        remote_cols=['id']
    )

    # For SetIdentity (table "set_identity")
    op.create_foreign_key(
        'fk_set_identity_node_id',
        source_table='set_identity',
        referent_table='node',
        local_cols=['node_id'],
        remote_cols=['id']
    )

    # For UserNode (table "user_node")
    op.create_foreign_key(
        'fk_user_node_user_id',
        source_table='user_node',
        referent_table='deku_user',
        local_cols=['user_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_user_node_node_id',
        source_table='user_node',
        referent_table='node',
        local_cols=['node_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_user_node_parent_node_id',
        source_table='user_node',
        referent_table='node',
        local_cols=['parent_node_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_user_node_node_version_id',
        source_table='user_node',
        referent_table='node_version',
        local_cols=['node_version_id'],
        remote_cols=['id']
    )

    # For UserSet (table "user_set")
    op.create_foreign_key(
        'fk_user_set_user_id',
        source_table='user_set',
        referent_table='deku_user',
        local_cols=['user_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_user_set_set_identity_id',
        source_table='user_set',
        referent_table='set',
        local_cols=['set_identity_id'],
        remote_cols=['id']
    )
    op.create_foreign_key(
        'fk_user_set_user_node_id',
        source_table='user_set',
        referent_table='user_node',
        local_cols=['user_node_id'],
        remote_cols=['id']
    )

def downgrade():
    # Drop constraints in reverse order
    op.drop_constraint('fk_user_set_user_node_id', 'user_set', type_='foreignkey')
    op.drop_constraint('fk_user_set_set_identity_id', 'user_set', type_='foreignkey')
    op.drop_constraint('fk_user_set_user_id', 'user_set', type_='foreignkey')

    op.drop_constraint('fk_user_node_node_version_id', 'user_node', type_='foreignkey')
    op.drop_constraint('fk_user_node_parent_node_id', 'user_node', type_='foreignkey')
    op.drop_constraint('fk_user_node_node_id', 'user_node', type_='foreignkey')
    op.drop_constraint('fk_user_node_user_id', 'user_node', type_='foreignkey')

    op.drop_constraint('fk_set_identity_node_id', 'set_identity', type_='foreignkey')

    op.drop_constraint('fk_public_node_node_id', 'public_node', type_='foreignkey')
    op.drop_constraint('fk_public_node_current_version', 'public_node', type_='foreignkey')

    op.drop_constraint('fk_node_created_by', 'node', type_='foreignkey')

    op.drop_constraint('fk_card_identity_set_id', 'card_identity', type_='foreignkey')

    op.drop_constraint('fk_card_node_version_id', 'card', type_='foreignkey')
    op.drop_constraint('fk_card_card_identity', 'card', type_='foreignkey')

    op.drop_constraint('fk_set_node_version_id', 'set', type_='foreignkey')
    op.drop_constraint('fk_set_parent_set_id', 'set', type_='foreignkey')
    op.drop_constraint('fk_set_set_identity_id', 'set', type_='foreignkey')