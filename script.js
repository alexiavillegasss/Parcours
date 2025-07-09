let baseStructure = [];
let communesAvecCLIC = new Set();
const reponsesUtilisateur = {};

 
fetch("communes_structures.json")
  .then(res => res.json())
  .then(data => {
    baseStructure = data;
    console.log("✅ Données JSON chargées :", baseStructure);
 
    communesAvecCLIC = new Set(
      baseStructure
        .filter(c => {
      const clic = c.structures.find(s => s.type === "CLIC");
      return clic && clic.clic && clic.clic.toLowerCase() !== "pas de clic";
    })
        .map(c => c.commune)
    );
 
    history.replaceState(arbrePA, "", "");
    try {
  afficherNoeud(arbrePA);
} catch (e) {
  console.error("❌ Erreur lors de l'affichage du noeud :", e);
  document.getElementById("formulaire").innerHTML = "<p>Erreur dans la structure du formulaire.</p>";
}
  })
  .catch(err => {
    console.error("❌ Erreur lors du chargement du JSON :", err);
    document.getElementById("formulaire").innerHTML = "<p>Erreur de chargement des données.</p>";
  });
 
const container = document.getElementById("formulaire");
 
function afficherQuestion(noeud) {

    container.innerHTML = "";

    const questionEl = document.createElement("p");
    questionEl.textContent = noeud.question;
    container.appendChild(questionEl);

    if (noeud.question.trim() === "La personne a-t-elle un mandataire judiciaire ?") {
    const memo = document.createElement("details");
    memo.innerHTML = `
      <summary> Mémo – Les mesures de protection juridique</summary>
      <div>
        <p><strong>Le juge décide d’une mesure de protection à partir d’un certificat médical circonstancié.</strong></p>

        <p><strong>Les principales mesures :</strong></p>
        <ul>
          <li><strong>Sauvegarde de Justice</strong> = contrôle du juge</li>
          <li><strong>Habilitation familiale</strong> = sans contrôle du juge</li>
          <li><strong>Curatelle</strong> = contrôle du juge</li>
          <li><strong>Tutelle</strong> = contrôle du juge</li>
          <li><strong>Mandat de protection future</strong> = sans contrôle du juge</li>
        </ul>

        <hr>

        <p><strong>🔹 Sauvegarde de Justice</strong></p>
        <ul>
          <li>Mesure temporaire, souple et rapide à mettre en place</li>
          <li>Valable uniquement pour certains actes précisés par le juge</li>
          <li>Durée : 1 an, renouvelable 1 fois</li>
          <li>Évolue souvent vers curatelle/tutelle si besoin</li>
        </ul>

        <p><strong>🔹 Habilitation familiale</strong></p>
        <ul>
          <li>Permet à un proche d’agir pour la personne protégée</li>
          <li>Pas de contrôle régulier du juge</li>
          <li>Autorisation initiale nécessaire</li>
        </ul>

        <p><strong>🔹 Curatelle</strong></p>
        <ul>
          <li>La personne a besoin d’être assistée dans ses démarches</li>
          <li><strong>Curatelle simple</strong> : gestion personnelle sauf achats/emprunts</li>
          <li><strong>Curatelle renforcée</strong> : le curateur gère et règle les dépenses</li>
          <li>Durée : 5 ans, renouvelable jusqu’à 20 ans</li>
        </ul>

        <p><strong>🔹 Tutelle</strong></p>
        <ul>
          <li>Quand la sauvegarde ou la curatelle ne suffisent plus</li>
          <li>Le tuteur représente la personne dans presque tous les actes</li>
          <li>Certains actes doivent toujours être autorisés par le juge</li>
          <li>Durée : 5 ans, renouvelable jusqu’à 10-20 ans</li>
        </ul>

        <p><strong>🔹 Mandat de protection future</strong></p>
        <ul>
          <li>Permet d’anticiper la perte d’autonomie</li>
          <li>La personne choisit qui la représentera</li>
          <li>Doit être individualisé, nécessaire, proportionné</li>
          <li>Forme : sous seing privé ou par acte notarié</li>
          <li>Pas d’intervention du juge tant que tout se passe bien</li>
        </ul>
      </div>
    `;
    container.appendChild(memo);
    }
  
    
 
  if (noeud.selectCommuneCLIC || noeud.selectCommuneCCAS) {
    const allCommunes = [...new Set(baseStructure.map(e => e.commune))].sort();
 
    const select = document.createElement("select");
    select.innerHTML = `
      <option disabled selected>Choisir une commune</option>
      ${allCommunes.map(c => `<option>${c}</option>`).join("")}
    `;
 
    select.addEventListener("change", () => {
      const commune = select.value;
      let orientation;
 
      const communeData = baseStructure.find(entry => entry.commune.toLowerCase() === commune.toLowerCase());
      if (!communeData) return;
 
      const clic = communeData.structures.find(s => s.type === "CLIC" && s.clic.toLowerCase() !== "pas de clic");
      const ccas = communeData.structures.find(s => s.type === "CCAS" && !s.nom.toLowerCase().includes("n'a pas de ccas") && !s.nom.toLowerCase().includes("n’a pas de ccas"));
      const uts = communeData.structures.find(s => s.type === "UTS");
 
      let structure = "";
 
      if (noeud.selectCommuneCLIC && clic) {
        orientation = "Rediriger vers un CLIC";
        structure = `
          ✅ <strong>${clic.clic}</strong><br>
          👉 CLIC identifié pour la commune de <strong>${commune}</strong>
        `;
 
        if (ccas || uts) {
          structure += `
            <details>
              <summary>ℹ️ Pour information complémentaire</summary>
              <p>Pour cette commune, il peut être utile de connaître également les coordonnées du CCAS ou de l’UTS si nécessaire.</p>
              ${ccas ? `
                <p>
                  🏛️ <strong>${ccas.nom}</strong><br>
                  🏢 ${ccas.adresse || "Adresse non renseignée"}<br>
                  📧 ${ccas.mail || "Mail non renseigné"}<br>
                  ☎️ ${ccas.telephone || "Téléphone non renseigné"}
                </p>
              ` : ""}
              ${uts ? `
                <p>
                  ✅ <strong>${uts.nom}</strong><br>
                  🏢 ${uts.adresse || "Adresse non renseignée"}<br>
                  ☎️ ${uts.telephone || "Téléphone non renseigné"}
                </p>
              ` : ""}
            </details>
          `;
        }
      } else if (ccas) {
        orientation = "Rediriger vers le CCAS";
        structure = `
          ✅ <strong>${ccas.nom}</strong><br>
          🏢 ${ccas.adresse || "Adresse non renseignée"}<br>
          📧 ${ccas.mail || "Mail non renseigné"}<br>
          ☎️ ${ccas.telephone || "Téléphone non renseigné"}
        `;
 
        if (uts) {
          structure += `
            <details>
              <summary>ℹ️ Pour information complémentaire</summary>
              <p>Pour cette commune, il peut être utile de se référer également à l’UTS si le CCAS ne suffit pas pour la demande.</p>
              <p>
                ✅ <strong>${uts.nom}</strong><br>
                🏢 ${uts.adresse || "Adresse non renseignée"}<br>
                ☎️ ${uts.telephone || "Téléphone non renseigné"}
              </p>
            </details>
          `;
        }
      } else if (uts) {
        orientation = "Rediriger vers une UTS";
        structure = `
          ⚠️ <strong>La commune n’a pas de CCAS</strong><br>
          👉 Orientation vers l’UTS de secteur :<br><br>
          ✅ <strong>${uts.nom}</strong><br>
          🏢 ${uts.adresse || "Adresse non renseignée"}<br>
          ☎️ ${uts.telephone || "Téléphone non renseigné"}
        `;
      } else {
        orientation = "Aucune structure trouvée";
        structure = "Aucune structure trouvée pour cette commune.";
      }
 
      container.innerHTML = `
        <h2>Orientation :</h2>
        <p>${orientation}</p>
        <div><strong>${structure}</strong></div>
      `;
      const ficheBtn = document.createElement("button");
  ficheBtn.textContent = "📄 Générer ma fiche patient";
  ficheBtn.addEventListener("click", () => {
    genererFichePatient(commune, orientation, structure, reponsesUtilisateur);
  });
  container.appendChild(ficheBtn);
 
      const restart = document.createElement("button");
      restart.textContent = "🏠 Recommencer";
      restart.onclick = retourAccueil;
      container.appendChild(restart);
    });
 
    container.appendChild(select);
    return;
  }
 
  noeud.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option.label;
    btn.onclick = () => {
      reponsesUtilisateur[noeud.question] = option.label;
      const next = option.result ? { result: option.result } : option.next || option;
      history.pushState(next, "", "");
      afficherNoeud(next);
    };
    container.appendChild(btn);
  });
}
 
function afficherResultat(resultat) {
  container.innerHTML = `
    <h2>Orientation :</h2>
    <p>${resultat}</p>
  `;
const ficheBtn = document.createElement("button");
ficheBtn.textContent = "📄 génerer ma fiche patient";
ficheBtn.addEventListener("click", () => {
  genererFichePatient("Commune inconnue", resultat, "", reponsesUtilisateur);
});
container.appendChild(ficheBtn)

  const restart = document.createElement("button");
  restart.textContent = "🏠 Recommencer";
  restart.onclick = retourAccueil;
  container.appendChild(restart);
}
 
function afficherNoeud(noeud) {
  if (noeud.result) {
    afficherResultat(noeud.result);
  } else {
    afficherQuestion(noeud);
  }
}
 
function retourAccueil() {
  history.pushState(arbrePA, "", "");
  afficherNoeud(arbrePA);
}
 
window.addEventListener("popstate", (event) => {
  if (event.state) {
    afficherNoeud(event.state);
  }
});

function nettoyerStructureHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Supprimer les emojis
  const texteSansEmoji = div.textContent.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}]/gu, '');
  return texteSansEmoji.replace(/\s{2,}/g, " ").trim();
}

function genererFichePatient(commune, orientation, structureHtml, reponsesUtilisateur = {}) {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    alert("Erreur : jsPDF n'a pas été chargé !");
    return;
  }

  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const identifiant = "PA-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Titre
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Fiche d'orientation - DAC Var Ouest", 10, 20);

  // Infos générales
  doc.setFontSize(12);
  doc.setFont("Helvetica", "normal");
  doc.text(`Identifiant patient : ${identifiant}`, 10, 30);
  doc.text(`Commune : ${commune}`, 10, 38);
  doc.text(`Orientation finale : ${orientation}`, 10, 46);

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(10, 52, 200, 52);

  // Réponses au formulaire
  doc.setFont("Helvetica", "bold");
  doc.text("Réponses du formulaire :", 10, 60);
  doc.setFont("Helvetica", "normal");

  let y = 68;
  for (const [question, reponse] of Object.entries(reponsesUtilisateur)) {
    const lignes = doc.splitTextToSize(`- ${question} : ${reponse}`, 180);
    if (y + lignes.length * 6 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(lignes, 10, y);
    y += lignes.length * 6;
  }

  // Nettoyage du HTML de la structure
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = structureHtml;
  tempDiv.querySelectorAll("details, summary").forEach(el => el.remove());
  const texteStructure = tempDiv.innerText.replace(/\s{2,}/g, " ").trim();

  // Encadrer la section
  y += 10;
  doc.setFont("Helvetica", "bold");
  doc.text("Structure à contacter :", 10, y);
  y += 5;

  doc.setFont("Helvetica", "normal");
  const structureLines = doc.splitTextToSize(texteStructure, 180);
  if (y + structureLines.length * 6 > 270) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("Helvetica", "bold");
  doc.text("Informations sur la structure :", 10, y);
  y += 6;
  doc.setFont("Helvetica", "normal");

  const rectHeight = structureLines.length * 6 + 4;
  doc.rect(10, y, 190, rectHeight); // rectangle autour de la section
  doc.text(structureLines, 12, y + 6);

  // Sauvegarde
  doc.save(`fiche_patient_${identifiant}.pdf`);
}


