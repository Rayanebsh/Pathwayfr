from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

experience_bp = Blueprint("experience", __name__, url_prefix="/experience")


@experience_bp.route("/share", methods=["POST"])
def create_experience():
    

    data = request.get_json()
    if not data:
        return jsonify({"error": "Aucune donnée reçue"}), 400

    # ✅ CORRECTION : Champs vraiment requis seulement
    required_fields = [
        "speciality_id", "university_ids", "candidature_year",
        "comment", "is_validated",
        "study_year_at_application_time", "application_year", "level_tcf"
    ]
    # ❌ ENLEVÉ : "university_accepted_in", "university_rejected_in" (pas toujours requis)
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Le champ '{field}' est requis"}), 400

    try:
        # Vérification spécialité
        speciality = Speciality.query.get(data["speciality_id"])
        if not speciality:
            return jsonify({"error": "Spécialité introuvable"}), 404

        # Vérification universités
        university_ids = data.get("university_ids", [])
        if not isinstance(university_ids, list) or not university_ids:
            return jsonify({"error": "'university_ids' doit être une liste non vide"}), 400

        universities = University.query.filter(University.id_university.in_(university_ids)).all()
        if len(universities) != len(university_ids):
            return jsonify({"error": "Une ou plusieurs universités sont introuvables"}), 404

        # ✅ AJOUT : Vérification des universités acceptées/refusées (optionnel)
        accepted_unis = data.get("university_accepted_in", [])
        rejected_unis = data.get("university_rejected_in", [])
        
        # Vérifier que les universités acceptées/refusées sont dans la liste des universités visées
        if accepted_unis:
            if not all(uni_id in university_ids for uni_id in accepted_unis):
                return jsonify({"error": "Les universités acceptées doivent être dans la liste des universités visées"}), 400
                
        if rejected_unis:
            if not all(uni_id in university_ids for uni_id in rejected_unis):
                return jsonify({"error": "Les universités refusées doivent être dans la liste des universités visées"}), 400

        # 📌 Gestion présence années + redoublement (INCHANGÉ)
        years = ["1AS", "2AS", "3AS", "L1", "L2", "L3", "M1", "M2"]
        avg_dict = {}
        for year in years:
            has_year = f"{year}" in data and data[f"{year}"] not in (None, "")
            if not has_year:
                avg_dict[year] = None
                continue

            value = data.get(year)
            if value is not None and value != "":
                try:
                    avg_dict[year] = float(value)
                except ValueError:
                    return jsonify({"error": f"La valeur de '{year}' doit être un nombre"}), 400
            else:
                avg_dict[year] = None

            repeat = data.get(f"repeat_{year}", False)
            if repeat:
                repeat_value = data.get(f"{year}_repeat")
                if repeat_value is not None and repeat_value != "":
                    try:
                        avg_dict[f"{year}_repeat"] = float(repeat_value)
                    except ValueError:
                        return jsonify({"error": f"La valeur de '{year}_repeat' doit être un nombre"}), 400
                else:
                    avg_dict[f"{year}_repeat"] = None

        # Champs optionnels (INCHANGÉ)
        bac_average = data.get("bac_average")
        if bac_average != "" and bac_average is not None:
            try:
                bac_average = float(bac_average)
            except ValueError:
                return jsonify({"error": "'bac_average' doit être un nombre"}), 400
        else:
            bac_average = None

        bac_type = data.get("bac_type", None)

        # ✅ CORRECTION : Création expérience avec nouveaux champs
        new_exp = Experience(
            speciality_id=data["speciality_id"],
            candidature_year=data["candidature_year"],
            application_year=data["application_year"],
            average_each_year=avg_dict,
            comment=data["comment"],
            is_validated=bool(data["is_validated"]),
            bac_type=bac_type,
            bac_average=bac_average,
            study_year_at_application_time=data["study_year_at_application_time"],
            level_tcf=data["level_tcf"],
            universities=universities,
            # ✅ AJOUT : Nouveaux champs pour universités acceptées/refusées
            university_accepted_in=accepted_unis,
            university_rejected_in=rejected_unis
        )

        db.session.add(new_exp)
        db.session.commit()

        return jsonify({
            "message": "Expérience créée avec succès",
            "experience_id": new_exp.id_experience,
            # ✅ AJOUT : Retourner les universités acceptées/refusées pour confirmation
            "university_accepted_in": accepted_unis,
            "university_rejected_in": rejected_unis
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


from models.experiences_model import Experience
from models.speciality_model import Speciality
from models.university_model import University


@experience_bp.route("/explorer", methods=["GET"])
def get_experiences():
    try:
        print("🚀 Début de get_experiences")  # Debug log
        
        # dictionnaire de correspondance
        year_mapping = {
            1: "L1",
            2: "L2",
            3: "L3",
            4: "M1",
            5: "M2"
        }

        experiences = Experience.query.filter_by(is_validated="approved").all()
        print(f"📊 Nombre d'expériences trouvées: {len(experiences)}")  # Debug log
        
        result = []

        for exp in experiences:
            try:
                print(f"🔄 Traitement expérience ID: {exp.id_experience}")  # Debug log
                
                # ✅ CORRECTION : Utiliser un dictionnaire manuel au lieu de exp.to_dict()
                exp_data = {
                    "id_experience": exp.id_experience,
                    "user_id": exp.user_id,
                    "bac_type": exp.bac_type,
                    "bac_average": exp.bac_average,
                    "comment": exp.comment,
                    "application_year": exp.application_year,
                    "study_year_at_application_time": exp.study_year_at_application_time,
                    "average_each_year": exp.average_each_year or {},
                    "level_tcf": exp.level_tcf,
                    "candidature_year": exp.candidature_year,
                    "speciality_id": exp.speciality_id,
                    "is_validated": exp.is_validated
                }

                # Transformer candidature_year numérique en label lisible
                if exp_data.get("candidature_year") in year_mapping:
                    exp_data["candidature_year"] = year_mapping[exp_data["candidature_year"]]

                # ✅ AJOUT : Récupérer les universités acceptées
                accepted_universities = []
                if exp.university_accepted_in:
                    print(f"🎯 university_accepted_in: {exp.university_accepted_in}")
                    # Si c'est un tableau (peut contenir des IDs ou des noms)
                    if isinstance(exp.university_accepted_in, list):
                        for item in exp.university_accepted_in:
                            if item and str(item).strip():
                                # Essayer d'abord comme un ID
                                try:
                                    univ_id = int(item)
                                    univ = University.query.get(univ_id)
                                    if univ:
                                        accepted_universities.append(f"{univ.univ_name} ({univ.city})")
                                    else:
                                        accepted_universities.append(str(item))
                                except (ValueError, TypeError):
                                    # Si ce n'est pas un ID, traiter comme un nom
                                    accepted_universities.append(str(item).strip())
                
                exp_data["university_accepted_in"] = accepted_universities

                # ✅ AJOUT : Récupérer les universités refusées  
                rejected_universities = []
                if exp.university_rejected_in:
                    print(f"🎯 university_rejected_in: {exp.university_rejected_in}")
                    # Si c'est un tableau (peut contenir des IDs ou des noms)
                    if isinstance(exp.university_rejected_in, list):
                        for item in exp.university_rejected_in:
                            if item and str(item).strip():
                                # Essayer d'abord comme un ID
                                try:
                                    univ_id = int(item)
                                    univ = University.query.get(univ_id)
                                    if univ:
                                        rejected_universities.append(f"{univ.univ_name} ({univ.city})")
                                    else:
                                        rejected_universities.append(str(item))
                                except (ValueError, TypeError):
                                    # Si ce n'est pas un ID, traiter comme un nom
                                    rejected_universities.append(str(item).strip())
                
                exp_data["university_rejected_in"] = rejected_universities

                # Enrichir avec spécialité
                if exp.speciality:
                    exp_data["speciality"] = {
                        "id_speciality": exp.speciality.id_speciality,
                        "speciality_name": exp.speciality.speciality_name
                    }
                else:
                    exp_data["speciality"] = None

                # Enrichir avec universités (celles ciblées)
                exp_data["universities"] = []
                for univ in exp.universities:
                    exp_data["universities"].append({
                        "id_university": univ.id_university,
                        "univ_name": univ.univ_name,
                        "city": univ.city
                    })

                result.append(exp_data)
                print(f"✅ Expérience {exp.id_experience} traitée avec succès")
                
            except Exception as exp_error:
                print(f"❌ Erreur lors du traitement de l'expérience {exp.id_experience}: {str(exp_error)}")
                print(f"❌ Détails de l'erreur: {type(exp_error).__name__}")
                import traceback
                traceback.print_exc()
                continue  # Continuer avec les autres expériences

        print(f"✅ Nombre d'expériences traitées avec succès: {len(result)}")  # Debug log
        print(f"🎯 Résultat final: {result}")  # Debug log - pour voir la structure exacte
        
        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Erreur générale dans get_experiences: {str(e)}")  # Debug log
        print(f"❌ Type d'erreur: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    



@experience_bp.route("/<int:experience_id>", methods=["GET"])
def get_experience_by_id(experience_id):
    try:
        print(f"🚀 Début de get_experience_by_id pour ID: {experience_id}")  # Debug log

        # dictionnaire de correspondance
        year_mapping = {
            1: "L1",
            2: "L2",
            3: "L3",
            4: "M1",
            5: "M2"
        }

        exp = Experience.query.get(experience_id)
        if not exp:
            print(f"❌ Aucune expérience trouvée avec ID: {experience_id}")
            return jsonify({"error": "Experience not found"}), 404

        print(f"🔄 Traitement expérience ID: {exp.id_experience}")  # Debug log

        exp_data = {
            "id_experience": exp.id_experience,
            "user_id": exp.user_id,
            "bac_type": exp.bac_type,
            "bac_average": exp.bac_average,
            "comment": exp.comment,
            "application_year": exp.application_year,
            "study_year_at_application_time": exp.study_year_at_application_time,
            "average_each_year": exp.average_each_year or {},
            "level_tcf": exp.level_tcf,
            "candidature_year": exp.candidature_year,
            "speciality_id": exp.speciality_id,
            "is_validated": exp.is_validated
        }

        # Transformer candidature_year numérique en label lisible
        if exp_data.get("candidature_year") in year_mapping:
            exp_data["candidature_year"] = year_mapping[exp_data["candidature_year"]]

        # ✅ Universités acceptées
        accepted_universities = []
        if exp.university_accepted_in:
            if isinstance(exp.university_accepted_in, list):
                for item in exp.university_accepted_in:
                    if item and str(item).strip():
                        try:
                            univ_id = int(item)
                            univ = University.query.get(univ_id)
                            if univ:
                                accepted_universities.append(f"{univ.univ_name} ({univ.city})")
                            else:
                                accepted_universities.append(str(item))
                        except (ValueError, TypeError):
                            accepted_universities.append(str(item).strip())
        exp_data["university_accepted_in"] = accepted_universities

        # ✅ Universités refusées
        rejected_universities = []
        if exp.university_rejected_in:
            if isinstance(exp.university_rejected_in, list):
                for item in exp.university_rejected_in:
                    if item and str(item).strip():
                        try:
                            univ_id = int(item)
                            univ = University.query.get(univ_id)
                            if univ:
                                rejected_universities.append(f"{univ.univ_name} ({univ.city})")
                            else:
                                rejected_universities.append(str(item))
                        except (ValueError, TypeError):
                            rejected_universities.append(str(item).strip())
        exp_data["university_rejected_in"] = rejected_universities

        # ✅ Spécialité
        if exp.speciality:
            exp_data["speciality"] = {
                "id_speciality": exp.speciality.id_speciality,
                "speciality_name": exp.speciality.speciality_name
            }
        else:
            exp_data["speciality"] = None

        # ✅ Universités ciblées
        exp_data["universities"] = []
        for univ in exp.universities:
            exp_data["universities"].append({
                "id_university": univ.id_university,
                "univ_name": univ.univ_name,
                "city": univ.city
            })

        print(f"✅ Expérience {exp.id_experience} traitée avec succès")
        return jsonify(exp_data), 200

    except Exception as e:
        print(f"❌ Erreur générale dans get_experience_by_id: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

