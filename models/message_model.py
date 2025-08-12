from models import db
from sqlalchemy import CheckConstraint
from sqlalchemy.sql import func

class Message(db.Model):
    __tablename__ = 'messagerie'

    id_message = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id_user', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    receiver_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id_user', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    service_id = db.Column(
        db.Integer,
        db.ForeignKey('services.id_service', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    message = db.Column(db.Text, nullable=False)
    media = db.Column(db.String)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    media_type = db.Column(db.String)
    created_at = db.Column(db.TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("sender_id != receiver_id", name="check_sender_not_receiver"),
    )
