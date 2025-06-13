import pandas as pd
import json

# === 1. Charger le fichier CSV ===
fichier_csv = "Liste Communes + CCAS(CCAS ) (2).csv"
df = pd.read_csv(fichier_csv)



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
    clic = row.get("clic", "")
    saad = row.get("saad", "")

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

    if pd.notna(saad) and saad.strip() != "":
        communes_dict[commune].append({
            "type": "CLIC",
            "clic": clic.strip() if pd.notna(clic) else ""
        })

    # Ajouter SAAD si renseigné
    if pd.notna(saad) and saad.strip() != "":
        communes_dict[commune].append({
            "type": "SAAD",
            "nom": saad.strip()
        })

# === 4. Transformation en liste pour JSON ===
liste_communes = [{"commune": nom, "structures": structures} for nom, structures in communes_dict.items()]

# === 5. Écriture dans un fichier JSON ===
with open("communes_structures.json", "w", encoding="utf-8") as f:
    json.dump(liste_communes, f, ensure_ascii=False, indent=2)

print("✅ Fichier JSON généré : communes_structures.json")
