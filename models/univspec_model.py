# models/univspec_model.py

from models import db

UnivSpec = db.Table(
    'univspec',
    db.Column('university_id', db.Integer, db.ForeignKey('universities.id_university'), primary_key=True),
    db.Column('speciality_id', db.Integer, db.ForeignKey('specialities.id_speciality'), primary_key=True)
)
