# models/__init__.py

from flask_sqlalchemy import SQLAlchemy

# Initialisation de l'instance SQLAlchemy
db = SQLAlchemy()

# Importation des modèles (à faire après l'init de db pour éviter les erreurs circulaires)
from .user_model import User
from .grades_model import Grade
from .university_model import University
from .speciality_model import Speciality
from .experiences_model import Experience
from .univspec_model import UnivSpec
from .service_model import Service
from .message_model import Message
