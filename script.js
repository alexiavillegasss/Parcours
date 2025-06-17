let baseStructure = [];
let communesAvecCLIC = new Set();

fetch("communes_structures.json")
  .then(res => res.json())
  .then(data => {
    baseStructure = data;
    console.log("Base de données chargée avec succès.", baseStructure);

    // Construction dynamique de la liste des communes avec CLIC
    communesAvecCLIC = new Set(
      baseStructure
        .filter(c => {
          const clic = c.structures.find(s => s.type === "CLIC");
          return clic && clic.clic.toLowerCase() !== "pas de clic";
        })
        .map(c => c.commune)
    );

    history.replaceState(arbrePA, "", "");
    afficherNoeud(arbrePA);
  })
  .catch(err => {
    console.error("❌ Erreur lors du chargement du JSON :", err);
    document.getElementById("formulaire").innerHTML = "<p>Erreur de chargement des données.</p>";
  });

const container = document.getElementById("formulaire");

function afficherQuestion(noeud) {
  container.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = noeud.question;
  container.appendChild(p);

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
      enregistrerReponse(noeud.question, option.label);
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
  if (resultat === "Siège départemental à Draguignan") {
    const message = document.createElement("p");
    message.innerHTML = "📬 Courrier à envoyer en précisant le besoin.";
    container.appendChild(message);
  } else {
    const selectHTML = `
      <p><strong>Merci de sélectionner la commune de résidence :</strong></p>
      <select id="commune-select">
        <option disabled selected>Choisir une commune</option>
        ${genererOptionsCommunes()}
      </select>
      <div id="orientation-locale" style="margin-top: 1rem;"></div>
    `;
    container.innerHTML += selectHTML;
    const select = document.getElementById("commune-select");
    const resultDiv = document.getElementById("orientation-locale");

    select.addEventListener("change", () => {
      const commune = select.options[select.selectedIndex].text;
      const orientation = resultat.trim();
      let structure = "";
      const communeData = baseStructure.find(entry => entry.commune.toLowerCase() === commune.toLowerCase());
if (communeData) {
  // Trouve le CCAS (mais ignore ceux qui ont "n'a pas de CCAS" dans le nom)
  const ccas = communeData.structures.find(s =>
    s.type.toUpperCase() === "CCAS" &&
    s.nom.trim().toLowerCase() !== "la commune n’a pas de ccas" &&
    s.nom.trim().toLowerCase() !== "la commune n'a pas de ccas" // apostrophe droite OU courbe
  );

  const uts = communeData.structures.find(s => s.type.toUpperCase() === "UTS");

  if (ccas) {
    structure = `
      ✅ <strong>${ccas.nom}</strong><br>
      🏢 ${ccas.adresse || "Adresse non renseignée"}<br>
      📧 ${ccas.mail || "Mail non renseigné"}<br>
      ☎️ ${ccas.telephone || "Téléphone non renseigné"}
    `;
  } else if (uts) {
    structure = `
      ⚠️ <strong>La commune n’a pas de CCAS</strong><br>
      👉 Orientation vers l’UTS de secteur :<br><br>
      ✅ <strong>${uts.nom}</strong><br>
      🏢 ${uts.adresse || "Adresse non renseignée"}<br>
      📧 ${uts.mail || "Mail non renseigné"}<br>
      ☎️ ${uts.telephone || "Téléphone non renseigné"}
    `;
  } else {
    structure = "Aucune structure trouvée pour cette commune.";
  }
}




if (!structure) {
  structure = `Redirection vers un service de la commune de ${commune}`;
}

      if (!structure) {
        structure = `Redirection vers le service ${orientation.replace("Rediriger vers un ", "")} de ${commune}`;
      }
      resultDiv.innerHTML = `<p> <strong>${structure}</strong></p>`;

      const ficheBtn = document.createElement("button");
      ficheBtn.textContent = "📄 Générer ma fiche patient";
      ficheBtn.addEventListener("click", () => {
      genererFichePatient(commune, orientation, structure, reponsesUtilisateur);
  });
resultDiv.appendChild(ficheBtn);
    });
  }
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
  doc.setFont("times", "normal");

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
    if (y + lignes.length * 6 > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(lignes, 10, y);
    y += lignes.length * 6;
  }

  // Section "Structures à contacter"
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("Helvetica", "bold");
  doc.text("Structures à contacter :", 10, y + 10);
  y += 18;
  doc.setFont("Helvetica", "normal");

  // Nettoyage plus robuste
const tempDiv = document.createElement("div");
tempDiv.innerHTML = structureHtml;
const texteStructure = nettoyerStructureHTML(structureHtml || "");



  const lignesStructure = doc.splitTextToSize(texteStructure.trim(), 180);
if (y + lignesStructure.length * 6 > 280) {
  doc.addPage();
  y = 20;
}
if (!lignesStructure.length) {
  doc.text("Aucune structure trouvée.", 10, y);
} else {
  doc.text(lignesStructure, 10, y);
}

doc.text(lignesStructure, 10, y);


  // Sauvegarde du PDF
  doc.save(`fiche_patient_${identifiant}.pdf`);
}

