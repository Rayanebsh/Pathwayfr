from flask import Blueprint, request, jsonify, render_template, url_for, redirect
from itsdangerous import SignatureExpired, BadSignature, URLSafeTimedSerializer
from models.user_model import User
from app import db
import datetime
from utils.token import confirm_token
from utils.email import send_verification_email , send_password_reset_email
from utils.helpers import hash_password,verify_password, get_serializer
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from utils.jwt_blacklist import blacklisted_tokens



# ✅ Blueprint bien défini une seule fois
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/verify/<token>")
def verify_email(token):
    email = confirm_token(token)
    if not email:
        return jsonify({"error": "Lien de vérification invalide ou expiré"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    if user.is_verified:
        return redirect("http://localhost:3000/auth/email-confirmed")

    user.is_verified = True
    user.verification_token = None
    db.session.commit()
    return redirect("http://localhost:3000/auth/email-confirmed")


@auth_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Aucune donnée JSON reçue ou format invalide."}), 400

    required_fields = ['first_name', 'last_name', 'email', 'password', 'role']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Champs manquants: {', '.join(missing_fields)}"}), 400

    try:
        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=data.get('role', 'user')
        )
        db.session.add(new_user)
        db.session.commit()
        send_verification_email(new_user)
        return jsonify({"message": "Utilisateur créé. Vérifiez votre email pour activer votre compte."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"{type(e).__name__}: {str(e)}"}), 400


@auth_bp.route('/email_confirmed')
def email_confirmed():
    return redirect("http://localhost:3000/auth/email-confirmed")

@auth_bp.route('/login' , methods=['POST'])
def login():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Aucune donnée JSON reçue ou format invalide."}), 400
    data_required = ['email', 'password']
    missing_fields=[field for field in data_required if field not in data]
    if missing_fields:
        return jsonify({"error": f"Champs manquants: {', '.join(missing_fields)}"}), 400
    user = User.query.filter_by(email=data['email']).first()
    password = data['password']
    password_hash = user.password if user else None
    if not user:
        return jsonify({"error": "utilisateur non trouvé"}), 404
    if not user.is_verified:
        return jsonify({"error": "Email non vérifié"}), 403
    verif = verify_password(password, password_hash)
    if not verif:
        return jsonify({"error": "Mot de passe incorrect"}), 401
    access_token = create_access_token(identity=str(user.id_user))
    refresh_token = create_access_token(identity=str(user.id_user))
    return jsonify({
        "message": "Connexion réussie",
        "access_token": access_token,
        "refresh_token": refresh_token
        }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    blacklisted_tokens.add(jti)
    return jsonify({"message": "Déconnexion réussie"}), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({"access_token": new_access_token}), 200


@auth_bp.route('/change_password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error":" Aucune donnée JSON reçue ou format invalide."}), 400
    required_fields = ['current_password', 'new_password']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Champs manquants: {', '.join(missing_fields)}"}), 400
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    if not verify_password(data['current_password'], user.password):
        return jsonify({"error": "Mot de passe actuel incorrect"}), 401
    user.password = hash_password(data['new_password'])
    try:
        db.session.commit()
        send_password_reset_email(user)
        return jsonify({"message": "Mot de passe modifié avec succès"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur lors de la modification du mot de passe: {str(e)}"}), 500
    




@auth_bp.route('/forgot_password/sendmail', methods=['POST'])
def send_reset_password_email():
    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "Aucune donnée JSON reçue ou format invalide."}), 400

    email = data.get("email")
    if not email:
        return jsonify({"error": "Champ 'email' manquant."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Aucun utilisateur avec cet email."}), 404

    try:
        send_password_reset_email(user)
        return jsonify({"message": "Vérifiez votre email pour changer votre mot de passe."}), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'envoi de l'email: {str(e)}"}), 500



def confirm_token(token):
    serializer = get_serializer()
    try:
        return serializer.loads(token, salt='reset-password', max_age=3600)
    except (SignatureExpired, BadSignature):
        return None


@auth_bp.route('/forgot-password/<token>', methods=['GET'])
def verify_reset_token(token):
    email = confirm_token(token)
    if not email:
        # Redirige vers la page reset-password avec un paramètre d'erreur
        return redirect(f"http://localhost:3000/auth/reset-password?token={token}&error=1")

    user = User.query.filter_by(email=email).first()
    if not user:
        return redirect(f"http://localhost:3000/auth/reset-password?token={token}&error=1")

    return redirect(f"http://localhost:3000/auth/reset-password?token={token}")


@auth_bp.route("/forgot-password/<token>", methods=["POST"])
def reset_password(token):
    from utils.token import verify_token  # ou selon ton projet
    from utils.validators import is_strong_password
    data = request.get_json()
    
    if not data or not data.get("password"):
        return jsonify({"error": "Mot de passe manquant."}), 400

    try:
        email = verify_token(token)  # ✅ Ici tu décryptes le token
    except Exception as e:
        return jsonify({"error": "Lien invalide ou expiré."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable."}), 404
    if not is_strong_password(data["password"]):
        return jsonify({"error": "Le mot de passe est faible, il doit avoir une taille supérieure à 8 et contenir au moins une majuscule, un chiffre et un caractère spécial"}), 400

    # Hasher et enregistrer le nouveau mot de passe
    hashed_password = hash_password(data["password"])
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Mot de passe mis à jour avec succès."}), 200


@auth_bp.route('/password-reset-success')
def password_reset_success():
    return redirect("http://localhost:3000/auth/password-reset-success")

