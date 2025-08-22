from models import db
from sqlalchemy import CheckConstraint, ARRAY
from models.experience_university_model import experience_university
from sqlalchemy.dialects.postgresql import JSONB




class Experience(db.Model):
    __tablename__ = 'experiences'

    id_experience = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id_user', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=True
    )
    bac_type = db.Column(db.String, nullable=True)
    bac_average = db.Column(db.Float, nullable=True)
    comment = db.Column(db.Text)
    application_year = db.Column(db.Integer, nullable=False)
    study_year_at_application_time = db.Column(db.String, nullable=False)
    average_each_year = db.Column(JSONB, nullable=True)  # Utilisation de JSONB pour stocker les moyennes par année
    level_tcf = db.Column(db.Integer, nullable=False)
    candidature_year = db.Column(db.Integer, nullable=False)
    speciality_id = db.Column(
        db.Integer,
        db.ForeignKey('specialities.id_speciality', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    university_accepted_in = db.Column(ARRAY(db.Integer), nullable=True)  # Universités acceptées
    university_rejected_in = db.Column(ARRAY(db.Integer), nullable=True)

    user = db.relationship('User', backref='experiences')
    speciality = db.relationship('Speciality', backref='experiences', lazy=True)
    universities = db.relationship(
        'University',
        secondary=experience_university,
        back_populates='experiences'  # ce nom doit aussi exister côté University
    )

    is_validated = db.Column(
    db.Enum("pending", "approved", "rejected", name="experience_status"),
    default="pending",
    nullable=False
    )




    __table_args__ = (
        CheckConstraint("bac_average BETWEEN 0 AND 20", name="check_bac_average_range"),
        CheckConstraint("level_tcf BETWEEN 0 AND 699", name="check_tcf_level_range"),
    )
    def to_dict(self):
        return {
            "id_experience": self.id_experience,
            "user_id": self.user_id,
            "bac_type": self.bac_type,
            "bac_average": self.bac_average,
            "comment": self.comment,
            "application_year": self.application_year,
            "study_year_at_application_time": self.study_year_at_application_time,
            "average_each_year": self.average_each_year,
            "level_tcf": self.level_tcf,
            "candidature_year": self.candidature_year,
            "speciality_id": self.speciality_id,
            "is_validated": self.is_validated,
            "speciality": self.speciality.to_dict() if self.speciality else None,
            "user": self.user.to_dict() if self.user else None,
            "universities": [university.to_dict() for university in self.universities]
        }
