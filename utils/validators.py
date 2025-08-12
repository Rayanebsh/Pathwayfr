import re

def is_strong_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):  # au moins une majuscule
        return False
    if not re.search(r'\d', password):     # au moins un chiffre
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):  # caractère spécial
        return False
    return True
