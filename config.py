import os
from dotenv import load_dotenv
from urllib.parse import quote


# Charge les variables depuis .env
load_dotenv()


username = quote(os.getenv("DB_USERNAME"))
password = quote(os.getenv("DB_PASSWORD"))  # encodage si besoin (ex: caractères spéciaux)
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
dbname = os.getenv("DB_NAME")

class Config:
    SQLALCHEMY_DATABASE_URI=f"postgresql://{username}:{password}@{host}:{port}/{dbname}"
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ACCES_TOKEN_EXPIRES = os.getenv("JWT_ACCESS_TOKEN_EXPIRES")
    JWT_REFRESH_TOKEN_EXPIRES = os.getenv("JWT_REFRESH_TOKEN_EXPIRES")
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    FRONTEND_URL = os.getenv("FRONTEND_URL")
