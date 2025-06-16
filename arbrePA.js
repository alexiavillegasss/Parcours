const mandatairesJudiciaires = {
  question: "Liste des mandataires judiciaires dans le Var :",
  options: [
    {
      label: "UDAF du Var",
      result: `
        <details open>
          <summary><strong>UDAF du Var</strong></summary>
          <p><u>Informations générales</u></p>
          <p>🏢 Siège social à Toulon :<br>
          📍 15 rue Chaptal, 83130 LA GARDE<br>
          ✉️ institution@udaf83.fr<br>
          ☎️ 04 94 14 85 00</p>
          <p>🏢 Antenne Draguignan :<br>
          📍 186 rue Jean Aicard, 83300 DRAGUIGNAN<br>
          ✉️ institution@udaf83.fr<br>
          ☎️ 04 94 50 42 90</p>
          <p>L'Udaf Var aide à l'information et au soutien aux tuteurs familiaux sur tout le département du Var. Ils sont aussi mandataires judiciaires et peuvent exercer des mesures de protection.</p>
          <p><u>Coordonnées pour l’aide aux tuteurs familiaux</u> (lundis après-midi et mercredis matins) :<br>
          ☎️ 04 83 43 36 00<br>
          ✉️ tuteursfamiliaux83@gmail.com</p>
        </details>
      `
    },
    {
      label: "ATIAM",
      result: `
        <details open>
          <summary><strong>ATIAM</strong></summary>
          <p>A.T.I.A.M : Association Tutélaire des Personnes protégées des Alpes Méridionales</p>
          <p>📍 Site de Six-Fours-les-Plages :<br>
          211, chemin de Négadoux – 83140 SIX FOURS LES PLAGES<br>
          ☎️ 04 94 71 42 91<br>
          Secteur : Toulon, Hyères</p>
          <p><u>Lieux d’accueil</u> :</p>
          <ul>
            <li>📍 Maison de la Justice TOULON – place Besagne – 83000 TOULON<br>
            🕘 1ers et 3èmes vendredis du mois – 09h00 à 12h00</li>
            <li>📍 CCAS de TOULON – 100 avenue des Remparts – 83000 TOULON<br>
            🕘 4èmes mardis du mois – 09h30 à 12h00</li>
            <li>📍 Maison de la Justice LA SEYNE – Cité Berthe – 83500 LA SEYNE<br>
            🕘 2ème vendredi du mois – 09h00 à 12h00</li>
          </ul>
        </details>
      `
    },
    {
      label: "ATMP du Var",
      result: `
        <details open>
          <summary><strong>ATMP du Var</strong></summary>
          <p><u>Sites d’accueil</u> :</p>
          <p>📍 Toulon : 66 avenue Marcel Castié, 83000 Toulon<br>
          ✉️ courriertoulon@atmp83.fr<br>
          ☎️ 04 94 89 72 72</p>
          <p>📍 Hyères : 11 Boulevard Matignon, 83400 Hyères<br>
          ✉️ courrierhyeres@atmp83.fr<br>
          ☎️ 04 94 12 84 30</p>
          <p>📍 Ollioules : Impasse des Peupliers – Espace Athéna, bât. C – 83190 Ollioules<br>
          ✉️ courrierollioules@atmp83.fr<br>
          ☎️ 04 94 10 92 70</p>
        </details>
      `
    },
    {
      label: "ATV (Assistance Tutelle Var)",
      result: `
        <details open>
          <summary><strong>ATV (Assistance Tutelle Var)</strong></summary>
          <p>📍 6 Boulevard Pierre Toesca, 83000 TOULON<br>
          ☎️ 04 94 29 91 38 (tous les matins de 9h à 12h, sauf mercredi)<br>
          ✉️ atvtoulon@gmail.com</p>
          <p>Secteur couvert : Peut intervenir dans toutes les communes de l’aire toulonnaise ou même du Var selon les mesures confiées.</p>
        </details>
      `
    },
    {
      label: "MSA 3A",
      result: `
        <details open>
          <summary><strong>MSA 3A</strong></summary>
          <p><u>Centres d’accueil</u> :</p>
          <p>📍 Brignoles : Centre d’affaires l’Hexagone – Bât. D, Rue Antoine Albalat – 83170 Brignoles<br>
          ☎️ Sur RDV au 04 94 60 38 38 – Lun. à ven. : 8h30–12h / 13h–16h</p>
          <p>📍 Hyères : 1205 Chemin du Soldat Macri – 83400 Hyères<br>
          ☎️ Sur RDV au 04 94 60 38 38 – mêmes horaires</p>
          <p>📍 Toulon : 33, Rond point Mirasouléou, Rés. du Parc Mirasouléou – 83100 TOULON<br>
          ☎️ 04 94 60 38 71 – téléphonique de 9h à 12h</p>
        </details>
      `
    },
    {
      label: "CH de Pierrefeu",
      result: `
        <details open>
          <summary><strong>Centre Hospitalier Henri Guérin – Pierrefeu-du-Var</strong></summary>
          <p>📍 Duartier Barnenq – 83390 Pierrefeu-du-Var<br>
          ✉️ tutelles@ch-pierrefeu.fr<br>
          ☎️ 04 94 33 18 11</p>
          <p><u>Responsable des tutelles</u> : Nathalie MONGE<br>
          ✉️ nathalie.monge@ch-pierrefeu.fr</p>
          <p>Secteur : tout le département (Brignoles, Draguignan, Fréjus, Toulon)<br>
          Conventionné avec les CH et EHPAD de plus de 80 lits</p>
        </details>
      `
    }
  ]
};

const arbrePA = {
  question: "La personne a-t-elle un mandataire judiciaire ?",
  options: [
    {
      label: "Oui",
      next: mandatairesJudiciaires
    },
    {
      label: "Non",
      question: "Bénéficie-t-elle de l'APA ?",
      options: [
        {
          label: "Oui",
          question: "Besoin de réévaluation ou plan APA déjà existant ?",
          options: [
            {
              label: "Oui",
              result: "Siège départemental à Draguignan"
            },
            {
              label: "Non",
              result: "Pôle social de coordination gérontologique"
            }
          ]
        },
        {
          label: "Non",
          question: "Est-elle suivie par un travailleur social ?",
          options: [
            {
              label: "Oui",
              result: "Rediriger vers le travailleur social référent"
            },
            {
              label: "Non",
              question: "Souhaite-t-elle le maintien à domicile ?",
              options: [
                {
                  label: "Oui",
                  question: "Dans quelle commune habite la personne ?",
                  selectCommuneCLIC: true
                },
                {
                  label: "Non",
                  question: "Dans quelle commune habite la personne ?",
                  selectCommuneCCAS: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
