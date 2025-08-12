from models import db
from sqlalchemy import CheckConstraint
from sqlalchemy.sql import func

class Speciality(db.Model):
    __tablename__ = 'specialities'

    id_speciality = db.Column(db.Integer, primary_key=True, autoincrement=True)
    speciality_name = db.Column(db.String, nullable=False)
    university_id = db.Column(
        db.Integer,
        db.ForeignKey('universities.id_university', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=True
    )
    nbr_candidate_accepted_in = db.Column(db.Integer, nullable=False, default=0)
    min_bac_average = db.Column(db.Float, nullable=True, default=10)
    min_tcf_score = db.Column(db.Integer, nullable=False, default=300)
    min_average = db.Column(db.Float, nullable=False, default=10)
    created_at = db.Column(db.TIMESTAMP, server_default=func.now())

    # La relation vers University
    from models.univspec_model import UnivSpec
    universities = db.relationship('University',secondary=UnivSpec,back_populates='specialities')


    __table_args__ = (
        CheckConstraint("nbr_candidate_accepted_in >= 0"),
        CheckConstraint("min_tcf_score BETWEEN 300 AND 699"),
        CheckConstraint("min_average BETWEEN 10 AND 20"),
    )
    def to_dict(self):
        return {
            "id_speciality": self.id_speciality,
            "speciality_name": self.speciality_name,
            "university_id": self.university_id,
            "nbr_candidate_accepted_in": self.nbr_candidate_accepted_in,
            "min_bac_average": self.min_bac_average,
            "min_tcf_score": self.min_tcf_score,
            "min_average": self.min_average,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ✅ Import déplacé à la fin du fichier pour éviter l'importation circulaire
from models.university_model import University

