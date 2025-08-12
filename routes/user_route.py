from flask import Blueprint, request, jsonify
from models.user_model import User
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
@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


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

