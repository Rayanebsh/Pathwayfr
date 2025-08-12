from flask import Flask
from models import db
from config import Config
from routes.user_route import users_bp
from routes.auth_route import auth_bp
from routes.experience_route import experience_bp
from routes.admin_route import admin_bp
from routes.grades_route import grades_bp
from flask_mail import Mail
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from utils.jwt_blacklist import blacklisted_tokens
from routes.universitites_route import universities_bp
from routes.specialities_route import specialities_bp
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=["http://localhost:3000"])
db.init_app(app)
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(experience_bp, url_prefix='/experience')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(grades_bp, url_prefix='/grades')
app.register_blueprint(universities_bp, url_prefix='/universities')
app.register_blueprint(specialities_bp, url_prefix='/specialities')
mail = Mail(app)
jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in blacklisted_tokens

if __name__ == '__main__':
    with app.app_context():
        print('URL de connexion utilisée :', app.config['SQLALCHEMY_DATABASE_URI'])
        db.create_all()
        print("✅ Tables créées avec succès.")
        app.run(debug=True)
