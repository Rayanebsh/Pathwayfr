import datetime
from models import db
from sqlalchemy.sql import func
from models.university_users_model import university_users

class User(db.Model):
    __tablename__ = 'users'

    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    accepted = db.Column(db.Boolean, default=False)
    experience = db.Column(db.Boolean, default=False)
    role = db.Column(db.String, nullable=False, default='user')
    nbr_experience = db.Column(db.Integer, default=0)
    bac_average = db.Column(db.Float, default=0.0)
    bac_type = db.Column(db.String, default='unknown')
    tcf_score = db.Column(db.Integer, default=0)
    localisation = db.Column(db.String)
    date_of_birth = db.Column(db.Date)
    a_propos = db.Column(db.Text)
    univ_actuel = db.Column(db.String)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(128), nullable=True, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    speciality = db.Column(db.String)
    annee_etude_actuelle = db.Column(db.String)
    subscription = db.Column(db.Boolean, default=False)
    isbanned = db.Column(db.Boolean, default=False)

    __table_args__ = (
        db.CheckConstraint("role IN ('user', 'admin')"),
        db.CheckConstraint("bac_average >= 0 AND bac_average <= 20"),
        db.CheckConstraint("tcf_score >= 0 AND tcf_score <= 699"),
    )

    # Relation vers University définie par son nom (importé plus bas)
    universities = db.relationship('University', secondary=university_users, back_populates='users')

    def to_dict(self):
        return {
            "id_user": self.id_user,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "accepted": self.accepted,
            "experience": self.experience,
            "role": self.role,
            "nbr_experience": self.nbr_experience,
            "bac_average": self.bac_average,
            "bac_type": self.bac_type,
            "tcf_score": self.tcf_score,
            "localisation": self.localisation,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "a_propos": self.a_propos,
            "univ_actuel": self.univ_actuel,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "annee_etude_actuelle": self.annee_etude_actuelle,
            "speciality": self.speciality,
            "is_verified": self.is_verified,
            "subscription": self.subscription,
            "isbanned": self.isbanned
        }

# ✅ Import placé ici pour éviter les imports circulaires
from models.university_model import University
