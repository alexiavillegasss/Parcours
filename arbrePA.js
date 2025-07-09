const arbrePA = {
  question: "La personne a-t-elle un mandataire judiciaire ?",
  options: [
    {
  label: "Oui",
  question: "La personne a-t-elle besoin d'un maintient à domicile renforcé ?",
  options: [
    {
      label: "Oui",
      question: "Dans quelle commune habite la personne ?",
      selectCommuneCRT: true
    },
    {
      label: "Non",
      result: `
      <h3>Liste des mandataires judiciaires dans le Var :</h3>
  
      <details><summary><strong>UDAF du Var</strong> – Aide aux tuteurs familiaux et MJPM</summary>
        <p><u>Informations générales:</u><br>
        📍 15 rue Chaptal, 83130 LA GARDE<br>
        📧 institution@udaf83.fr<br>
        ☎️ 04 94 14 85 00</p>
        <p>📍 186 rue Jean Aicard, 83300 DRAGUIGNAN<br>
        📧 institution@udaf83.fr<br>
        ☎️ 04 94 50 42 90</p>
        <p><u>Spécificité</u> : accompagne les familles, informe les tuteurs familiaux, assure des mesures de protection judiciaire.</p>
        <p><u>Aide aux tuteurs familiaux</u><br>
        ☎️ 04 83 43 36 00<br>
        📧 tuteursfamiliaux83@gmail.com</p>
      </details>
  
      <details><summary><strong>ATIAM</strong> – Antenne locale d'une association régionale</summary>
        <p><u>Informations générales:</u><br>
        📍 211 chemin de Négadoux, 83140 SIX FOURS LES PLAGES<br>
        ☎️ 04 94 71 42 91</p>
        <p><u>Spécificité</u> : basée dans les Alpes-Maritimes, intervention limitée sur Toulon / Hyères.</p>
        <p><u>Lieux d’accueil :</u><br>
        📍 Maison de la Justice TOULON – 1er & 3e vend. (9h-12h)<br>
        📍 CCAS de TOULON – 4e mardi (9h30-12h)<br>
        📍 Maison de la Justice LA SEYNE – 2e vendredi (9h-12h)</p>
      </details>
  
      <details><summary><strong>ATMP du Var</strong> – Association historique du département</summary>
        <p><u>Informations générales:</u><br>
        📍 Toulon : 66 avenue Marcel Castié, 83000 Toulon<br>
        📧 courriertoulon@atmp83.fr<br>
        ☎️ 04 94 89 72 72</p>
        <p>📍 Hyères : 11 Bd Matignon<br>
        📧 courrierhyeres@atmp83.fr<br>
        ☎️ 04 94 12 84 30</p>
        <p>📍 Ollioules : Espace Athéna, bât. C<br>
        📧 courrierollioules@atmp83.fr<br>
        ☎️ 04 94 10 92 70</p>
        <p><u>Spécificité</u> : couverture large du territoire varois avec 3 sites fixes.</p>
      </details>
  
      <details><summary><strong>ATV</strong> – Petite structure très réactive</summary>
        <p><u>Informations générales:</u><br>
        📍 6 Boulevard Pierre Toesca, 83000 TOULON<br>
        📧 atvtoulon@gmail.com<br>
        ☎️ 04 94 29 91 38 (9h-12h sauf mercredi)</p>
        <p><u>Spécificité</u> : taille humaine, grande disponibilité, accepte des mesures sur tout le département selon décision judiciaire.</p>
      </details>
  
      <details><summary><strong>MSA 3A</strong> – Pour les ressortissants agricoles</summary>
        <p><u>Informations générales:</u><br>
        📍 Brignoles, Hyères, Toulon<br>
        ☎️ 04 94 60 38 38 ou 04 94 60 38 71</p>
        <p><u>Spécificité</u> : mandataire judiciaire de droit commun pour les assurés MSA, protection sur critères sociaux et professionnels agricoles.</p>
      </details>
  
      <details><summary><strong>CH de Pierrefeu</strong> – Mandataire à vocation hospitalière</summary>
        <p><u>Informations générales:</u><br>
        📍 Quartier Barnenq, 83390 Pierrefeu-du-Var<br>
        📧 tutelles@ch-pierrefeu.fr<br>
        ☎️ 04 94 33 18 11</p>
        <p><u>Responsable</u> : Nathalie MONGE<br>
        📧 nathalie.monge@ch-pierrefeu.fr</p>
        <p><u>Spécificité</u> : exerce pour les patients hospitaliers et personnes résidant en EHPAD (via conventions avec CH / EHPAD > 80 lits).</p>
      </details>

      <details><summary><strong>Liste des mandataires judiciaires individuels</summary>
        <p><u>Lien vers l'annuaire des mandataires judiciares exerçant à titre individuels</u><br>
        📍 <a href="https://chambre-mjpm.fr/annuaire-mandataires" target="_blank" rel="noopener noreferrer"> https://chambre-mjpm.fr/annuaire-mandataires
        </a>
        </p>
        <p><u>Spécificité</u> : Ce lien mène vers la liste de tous les mandataires judiciaires exerçant à titre individuels vous pouvez les trier en fonction de votre commune ou de votre département.</p>
      </details>
    `
    }
  ]
},
  
    {
      label: "Non",
      question: "Bénéficie-t-elle de l'APA ?",
      options: [
        {
          label: "Oui",
          question: "Besoin de réévaluation ou plan APA déjà existant ?",
          options: [
            { label: "Oui", 
              result: `
              <h3>Siège départemental à Draguignan</h3>
              <details>
              <summary><strong>📍Adresse du siège et informations</strong></summary>
              <p><u>Structure :</u> Siège départemental de Draguignant</p>
                <p>
                  📍 412 rue jean Aicard, 83300 Draguignan<br>
                  ☎️ 04 98 10 56 00
                </p>
                <p><u>Spécificité</u> : Un courrier doit être envoyé en précisant votre besoin. Pour la mise en place de cette réévaluation le délais est d'en moyenne 2 mois.</p>
              </details> ` },
            {
              label: "Non",
              question: "La personne a-t-elle besoin d'un maintient à domicile renforcé ?",
              options: [
                {
                  label: "Non",
                  result: `
                    <h3>Service social APA selon votre secteur :</h3>

                    <details>
                      <summary><strong>📍 Provence Verte, Bassin Hyèrois, Cuers, Pierrefeu ou communes voisines</strong></summary>
                      <p><u>Structure :</u> Service social de l’APA – Draguignan</p>
                      <p>
                        📍 59 Rue du Docteur Barbaroux, 83300 DRAGUIGNAN<br>
                        ☎️ 04 94 60 31 60
                      </p>
                      <p><u>Spécificité</u> : référent APA pour le secteur Provence Verte élargi.</p>
                    </details>

                    <details>
                      <summary><strong>📍 Toulon, Solliès, Vallée du Gapeau ou communes voisines</strong></summary>
                      <p><u>Structure :</u> Service social APA – Toulon</p>
                      <p>
                        📍 5 Rue Picot, 83000 TOULON<br>
                        ☎️ 04 94 22 81 00
                      </p>
                      <p><u>Spécificité</u> : référent APA pour le bassin toulonnais et alentours.</p>
                    </details>
                  `
                },
                    {
                      label: "Oui",
                      question: "Dans quelle commune habite la personne ?",
                      selectCommuneCRT: true
                    },
                
              ]
              
            }
          ]
        },
        {
          label: "Non",
          question: "Est-elle suivie par un travailleur social ?",
          options: [
            { label: "Oui", 
              question: "La personne a-t-elle besoin d'un maintient à domicile renforcé ?",
              options: [

                {
                  label: "Oui",
                  question: "Dans quelle commune habite la personne ?",
                  selectCommuneCRT: true
                },
                {
                  label: "Non",
                  result: "Rediriger vers le travailleur social référent"
                }
              ]
            }, 
            {
              label: "Non",
              question: "Souhaite-t-elle le maintien à domicile ?",
              options: [
                {
                  label: "Oui",
                  question: "Est ce que la personne souhaite un maintient à domicile renforcé ?",
                  options: [
                    {
                      label: "Oui",
                      question: "Dans quelle commune habite la personne ?",
                      selectCommuneCRT: true
                    },
                    {
                      label: "Non",
                      question: "Dans quelle commune habite la personne ?",
                      selectCommuneCLIC: true
                    }
                  ]
                  
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
}