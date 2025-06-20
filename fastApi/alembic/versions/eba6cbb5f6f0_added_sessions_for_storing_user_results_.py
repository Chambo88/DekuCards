"""Added sessions for storing user results data

Revision ID: eba6cbb5f6f0
Revises: 746cc0368842
Create Date: 2025-06-07 14:20:05.591941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'eba6cbb5f6f0'
down_revision: Union[str, None] = '746cc0368842'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_sessions',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('wrong_count', sa.Integer(), nullable=False),
    sa.Column('correct_count', sa.Integer(), nullable=False),
    sa.Column('date_modified', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['deku_user.id'], name='fk_user_sessions_user_id', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='user_sessions_pkey')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_sessions')
    # ### end Alembic commands ###
