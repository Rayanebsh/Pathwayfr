from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.speciality_model import Speciality
from models.user_model import User
from app import db

specialities_bp = Blueprint("specialities", __name__, url_prefix="/specialities")

#get speciality_id by name
@specialities_bp.route("/<string:speciality_name>", methods=["GET"])
def get_speciality_by_name(speciality_name):
    speciality = Speciality.query.filter_by(name=speciality_name).first()
    if not speciality:
        return jsonify({"error": "Spécialité non trouvée"}), 404
    return jsonify(speciality.to_dict()), 200

#get all specialities
@specialities_bp.route("/", methods=["GET"])    
def get_all_specialities():
    specialities = Speciality.query.all()
    return jsonify([s.to_dict() for s in specialities]), 200
