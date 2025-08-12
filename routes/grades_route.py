from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.grades_model import Grade
from models.user_model import User
from app import db
grades_bp = Blueprint("grades", __name__, url_prefix="/grades")

@grades_bp.route("/grades", methods=["POST"])
@jwt_required()
def add_grades():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    grades_data = data.get("grades")
    if not grades_data or not isinstance(grades_data, list):
        return jsonify({"error": "Format des notes invalide"}), 400

    for grade in grades_data:
        level = grade.get("level")
        average = grade.get("average")

        if not level or not isinstance(average, (int, float)):
            return jsonify({"error": f"Données invalides pour {grade}"}), 400

        # Vérifier si la moyenne existe déjà
        existing = Grade.query.filter_by(user_id=current_user_id, level=level).first()
        if existing:
            existing.average = average  # mise à jour
        else:
            new_grade = Grade(user_id=current_user_id, level=level, average=average)
            db.session.add(new_grade)

    db.session.commit()
    return jsonify({"message": "Notes enregistrées avec succès"}), 201


@grades_bp.route("/grades", methods=["GET"])
@jwt_required()
def get_user_grades():
    current_user_id = get_jwt_identity()

    grades = Grade.query.filter_by(user_id=current_user_id).all()

    result = [
        {"level": grade.level, "average": grade.average}
        for grade in grades
    ]

    return jsonify(result), 200
