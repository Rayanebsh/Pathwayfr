from flask import Blueprint,request,jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.experiences_model import Experience
from models.user_model import User
from app import db
from models.university_model import University



admin_bp = Blueprint ("admin",__name__,url_prefix="/admin")

# à tester
@admin_bp.route("/validate_experience/<int:experience_id>", methods=["POST"])
@jwt_required()
def validate_experience(experience_id):
    # Vérifier si l'utilisateur est un admin
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role.strip().lower() != "admin":
        return jsonify({"error": "Accès non autorisé"}), 403

    experience = Experience.query.get(experience_id)

    if not experience:
        return jsonify({"error": "Expérience non trouvée"}), 404

    experience.is_validated = True
    db.session.commit()

    return jsonify({"message": "Expérience validée avec succès."}), 200



# à tester
@admin_bp.route("/<int:id_experience>", methods=["DELETE"])
@jwt_required()
def delete_experience(id_experience):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "Utilisateur connecté introuvable"}), 404

    experience = Experience.query.get_or_404(id_experience)

    # Admin peut supprimer n'importe quelle expérience
    # L'utilisateur normal ne peut supprimer QUE ses propres expériences
    if current_user.role == "admin" or experience.user_id == current_user_id:
        db.session.delete(experience)
        db.session.commit()
        return jsonify({"message": "Expérience supprimée"}), 200
    else:
        return jsonify({"error": "Accès refusé"}), 403
    

# Récupérer les expériences en attente de validation à tester 

@admin_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending_experiences():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403

    experiences = Experience.query.filter_by(is_validated=False).all()

    results = [
        {
            "id_experience": e.id_experience,
            "user_id": e.user_id,
            "candidature_year": e.candidature_year,
            "specialite": e.speciality.specialities_name if e.speciality else None,
            "universite": e.university.name if e.university else None,
        }
        for e in experiences
    ]

    return jsonify(results), 200


@admin_bp.route("/delete/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "Utilisateur connecté introuvable"}), 404

    # Optionnel : ne pas laisser un user se supprimer lui-même
    if current_user_id == user_id:
        return jsonify({"error": "Vous ne pouvez pas vous supprimer vous-même"}), 400

    target_user = User.query.get_or_404(user_id)

    # Par exemple, seuls les admins peuvent supprimer n'importe qui
    if current_user.role == "admin":
        db.session.delete(target_user)
        db.session.commit()
        return jsonify({"message": "Utilisateur supprimé"})
    else:
        return jsonify({"error": "Accès refusé"}), 403



# create one or more universities
@admin_bp.route("/create_univ", methods=["POST"])
@jwt_required()
def create_university():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role.strip().lower() != "admin":
        return jsonify({"error": "Accès non autorisé"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Données invalides"}), 400

    try:
        # Si c’est un seul objet, on le met dans une liste
        if isinstance(data, dict):
            data = [data]

        universities_to_add = []

        for item in data:
            if not isinstance(item, dict):
                return jsonify({"error": "Chaque université doit être un objet JSON"}), 400

            univ_name = item.get("univ_name", "").strip()
            city = item.get("city", "").strip()

            if not univ_name or not city:
                return jsonify({"error": "Chaque université doit contenir les champs 'univ_name' et 'city'"}), 400

            university = University(
                univ_name=univ_name,
                city=city
            )
            universities_to_add.append(university)

        db.session.add_all(universities_to_add)
        db.session.commit()

        return jsonify({
            "message": f"{len(universities_to_add)} université(s) créée(s) avec succès",
            "universities": [
                {
                    "id": u.id_university,
                    "univ_name": u.univ_name
                } for u in universities_to_add
            ]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



# create one or more specialities
@admin_bp.route("/specialities", methods=["POST"])
@jwt_required()
def create_specialities():
    from models.speciality_model import Speciality
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role.strip().lower() != "admin":
        return jsonify({"error": "Accès non autorisé"}), 403

    data = request.get_json()

    if not data:
        return jsonify({"error": "Aucune donnée reçue"}), 400

    try:
        # Si l'utilisateur envoie une seule spécialité (objet JSON)
        if isinstance(data, dict):
            data = [data]  # on l'encapsule dans une liste

        # Vérifier chaque objet
        specialities_to_add = []
        for item in data:
            if "speciality_name" not in item:
                return jsonify({"error": "Chaque spécialité doit contenir le champ 'speciality_name'"}), 400

            speciality = Speciality(
                speciality_name=item["speciality_name"],
                university_id=item.get("university_id"),
                nbr_candidate_accepted_in=item.get("nbr_candidate_accepted_in", 0),
                min_bac_average=item.get("min_bac_average", 10),
                min_tcf_score=item.get("min_tcf_score", 300),
                min_average=item.get("min_average", 10),
            )
            specialities_to_add.append(speciality)

        db.session.add_all(specialities_to_add)
        db.session.commit()

        return jsonify({
            "message": f"{len(specialities_to_add)} spécialité(s) créée(s) avec succès",
            "specialities": [
                {
                    "id": s.id_speciality,
                    "speciality_name": s.speciality_name
                } for s in specialities_to_add
            ]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




