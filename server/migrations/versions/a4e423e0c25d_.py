"""empty message

Revision ID: a4e423e0c25d
Revises: 63cbba031139
Create Date: 2021-02-03 12:33:35.646626

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a4e423e0c25d'
down_revision = '63cbba031139'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('contest', sa.Column('winner', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'contest', 'submission', ['winner'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('contest', 'winner')
    # ### end Alembic commands ###