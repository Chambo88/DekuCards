"""Changing date naming schema to ensure identifiable difference between strings and strings that need to be converted to dates. ADded new field for streak start date

Revision ID: 8ba2c8eb043b
Revises: a57be74fc268
Create Date: 2025-04-13 14:28:19.027983

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8ba2c8eb043b'
down_revision: Union[str, None] = 'a57be74fc268'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_card', sa.Column('available_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False))
    op.add_column('user_card', sa.Column('last_shown_at_date', sa.DateTime(), nullable=True))
    op.add_column('user_card', sa.Column('streak_start_date', sa.DateTime(), nullable=True))
    op.drop_column('user_card', 'last_shown_at')
    op.drop_column('user_card', 'available')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_card', sa.Column('available', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False))
    op.add_column('user_card', sa.Column('last_shown_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('user_card', 'streak_start_date')
    op.drop_column('user_card', 'last_shown_at_date')
    op.drop_column('user_card', 'available_date')
    # ### end Alembic commands ###
