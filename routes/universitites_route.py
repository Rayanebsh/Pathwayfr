from flask import Blueprint, request, jsonify
from models.university_model import University
from models.user_model import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

universities_bp = Blueprint("universities", __name__, url_prefix="/universities")


# get all universities
@universities_bp.route("/", methods=["GET"])
def get_universities():
    universities = University.query.all()
    return jsonify([u.to_dict() for u in universities]), 200

# get university by id
@universities_bp.route("/<int:university_id>", methods=["GET"])
def get_university(university_id):
    university = University.query.get_or_404(university_id)
    return jsonify(university.to_dict()), 200

# update university
@universities_bp.route("/<int:university_id>", methods=["PUT"])
@jwt_required()
def update_university(university_id):
    current_user_id = get_jwt_identity()    
    user = User.query.get(current_user_id)
    if not user or user.role.strip().lower() != "admin":
        return jsonify({"error": "Accès non autorisé"}), 403
    university = University.query.get_or_404(university_id)
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Données invalides"}), 400
    for key, value in data.items():
        setattr(university, key, value)
    db.session.commit()
    return jsonify({"message": "Université mise à jour avec succès", "university": university.to_dict()}), 200

# delete university
@universities_bp.route("/<int:university_id>", methods=["DELETE"])
@jwt_required()
def delete_university(university_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or user.role.strip().lower() != "admin":
        return jsonify({"error": "Accès non autorisé"}), 403
    university = University.query.get_or_404(university_id)
    db.session.delete(university)
    db.session.commit()
    return jsonify({"message": "Université supprimée avec succès"}), 200

# get universities by city
@universities_bp.route("/city/<string:city_name>", methods=["GET"])
def get_universities_by_city(city_name):
    universities = University.query.filter_by(city=city_name).all()
    if not universities:
        return jsonify({"error": "Aucune université trouvée dans cette ville"}), 404
    return jsonify([u.to_dict() for u in universities]), 200

#get univ        
@universities_bp.route("/<string:university_name>", methods=["GET"])
def get_university_by_name(university_name):
    university = University.query.filter_by(name=university_name).first()
    if not university:
        return jsonify({"error": "Université non trouvée"}), 404
    return jsonify(university.to_dict()), 200

# get universities by name and city
@universities_bp.route("/search", methods=["GET"])
def search_universities():
    name = request.args.get("name")
    city = request.args.get("city")
    query = University.query
    if name:
        query = query.filter(University.name.ilike(f"%{name}%"))
    if city:
        query = query.filter(University.city.ilike(f"%{city}%"))
    universities = query.all()
    if not universities:
        return jsonify({"error": "Aucune université trouvée"}), 404
    return jsonify([u.to_dict() for u in universities]), 200

# get universities by ids
@universities_bp.route("/ids", methods=["POST"])        
def get_universities_by_ids():
    data = request.get_json()
    if not data or not isinstance(data, list):
        return jsonify({"error": "Format des données invalide"}), 400
    universities = University.query.filter(University.id.in_(data)).all()
    if not universities:
        return jsonify({"error": "Aucune université trouvée pour ces IDs"}), 404
    
    return jsonify([u.to_dict() for u in universities]), 200
# get universities by ids with pagination
@universities_bp.route("/ids/paginate", methods=["POST"])
def get_universities_by_ids_paginate():
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Format des données invalide"}), 400
    ids = data.get("ids")
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)
    if not ids or not isinstance(ids, list):
        return jsonify({"error": "IDs requis sous forme de liste"}), 400
    universities = University.query.filter(University.id.in_(ids)).paginate(page, per_page, error_out=False)
    if not universities.items:
        return jsonify({"error": "Aucune université trouvée pour ces IDs"}), 404
    return jsonify({
        "items": [u.to_dict() for u in universities.items],
        "total": universities.total,
        "page": universities.page,
        "pages": universities.pages
    }), 200
# get universities by ids with pagination and sorting
@universities_bp.route("/ids/sort", methods=["POST"])
def get_universities_by_ids_sort():
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Format des données invalide"}), 400
    ids = data.get("ids")
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)
    sort_by = data.get("sort_by", "name")
    sort_order = data.get("sort_order", "asc")
    if not ids or not isinstance(ids, list):
        return jsonify({"error": "IDs requis sous forme de liste"}), 400
    if sort_order not in ["asc", "desc"]:
        return jsonify({"error": "sort_order doit être 'asc' ou 'desc'"}), 400
    query = University.query.filter(University.id.in_(ids))
    if sort_order == "asc":
        query = query.order_by(getattr(University, sort_by).asc())
    else:
        query = query.order_by(getattr(University, sort_by).desc())
    universities = query.paginate(page, per_page, error_out=False)  
    if not universities.items:
        return jsonify({"error": "Aucune université trouvée pour ces IDs"}), 404
    return jsonify({
        "items": [u.to_dict() for u in universities.items],
        "total": universities.total,
        "page": universities.page,
        "pages": universities.pages
    }), 200

# get universities by ids with pagination, sorting and filtering
@universities_bp.route("/ids/filter", methods=["POST"])
def get_universities_by_ids_filter():
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Format des données invalide"}), 400
    ids = data.get("ids")
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)
    sort_by = data.get("sort_by", "name")
    sort_order = data.get("sort_order", "asc")
    filters = data.get("filters", {})
    if not ids or not isinstance(ids, list):
        return jsonify({"error": "IDs requis sous forme de liste"}), 400
    if sort_order not in ["asc", "desc"]:
        return jsonify({"error": "sort_order doit être 'asc' ou 'desc'"}), 400
    query = University.query.filter(University.id.in_(ids))
    if filters:
        for key, value in filters.items():
            if hasattr(University, key):
                query = query.filter(getattr(University, key).ilike(f"%{value}%"))
    if sort_order == "asc":
        query = query.order_by(getattr(University, sort_by).asc())
    else:   
        query = query.order_by(getattr(University, sort_by).desc())
    universities = query.paginate(page, per_page, error_out=False)
    if not universities.items:
        return jsonify({"error": "Aucune université trouvée pour ces IDs"}), 404
    return jsonify({
        "items": [u.to_dict() for u in universities.items],
        "total": universities.total,
        "page": universities.page,
        "pages": universities.pages
    }), 200

# get universities by ids with pagination, sorting, filtering and search
@universities_bp.route("/ids/search", methods=["POST"])
def get_universities_by_ids_search():
    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Format des données invalide"}), 400
    ids = data.get("ids")
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)
    sort_by = data.get("sort_by", "name")
    sort_order = data.get("sort_order", "asc")
    search = data.get("search", "")
    filters = data.get("filters", {})
    if not ids or not isinstance(ids, list):
        return jsonify({"error": "IDs requis sous forme de liste"}), 400
    if sort_order not in ["asc", "desc"]:
        return jsonify({"error": "sort_order doit être 'asc' ou 'desc'"}), 400
    query = University.query.filter(University.id.in_(ids))
    if search:
        query = query.filter(University.name.ilike(f"%{search}%") | University.city.ilike(f"%{search}%"))
    if filters:
        for key, value in filters.items():
            if hasattr(University, key):
                query = query.filter(getattr(University, key).ilike(f"%{value}%"))
    if sort_order == "asc":
        query = query.order_by(getattr(University, sort_by).asc())
    else:
        query = query.order_by(getattr(University, sort_by).desc())
    universities = query.paginate(page, per_page, error_out=False)
    if not universities.items:
        return jsonify({"error": "Aucune université trouvée pour ces IDs"}), 404
    return jsonify({
        "items": [u.to_dict() for u in universities.items],
        "total": universities.total,
        "page": universities.page,
        "pages": universities.pages
    }), 200
    db.session.commit()
    return jsonify({"message": "Expérience partagée avec succès"}), 201



