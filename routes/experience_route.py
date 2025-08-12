from flask import Blueprint, request, jsonify
from app import db

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

experience_bp = Blueprint("experience", __name__, url_prefix="/experience")

@experience_bp.route("/share", methods=["POST"])
def create_experience():
    from models.experiences_model import Experience
    from models.speciality_model import Speciality
    from models.university_model import University

    data = request.get_json()
    if not data:
        return jsonify({"error": "Aucune donnée reçue"}), 400

    # Champs requis
    required_fields = [
        "speciality_id", "university_ids", "candidature_year",
        "comment", "is_validated", "average_each_year_list",
        "study_year_at_application_time", "application_year", "level_tcf"
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Le champ '{field}' est requis"}), 400

    try:
        # Vérification de la spécialité
        speciality = Speciality.query.get(data["speciality_id"])
        if not speciality:
            return jsonify({"error": "Spécialité introuvable"}), 404

        # Vérification des universités
        university_ids = data.get("university_ids", [])
        if not isinstance(university_ids, list) or not university_ids:
            return jsonify({"error": "'university_ids' doit être une liste non vide"}), 400

        universities = University.query.filter(University.id_university.in_(university_ids)).all()
        if len(universities) != len(university_ids):
            return jsonify({"error": "Une ou plusieurs universités sont introuvables"}), 404

        # Traitement de average_each_year_list
        avg_list = data["average_each_year"]
        if not isinstance(avg_list, dict):
            import json
            try:
                avg_list = json.loads(avg_list)
            except Exception:
                return jsonify({"error": "Format de 'average_each_year_list' invalide"}), 400
        elif not isinstance(avg_list, list):
            return jsonify({"error": "'average_each_year_list' doit être une liste ou une chaîne JSON"}), 400

        # Champs optionnels
        bac_average = data.get("bac_average")
        if bac_average != "" and bac_average is not None:
            try:
                bac_average = float(bac_average)
            except ValueError:
                return jsonify({"error": "'bac_average' doit être un nombre"}), 400
        else:
            bac_average = None

        bac_type = data.get("bac_type", None)

        # Champs requis supplémentaires
        study_year = data["study_year_at_application_time"]
        application_year = data["application_year"]
        level_tcf = data["level_tcf"]

        # Création de l'expérience
        new_exp = Experience(
            speciality_id=data["speciality_id"],
            candidature_year=data["candidature_year"],
            application_year=application_year,
            average_each_year=avg_list,
            comment=data["comment"],
            is_validated=bool(data["is_validated"]),
            bac_type=bac_type,
            bac_average=bac_average,
            study_year_at_application_time=study_year,
            level_tcf=level_tcf,
            universities=universities  # ✅ relation many-to-many
        )

        db.session.add(new_exp)
        db.session.commit()

        return jsonify({
            "message": "Expérience créée avec succès",
            "experience_id": new_exp.id_experience
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
