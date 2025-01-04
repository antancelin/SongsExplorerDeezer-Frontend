describe("Page de détails de la chanson", () => {
  beforeEach(() => {
    // Interception correcte de la requête GraphQL
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("GetTrackDetails")) {
        req.reply({
          data: {
            getTrackDetails: {
              id: 717273842,
              title: "Titre de la chanson",
              duration: 240,
              explicit: true,
              album: {
                title: "Titre de l'album",
                coverBig: "https://example.com/cover.jpg",
              },
              artist: {
                name: "Nom de l'artiste",
                picture: "https://example.com/artist.jpg",
                biography: "Ceci est une biographie fictive de l'artiste.",
              },
            },
          },
        });
      }
    }).as("getTrackDetails");

    // Visite de la page avec un ID spécifique
    cy.visit("/track/717273842");
    cy.wait("@getTrackDetails");
  });

  it("devrait afficher correctement les détails de la chanson", () => {
    // Ajout de data-testid pour une sélection plus robuste
    cy.get('[data-testid="track-title"]').should(
      "contain",
      "Titre de la chanson"
    );

    // Vérification du format de la durée (240 secondes = 4:00)
    cy.get('[data-testid="track-duration"]').should("contain", "4:00");

    // Vérification de l'icône explicit
    cy.get('[data-testid="explicit-icon"]').should("exist");
  });

  it("devrait afficher correctement les informations de l'album", () => {
    cy.get('[data-testid="album-title"]').should("contain", "Titre de l'album");

    cy.get('[data-testid="album-cover"]')
      .should("have.attr", "src", "https://example.com/cover.jpg")
      .should("have.attr", "alt", "Titre de l'album");
  });

  it("devrait afficher correctement les informations de l'artiste", () => {
    // Intercepter la requête GraphQL avec les données de trackDetails.json
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("GetTrackDetails")) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getTrackDetails: {
                id: 123,
                title: "Titre de la chanson",
                duration: 240,
                explicit: true,
                album: {
                  title: "Titre de l'album",
                  coverBig: "https://example.com/cover.jpg",
                },
                artist: {
                  name: "Nom de l'artiste",
                  picture: "https://example.com/artist.jpg",
                  biography: "Ceci est une biographie fictive de l'artiste.",
                },
              },
            },
          },
        });
      }
    }).as("getTrackDetailsDelayed");

    // Visiter la page avec l'ID correspondant
    cy.visit("/track/123");

    // Attendre que la requête soit complétée
    cy.wait("@getTrackDetailsDelayed");

    // Vérifier les informations de l'artiste dans la section artist-info
    cy.get(".artist-info").within(() => {
      // Vérifier l'image de profil de l'artiste
      cy.get("img")
        .should("have.attr", "src", "https://example.com/artist.jpg")
        .should("have.attr", "alt", "Nom de l'artiste");

      // Vérifier le nom de l'artiste
      cy.get("h2").should("contain", "Nom de l'artiste");

      // Vérifier la biographie
      cy.get(".artist-biography").within(() => {
        cy.get("h3").should("contain", "Biography");
        cy.get("p").should(
          "contain",
          "Ceci est une biographie fictive de l'artiste."
        );
      });
    });
  });

  it("devrait gérer la navigation", () => {
    // On simule d'abord une page précédente
    cy.visit("/search");
    cy.visit("/track/717273842");
    cy.wait("@getTrackDetails");

    cy.get('[data-testid="back-button"]').click();
    cy.url().should("include", "/search");
  });

  it("devrait gérer les erreurs de chargement", () => {
    // Simulation d'une erreur GraphQL
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("GetTrackDetails")) {
        req.reply({
          errors: [
            {
              message: "Erreur lors de la récupération des données",
            },
          ],
        });
      }
    }).as("getTrackError");

    cy.visit("/track/999");
    cy.wait("@getTrackError");
    cy.get('[data-testid="error-message"]').should("contain", "Erreur");
  });

  it("devrait afficher le skeleton loader pendant le chargement", () => {
    // Simuler la réponse GraphQL avec une structure qui correspond exactement à votre API
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("GetTrackDetails")) {
        // Important : La réponse doit avoir exactement cette structure pour GraphQL
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getTrackDetails: {
                id: "717273842", // Notez que l'ID est une string comme dans vos params
                title: "Titre de la chanson",
                duration: 240,
                explicit: true,
                album: {
                  title: "Titre de l'album",
                  coverBig: "https://example.com/cover.jpg",
                },
                artist: {
                  name: "Nom de l'artiste",
                  picture: "https://example.com/artist.jpg",
                  biography: "Ceci est une biographie fictive de l'artiste.",
                },
              },
            },
          },
          headers: {
            "content-type": "application/json",
          },
        });
      }
    }).as("getTrackDetailsDelayed");

    // Visiter la page avec le même ID que dans la réponse mockée
    cy.visit("/track/717273842");

    // D'abord, vérifier que le skeleton est affiché
    cy.get('[data-testid="track-skeleton"]').should("exist");

    // Attendre que la requête GraphQL soit complétée
    cy.wait("@getTrackDetailsDelayed")
      .its("response.body.data.getTrackDetails")
      .should("exist");

    // Attendre que le contenu soit chargé en vérifiant un élément qui n'existe que dans le contenu chargé
    cy.get('[data-testid="track-title"]', { timeout: 10000 })
      .should("exist")
      .and("contain", "Titre de la chanson")
      .then(() => {
        // Une fois que nous avons confirmé que le contenu est chargé,
        // nous pouvons vérifier que le skeleton a disparu
        cy.get('[data-testid="track-skeleton"]').should("not.exist");
      });
  });
});
