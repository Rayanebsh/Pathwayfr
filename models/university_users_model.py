from models import db
from sqlalchemy.sql import func
university_users = db.Table(
    'university_users',
    db.Column('university_id', db.Integer, db.ForeignKey('universities.id_university'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id_user'), primary_key=True)
)
