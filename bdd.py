import pandas as pd
import json

# === 1. Charger le fichier CSV ===
fichier_csv = "Liste Communes + CCAS(CCAS ) (5).csv"
df = pd.read_csv(fichier_csv)

df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
print("🧾 Colonnes actuelles :", df.columns.tolist())









# === 2. Nettoyage des colonnes ===
df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

# Vérification du nom des colonnes
print("Colonnes détectées :", df.columns.tolist())

# === 3. Construction du dictionnaire par commune ===
communes_dict = {}



for _, row in df.iterrows():
    commune = row['commune']
    if pd.isna(commune) or commune.strip() == "":
        continue  # ignorer les lignes vides

    nom_ccas = row.get("ccas_identifié", "")
    adresse_ccas = row.get("adresse_ccas", "")
    mail_ccas = row.get("mail_ccas", "")
    telephone_ccas = row.get("telephone_ccas", "")

    nom_uts = row.get("uts", "")
    adresse_uts = row.get("adresse_uts", "")
    tel_uts = row.get("téléphone_uts", "")

    nom_clic = row.get("clic", "")
    adresse_clic = row.get("adresse_clic", "")
    tel_clic = row.get("téléphone_clic", "")

    saad = row.get("saad", "")

    nom_crt = row.get("crt", "")
    adresse_crt = row.get("adresse_crt", "")
    tel_crt = row.get("téléphone_crt", "")

    # Initialiser la commune si absente
    if commune not in communes_dict:
        communes_dict[commune] = []


    
    # Ajouter CCAS si renseigné
    if pd.notna(nom_ccas) and nom_ccas.strip() != "":
        communes_dict[commune].append({
            "type": "CCAS",
            "nom": nom_ccas.strip(),
            "adresse": adresse_ccas.strip() if pd.notna(adresse_ccas) else "",
            "mail": mail_ccas.strip() if pd.notna(mail_ccas) else "",
            "telephone": telephone_ccas.strip() if pd.notna(telephone_ccas) else ""
        })

    # Ajouter UTS si renseigné
    if pd.notna(nom_uts) and nom_uts.strip() != "":
        communes_dict[commune].append({
            "type": "UTS",
            "nom": nom_uts.strip(),
            "adresse": adresse_uts.strip() if pd.notna(adresse_uts) else "",
            "telephone": tel_uts.strip() if pd.notna(tel_uts) else ""
        })

# Ajouter CLIC si renseigné
    if pd.notna(nom_clic) and nom_clic.strip() != "":
        communes_dict[commune].append({
            "type": "CLIC",
            "nom": nom_clic.strip(),
            "adresse": adresse_clic.strip() if pd.notna(adresse_clic) else "",
            "telephone": tel_clic.strip() if pd.notna(tel_clic) else ""
        })

    

    # Ajouter SAAD si renseigné
    if pd.notna(saad) and saad.strip() != "":
        communes_dict[commune].append({
            "type": "SAAD",
            "nom": saad.strip()
        })

    # Ajouter CRT si renseigné
    if pd.notna(nom_crt) and nom_crt.strip() != "":
        communes_dict[commune].append({
            "type": "CRT",
            "nom": nom_crt.strip(),
            "adresse": adresse_crt.strip() if pd.notna(adresse_crt) else "",
            "telephone": tel_crt.strip() if pd.notna(tel_crt) else ""
        })

# === 4. Transformation en liste pour JSON ===
liste_communes = [{"commune": nom, "structures": structures} for nom, structures in communes_dict.items()]

# === 5. Écriture dans un fichier JSON ===
with open("communes_structures.json", "w", encoding="utf-8") as f:
    json.dump(liste_communes, f, ensure_ascii=False, indent=2)

print("✅ Fichier JSON généré : communes_structures.json")
