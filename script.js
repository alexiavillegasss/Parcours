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