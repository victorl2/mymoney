"""add_expense_payment_fields

Revision ID: e4807eccbcc6
Revises: cc6675e7577b
Create Date: 2026-02-05 14:56:10.399325

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4807eccbcc6'
down_revision: Union[str, None] = 'cc6675e7577b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('expenses', sa.Column('is_paid', sa.Boolean(), nullable=False, server_default='0'))
    op.add_column('expenses', sa.Column('paid_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('expenses', 'paid_at')
    op.drop_column('expenses', 'is_paid')
