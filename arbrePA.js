const arbrePASocial = {
  question: "La personne a-t-elle un mandataire judiciaire ?",
  options: [
    {
      label: "Oui",
      result: "Orienter vers UDAF / ATIMP / CH Henri Guérin, etc."
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
                  question: "La personne habite-t-elle dans le secteur du CLIC ?",
                  options: [
                    {
                      label: "Oui",
                      result: "Rediriger vers un CLIC"
                    },
                    {
                      label: "Non",
                      result: "Rediriger vers le CCAS ou l'UTS selon le secteur"
                    }
                  ]
                },
                {
                  label: "Non",
                  result: "Rediriger vers le CCAS ou l'UTS selon le secteur"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
