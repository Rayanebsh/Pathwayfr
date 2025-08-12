from models import db
from sqlalchemy import CheckConstraint
from sqlalchemy.sql import func

class Service(db.Model):
    __tablename__ = 'services'

    id_service = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id_user', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    free = db.Column(db.Boolean, default=False)
    premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("NOT (free = true AND premium = true)", name="check_not_both_free_and_premium"),
    )
