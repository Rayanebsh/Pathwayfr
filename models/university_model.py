from models import db
from sqlalchemy.sql import func
from models.university_users_model import university_users
from models.experience_university_model import experience_university




class University(db.Model):
    __tablename__ = 'universities'

    id_university = db.Column(db.Integer, primary_key=True, autoincrement=True)
    univ_name = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    specialities_nbr = db.Column(db.Integer, nullable=False, default=0)
    nbr_candidates_accepted = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.TIMESTAMP, server_default=func.now())

    users = db.relationship('User', secondary=university_users, back_populates='universities')

    # Relation vers Speciality, définie par son nom (importé plus bas)
    from models.univspec_model import UnivSpec
    specialities = db.relationship('Speciality',secondary=UnivSpec,back_populates='universities')
    experiences = db.relationship(
        'Experience',
        secondary=experience_university,
        back_populates='universities'
    )
    __table_args__ = (
        db.CheckConstraint("specialities_nbr >= 0"),
        db.CheckConstraint("nbr_candidates_accepted >= 0"),
    )
    
    def to_dict(self):
        return {
        'id_university': self.id_university,
        'univ_name': self.univ_name,
        'city': self.city,
        'specialities_nbr': self.specialities_nbr,
        'nbr_candidates_accepted': self.nbr_candidates_accepted,
        'created_at': self.created_at.isoformat() if self.created_at else None
        }

# ✅ Import déplacé en bas pour éviter l'import circulaire
from models.speciality_model import Speciality

