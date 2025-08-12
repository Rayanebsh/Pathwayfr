from flask_mail import Message
from flask import current_app
from utils.token import generate_token
from models import db

def send_verification_email(user):
    from app import mail  # éviter l'import circulaire

    token = generate_token(user.email)
    confirm_url = f"http://127.0.0.1:5000/auth/verify/{token}"
    subject = "✔ Vérifiez votre adresse email"

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2c3e50;">Bonjour {user.first_name},</h2>
            <p style="font-size: 16px; color: #333;">
                Merci de vous être inscrit sur <strong>PathwayFR</strong> 🎉
            </p>
            <p style="font-size: 16px; color: #333;">
                Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email :
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{confirm_url}" style="background-color: #3498db; color: #fff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Vérifier mon adresse
                </a>
            </div>
            <p style="font-size: 14px; color: #999;">
                Ou copiez-collez ce lien dans votre navigateur si le bouton ne fonctionne pas :<br>
                <a href="{confirm_url}" style="color: #3498db;">{confirm_url}</a>
            </p>
            <hr style="margin-top: 40px;">
            <p style="font-size: 12px; color: #ccc; text-align: center;">
                © 2025 PathwayFR. Tous droits réservés.
            </p>
        </div>
    </body>
    </html>
    """

    msg = Message(subject, recipients=[user.email], html=html, sender=current_app.config["MAIL_USERNAME"])
    mail.send(msg)

def send_password_reset_email(user):
    from app import mail
    token = generate_token(user.email)
    reset_url = f"http://127.0.0.1:5000/auth/forgot-password/{token}"
    subject = "✔ Changer votre mot de passe"

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2c3e50;">Bonjour {user.first_name},</h2>
            <p style="font-size: 16px; color: #333;">
                Veuillez cliquer sur le bouton ci-dessous pour changer votre mot de passe :
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" style="background-color: #3498db; color: #fff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Changer mon mot de passe
                </a>
            </div>
            <p style="font-size: 14px; color: #999;">
                Ou copiez-collez ce lien dans votre navigateur si le bouton ne fonctionne pas :<br>
                <a href="{reset_url}" style="color: #3498db;">{reset_url}</a>
            </p>
            <hr style="margin-top: 40px;">
            <p style="font-size: 12px; color: #ccc; text-align: center;">
                © 2025 PathwayFR. Tous droits réservés.
            </p>
        </div>
    </body>
    </html>
    """

    msg = Message(subject, recipients=[user.email], html=html, sender=current_app.config["MAIL_USERNAME"])
    mail.send(msg)
