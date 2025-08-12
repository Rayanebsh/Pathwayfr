from models import db

experience_university = db.Table(
    "experience_university",
    db.Column("experience_id", db.Integer, db.ForeignKey("experiences.id_experience"), primary_key=True),
    db.Column("university_id", db.Integer, db.ForeignKey("universities.id_university"), primary_key=True)
)
