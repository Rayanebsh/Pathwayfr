import secrets
import string

def generate_secret_key(length=64):
    """Génère une clé secrète aléatoire et sécurisée de `length` caractères."""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

key= generate_secret_key()
print("Clé secrète générée :", key)