from itsdangerous import URLSafeTimedSerializer
from flask import current_app

def generate_token(email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return s.dumps(email, salt='reset-password')


def confirm_token(token, expiration=3600):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        return s.loads(token, salt='reset-password', max_age=expiration)
    except Exception:
        return None


def verify_token(token, max_age=3600):
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return s.loads(token, salt='reset-password', max_age=max_age)


