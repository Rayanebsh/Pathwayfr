from flask import Blueprint, request, jsonify
from models.user_model import User
from models.service_model import Service
from app import db
import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


users_bp = Blueprint("users", __name__, url_prefix="/users")
 
# GET all users
@users_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

# GET user by ID
# GET current user profile
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    return jsonify(user.to_dict()), 200



# PUT update user
@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict())


@users_bp.route("/profile/setup", methods=["GET", "POST"])
@jwt_required()
def profile_setup():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    data_required = ["accepted", "bac_type", "tcf_score", "bac_average", "speciality", "annee_etude_actuelle"]

    if request.method == "GET":
        missing_fields = [field for field in data_required if getattr(user, field) in (None, '', False)]
        if not missing_fields:
            return jsonify({"message": "Profil déjà complété"}), 200
        return jsonify({"message": "Profil incomplet", "missing": missing_fields}), 200

    if request.method == "POST":
        data = request.get_json()
        if not data:
            return jsonify({"error": "Aucune donnée reçue"}), 400

        # Vérifie que tous les champs sont présents
        missing_fields = [field for field in data_required if field not in data]
        if missing_fields:
            return jsonify({"error": f"Les champs suivants sont requis: {missing_fields}"}), 400

        # Vérifie que bac_type est une valeur valide
        BAC_TYPES_VALIDES = {
            "sciences_experimentales",
            "mathematiques",
            "technique_mathematique",
            "gestion_et_economie",
            "lettres_et_philosophie",
            "langues_etrangeres",
            "autre",
            "unknown"
        }

        if data["bac_type"] not in BAC_TYPES_VALIDES:
            return jsonify({
                "error": f"Valeur invalide pour bac_type : '{data['bac_type']}'.",
                "valeurs_acceptées": list(BAC_TYPES_VALIDES)
            }), 400

        # Mise à jour des champs
        for key, value in data.items():
            setattr(user, key, value)

        db.session.commit()
        return jsonify(user.to_dict())


# Profil Académique
@users_bp.route("/profile/academic", methods=["GET"])
@jwt_required()
def get_academic_profile():
    get_current_user = get_jwt_identity()
    user = User.query.get_or_404(get_current_user) 
    academic_fields = {
        "bac_type",
        "tcf_score",
        "bac_average",
        "speciality",
        "annee_etude_actuelle",
        "accepted",
        "subscription"
    }
    academic_data = {field: getattr(user, field) for field in academic_fields}
    return jsonify(academic_data), 200

# profile académique - mise à jour
@users_bp.route("/profile/academic", methods=["PUT"])
@jwt_required()
def update_academic_profile():
    get_current_user = get_jwt_identity()
    user = User.query.get_or_404(get_current_user)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Aucune donnée reçue"}), 400

    academic_fields = {
        "bac_type",
        "tcf_score",
        "bac_average",
        "speciality",
        "annee_etude_actuelle",
        "accepted"
    }

    for key, value in data.items():
        if key in academic_fields:
            setattr(user, key, value)

    db.session.commit()
    return jsonify(user.to_dict()), 200


# Dans votre backend (Flask/FastAPI), ajoutez cette route

@users_bp.route('/profile/status', methods=['GET'])
@jwt_required()
def get_profile_status():
    try:
        current_user_id = get_jwt_identity()
        user_profile = db.session.query(User).filter_by(id_user=current_user_id).first()

        if not user_profile:
            return jsonify({
                "is_complete": False,
                "missing_fields": ["annee_etude_actuelle"],
                "message": "Aucun profil trouvé"
            }), 200
        
        # Vérifier les champs obligatoires
        missing_fields = []
        
        # Vérifier le niveau d'études (ne doit pas être NULL ou vide)
        if not user_profile.annee_etude_actuelle or str(user_profile.annee_etude_actuelle).strip() == '':
            missing_fields.append("annee_etude_actuelle")
        
        is_complete = len(missing_fields) == 0
        
        return jsonify({
            "is_complete": is_complete,
            "missing_fields": missing_fields,
            "profile_data": user_profile.to_dict() if is_complete else None
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
