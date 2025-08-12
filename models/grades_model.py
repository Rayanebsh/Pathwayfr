from models import db
from sqlalchemy import CheckConstraint, UniqueConstraint

class Grade(db.Model):
    __tablename__ = 'grades'

    id_grades = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id_user', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    average = db.Column(db.Float, nullable=False)
    level = db.Column(db.String, nullable=False)
    __table_args__ = (
        CheckConstraint('average >= 0 AND average <= 20', name='check_average_range'),
        UniqueConstraint('user_id', 'level', name='uq_user_level'),
    )
