const redirections = {
  "Rediriger vers un CLIC": {
    "Bandol": "CLIC Ouest Varois",
    "Le Beausset": "CLIC Ouest Varois",
    "Brignoles": "CLIC Provence Verte",
    "Sanary": "CLIC Ouest Varois",
    "St Maximin": "CLIC Provence Verte",
    "Cotignac": "CLIC Provence Verte",
    "Rians": "CLIC Provence Verte"
  },
  "Rediriger vers un UTS": {
    "La Seyne": "UTS La Seyne",
    "Toulon": "UTS Toulon",
    "Hyères": "UTS Hyères"
  },
  "Rediriger vers le CCAS": {
    "Le Beausset": "CCAS Le Beausset",
    "Ollioules": "CCAS Ollioules",
    "Sanary": "CCAS Sanary"
  }
};

const communesAvecCLIC = new Set([
  "Bras", "Brignoles", "Camps-la-source", "Carces", "Chateauvert", "Correns", "Cotignac",
  "Entrecasteaux", "Forcalqueiret", "Gareoult", "La Celle", "La Roquebrussanne", "Le Val",
  "Mazaugues", "Meounes-les-Montrieux", "Montfort-sur-Argens", "Nans-les-Pins", "Neoules",
  "Ollieres", "Plan-d'Aups-Sainte-Baume", "Pourcieux", "Pourrieres", "Rocbaron", "Rougiers",
  "Sainte-Anastasie-sur-Issole", "Saint-Maximin-la-Sainte-Baume", "Tourves", "Vins-sur-Caramy"
]);

const container = document.getElementById("formulaire");

function afficherQuestion(noeud) {
  container.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = noeud.question;
  container.appendChild(p);

  if (noeud.selectCommuneCLIC) {
    const allCommunes = [
      ...new Set([
        ...Object.values(redirections).flatMap(obj => Object.keys(obj)),
        ...communesAvecCLIC
      ])
    ];

    const select = document.createElement("select");
    select.innerHTML = `
      <option disabled selected>Choisir une commune</option>
      ${allCommunes.sort().map(c => `<option>${c}</option>`).join("")}
    `;

    select.addEventListener("change", () => {
      const commune = select.value;

      let orientation;
      if (communesAvecCLIC.has(commune)) {
        orientation = "Rediriger vers un CLIC";
      } else if (redirections["Rediriger vers un UTS"]?.[commune]) {
        orientation = "Rediriger vers un UTS";
      } else {
        orientation = "Rediriger vers le CCAS";
      }

      container.innerHTML = `
        <h2>Orientation :</h2>
        <p>${orientation}</p>
      `;

      let structure = redirections[orientation]?.[commune];
      if (!structure) {
        structure = `Redirection vers le CLIC de ${commune}`;
      }

      const resultDiv = document.createElement("div");
      resultDiv.innerHTML = `<p>✅ <strong>${structure}</strong></p>`;
      container.appendChild(resultDiv);

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

      let structure = redirections[orientation]?.[commune];
      if (!structure) {
        structure = `Redirection vers le CLIC de ${commune}`;
      }

      resultDiv.innerHTML = `<p>✅ <strong>${structure}</strong></p>`;
    });
  }

  const restart = document.createElement("button");
  restart.textContent = "🏠 Recommencer";
  restart.onclick = retourAccueil;
  container.appendChild(restart);
}

function genererOptionsCommunes() {
  const antennes = {
    "Antenne Provence Verte": [
      "Brignoles", "Cotignac", "St Maximin", "Barjols", "Ollières", "Tavernes", "Rians", "Le Val",
      "Correns", "Mazaugues", "Montfort", "Cabasse", "Vins/Caramy", "Bras", "Châteauvert",
      "La Celle", "La Verdière", "St Martin", "Artigues", "Fox Amphoux", "Ginasservis",
      "St Julien", "Montmeyan", "Esparron", "Seillons", "Pourrières", "Pourcieux", "Plan-d'Aups"
    ],
    "Antenne Littoral Ouest Var": [
      "Bandol", "Sanary", "La Seyne", "Toulon", "Le Beausset", "Signes", "St Cyr", "Le Castellet",
      "Evenos", "Ollioules", "Six Fours", "St Mandrier", "La Cadière d'Azur"
    ],
    "Antenne Bassin Hyérois": [
      "Hyères", "La Londe", "Le Lavandou", "Bormes", "Pierrefeu", "Cuers", "Solliès-Pont",
      "Solliès-Toucas", "Solliès-Ville", "La Farlède", "La Crau", "La Garde", "Le Pradet",
      "Carqueiranne", "Belgentier", "Carnoules", "Puget-Ville", "Pignans", "Collobrières", "Gonfaron"
    ]
  };

  return Object.entries(antennes).map(([label, communes]) => {
    return `<optgroup label="${label}">${communes.map(c => `<option>${c}</option>`).join("")}</optgroup>`;
  }).join("");
}

function retourAccueil() {
  window.location.href = "index.html";
}

function afficherNoeud(noeud) {
  if (noeud.result) {
    afficherResultat(noeud.result);
  } else {
    afficherQuestion(noeud);
  }
}

window.onpopstate = (event) => {
  if (event.state) {
    afficherNoeud(event.state);
  } else {
    afficherNoeud(arbrePASocial);
  }
};

// Lancement initial
history.replaceState(arbrePASocial, "", "");
afficherNoeud(arbrePASocial);
