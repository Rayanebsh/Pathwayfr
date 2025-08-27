from flask import Blueprint,request,jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity
from models.experiences_model import Experience
from models.user_model import User
from app import db
from models.university_model import University
from sqlalchemy import func




admin_bp = Blueprint ("admin",__name__,url_prefix="/admin")


    

# Récupérer les expériences en attente de validation à tester 

@admin_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending_experiences():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Accès non autorisé"}), 403

    experiences = Experience.query.filter_by(is_validated="pending").all()

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


@admin_bp.route("/<int:id_experience>", methods=["DELETE"])
@jwt_required()
def delete_experience(id_experience):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"success": False, "error": "Utilisateur connecté introuvable"}), 404

    experience = Experience.query.get_or_404(id_experience)

    if current_user.role == "admin" or experience.user_id == current_user_id:
        try:
            db.session.delete(experience)
            db.session.commit()
            return jsonify({"success": True, "message": "Expérience supprimée"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": f"Erreur lors de la suppression : {str(e)}"}), 500
    else:
        return jsonify({"success": False, "error": "Accès refusé"}), 403



@admin_bp.route("/delete/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"success": False, "error": "Utilisateur connecté introuvable"}), 404

    # Empêcher qu’un utilisateur se supprime lui-même
    if current_user_id == user_id:
        return jsonify({"success": False, "error": "Vous ne pouvez pas supprimer votre propre compte"}), 400

    target_user = User.query.get_or_404(user_id)

    if current_user.role == "admin":
        # Optionnel : empêcher la suppression d’un autre admin
        if target_user.role == "admin":
            return jsonify({"success": False, "error": "Vous ne pouvez pas supprimer un autre administrateur"}), 403

        try:
            db.session.delete(target_user)
            db.session.commit()
            return jsonify({"success": True, "message": "Utilisateur supprimé"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": f"Erreur lors de la suppression : {str(e)}"}), 500
    else:
        return jsonify({"success": False, "error": "Accès refusé"}), 403




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
    
    ########################################################################

@admin_bp.route("stats/users")
@jwt_required()
def getUsers():
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user==current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403
        users = db.session.query(User.first_name, User.last_name ,User.email, func.date(User.created_at).label("created_at") ,User.isbanned, User.subscription,User.id_user).all()
        users_list = [
            {
                "id_user": user.id_user,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "isbanned": user.isbanned,
                "subscription": user.subscription
            } for user in users
        ]
        return jsonify(users_list), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

    
@admin_bp.route("/users/<int:user_id>/ban", methods=["PATCH"])
@jwt_required()
def bannir(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user == current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403
        user = db.session.query(User).filter(User.id_user == user_id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        user.isbanned = True
        db.session.commit()
        return jsonify({"message": "Utilisateur banni avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@admin_bp.route("users/<int:user_id>/unban", methods=["PATCH"])
@jwt_required()
def unban(user_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user == current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403
        user= db.session.query(User).filter(User.id_user == user_id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        user.isbanned = False
        db.session.commit()
        return jsonify({"message": "Utilisateur débanni avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    


@admin_bp.route("/users/<int:user_id>/premuim", methods=["PATCH"])
def set_premium(user_id):
    try:
        user =db.session.query(User).filter(User.id_user == user_id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        user.subscription = True
        db.session.commit()
        return jsonify({"message": "Utilisateur mis en premium avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@admin_bp.route("/users/<int:user_id>/free", methods=["PATCH"])
def set_free(user_id):
    try:
        user = db.session.query(User).filter(User.id_user == user_id).first()
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        user.subscription = False
        db.session.commit()
        return jsonify({"message": "Utilisateur mis en free avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@admin_bp.route("experiences/<int:id_experience>/approve",methods=["PATCH"])
@jwt_required()
def approve_experiences(id_experience):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user == current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403
        experience = db.session.query(Experience).filter(Experience.id_experience == id_experience).first()
        if not experience:
            return jsonify({"error": "Expérience non trouvée"}), 404
        experience.is_validated = "approved"
        db.session.commit()
        return jsonify({"message": "Expérience approuvée avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_bp.route("experiences/<int:id_experience>/reject",methods=["PATCH"])
@jwt_required()
def reject_experiences(id_experience):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user == current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403
        experience = db.session.query(Experience).filter(Experience.id_experience == id_experience).first()
        if not experience:  
            return jsonify({"error": "Expérience non trouvée"}), 404
        experience.is_validated = "rejected"
        db.session.commit()
        return jsonify({"message": "Expérience rejetée avec succès"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_bp.route("all_stats",methods=["GET"])
@jwt_required()
def all_stats():
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.query(User).filter(User.id_user == current_user_id).first()
        if not current_user or current_user.role.strip().lower() != "admin":
            return jsonify({"error": "Accès non autorisé"}), 403

        # Statistiques des utilisateurs
        total_users = db.session.query(func.count(User.id_user)).scalar()
        active_users = db.session.query(func.count(User.id_user)).filter(User.isbanned == False).scalar()
        premium_users = db.session.query(func.count(User.id_user)).filter(User.subscription == True).scalar()
        taux_conversion = (premium_users / total_users) * 100 if total_users > 0 else 0
        users_banned = total_users - active_users
        taux_conversion_last_30_days = 0
        import datetime
        thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        new_users_last_30_days = db.session.query(func.count(User.id_user)).filter(User.created_at >= thirty_days_ago).scalar()
        if total_users > 0:
            taux_conversion_last_30_days = (new_users_last_30_days / total_users) * 100


        # Statistiques des expériences
        total_experiences = db.session.query(func.count(Experience.id_experience)).scalar()
        pending_experiences = db.session.query(func.count(Experience.id_experience)).filter(Experience.is_validated == "pending").scalar()
        approved_experiences = db.session.query(func.count(Experience.id_experience)).filter(Experience.is_validated == "approved").scalar()
        rejected_experiences = db.session.query(func.count(Experience.id_experience)).filter(Experience.is_validated == "rejected").scalar()
        taux_approbation = (approved_experiences / total_experiences) * 100 if total_experiences > 0 else 0

        stats = {
            "total_users": total_users,
            "active_users": active_users,
            "premium_users": premium_users,
            "total_experiences": total_experiences,
            "pending_experiences": pending_experiences,
            "approved_experiences": approved_experiences,
            "rejected_experiences": rejected_experiences,
            "taux_conversion": taux_conversion,
            "taux_approbation": taux_approbation,
            "banned_users_count": users_banned,
            "new_users_last_30_days": new_users_last_30_days,
            "taux_conversion_last_30_days": taux_conversion_last_30_days
        }

        return jsonify(stats), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



