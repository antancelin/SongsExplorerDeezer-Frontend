// describe("Home", () => {
//   beforeEach(() => {
//     cy.visit("/"); // visite la page d'accueil avant chaque test
//   });

//   it("affiche le titre et le logo correctement", () => {
//     cy.get(".title img")
//       .should("have.attr", "src")
//       .and("include", "deezer-logo.png");
//     cy.get(".title h1").should("have.text", "DEEZER EXPLORER");
//   });

//   it("affiche la barre de recherche", () => {
//     cy.get(".search-bar input").should("be.visible");
//     cy.get(".search-bar input").should(
//       "have.attr",
//       "placeholder",
//       "Rechercher une chanson..."
//     );
//   });

//   it("permet de rechercher une chanson", () => {
//     const searchTerm = "Nikes";
//     cy.get(".search-bar input").type(searchTerm);
//     cy.get(".search-bar input").should("have.value", searchTerm);
//     // attendre que la recherche soir effectuée (debounce de 800ms)
//     cy.wait(1000);
//     cy.get(".results-table").should("exist");
//   });

//   it("permet de trier les résultats", () => {
//     cy.get(".search-bar input").type("Nikes");
//     cy.wait(1000);
//     cy.get("th.sortable-header").first().click(); // cliquer sur le header 'title'
//     cy.get("th.sortable-header")
//       .first()
//       .find(".sort-arrow")
//       .should("contain", "↑");
//     cy.get("th.sortable-header").first().click(); // cliquer à nouveau pour inverser l'ordre
//     cy.get("th.sortable-header")
//       .first()
//       .find(".sort-arrow")
//       .should("contain", "↓");
//   });

//   it("permet de réinitialiser le tri", () => {
//     cy.get(".search-bar input").type("Nikes");
//     cy.wait(1000);
//     cy.get("th.sortable-header").first().click(); // trier par titre
//     cy.get(".reset-sort-button").first().click();
//     cy.get("th.sortable-header")
//       .first()
//       .find(".sort-arrow")
//       .should("contain", "↕");
//   });

//   it("conserve la recherche après rechargement de la page", () => {
//     cy.get(".search-bar input").type("Daft Punk");
//     cy.wait(1000); // attendre le debounce
//     cy.reload();
//     cy.get(".search-bar input").should("have.value", "Daft Punk");
//   });

//   it("charge plus de résultats lors du défilement", () => {
//     cy.get(".search-bar input").type("Pop");
//     cy.wait(1000);
//     cy.get(".results-table tr")
//       .its("length")
//       .then((initialLength) => {
//         cy.scrollTo("bottom");
//         cy.wait(1000);
//         cy.get(".results-table tr")
//           .its("length")
//           .should("be.gt", initialLength);
//       });
//   });

//   it("navigue vers la page de détail d'une chanson lors du clic", () => {
//     cy.get(".search-bar input").type("Nikes");
//     cy.wait(1000);
//     cy.get(".clickable-row").first().click();
//     cy.url().should("include", "/track/");
//   });

//   it("gère le cas d'erreur", () => {
//     // simulation d'une erreur réseau
//     cy.intercept("POST", "**/graphql**", { statusCode: 500 }).as("searchError");
//     cy.get(".search-bar input").type("Error Test");
//     cy.wait("@searchError");
//     cy.contains("Erreur :").should("be.visible");
//   });
// });

describe("Home", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("affiche le titre et le logo correctement", () => {
    cy.get('[data-testid="app-logo"]')
      .should("have.attr", "src")
      .and("include", "deezer-logo.png");
    cy.get('[data-testid="app-title"]').should("have.text", "DEEZER EXPLORER");
  });

  it("affiche la barre de recherche", () => {
    cy.get('[data-testid="search-input"]').should("be.visible");
    cy.get('[data-testid="search-input"]').should(
      "have.attr",
      "placeholder",
      "Rechercher une chanson..."
    );
  });

  it("permet de rechercher une chanson", () => {
    const searchTerm = "Nikes";
    cy.get('[data-testid="search-input"]').type(searchTerm);
    cy.get('[data-testid="search-input"]').should("have.value", searchTerm);
    // attendre que la recherche soit effectuée (debounce de 800ms)
    cy.wait(1000);
    cy.get('[data-testid="results-table"]').should("exist");
  });

  it("permet de trier les résultats", () => {
    cy.get('[data-testid="search-input"]').type("Nikes");
    cy.wait(1000);
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↑");
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↓");
  });

  it("permet de réinitialiser le tri", () => {
    cy.get('[data-testid="search-input"]').type("Nikes");
    cy.wait(1000);
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="reset-title-sort"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↕");
  });

  it("affiche correctement la colonne durée", () => {
    // D'abord, intercepter la requête GraphQL pour garantir des résultats
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          data: {
            searchTracks: {
              data: [
                {
                  id: 1,
                  title: "Test Song",
                  duration: 180,
                  artist: { name: "Test Artist" },
                  album: {
                    title: "Test Album",
                    coverSmall: "test-cover.jpg",
                  },
                },
              ],
            },
          },
        });
      }
    }).as("searchTracksQuery");

    // Effectuer une recherche pour afficher le tableau
    cy.get('[data-testid="search-input"]').type("test");

    // Attendre que la requête soit complétée
    cy.wait("@searchTracksQuery");

    // Maintenant que le tableau est affiché, vérifier la colonne durée
    cy.get('[data-testid="duration-header"]').should("be.visible");
    cy.get('[data-testid="duration-icon"]').should("exist");
  });

  it("gère correctement différents formats de durée", () => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          data: {
            searchTracks: {
              data: [
                {
                  id: 1,
                  title: "Court",
                  duration: 45, // 0:45
                  artist: { name: "Test Artist" },
                  album: { title: "Test Album", coverSmall: "test-cover.jpg" },
                },
                {
                  id: 2,
                  title: "Moyen",
                  duration: 180, // 3:00
                  artist: { name: "Test Artist" },
                  album: { title: "Test Album", coverSmall: "test-cover.jpg" },
                },
                {
                  id: 3,
                  title: "Long",
                  duration: 3600, // 60:00
                  artist: { name: "Test Artist" },
                  album: { title: "Test Album", coverSmall: "test-cover.jpg" },
                },
              ],
            },
          },
        });
      }
    }).as("searchTracksQuery");

    cy.get('[data-testid="search-input"]').type("test");
    cy.wait("@searchTracksQuery");

    // Vérifier les différents formats de durée
    cy.get('[data-testid="track-duration-1"]').should("contain", "0:45");
    cy.get('[data-testid="track-duration-2"]').should("contain", "3:00");
    cy.get('[data-testid="track-duration-3"]').should("contain", "60:00");
  });

  it("conserve la recherche après rechargement de la page", () => {
    cy.get('[data-testid="search-input"]').type("Daft Punk");
    cy.wait(1000);
    cy.reload();
    cy.get('[data-testid="search-input"]').should("have.value", "Daft Punk");
  });

  it("charge plus de résultats lors du défilement", () => {
    cy.get('[data-testid="search-input"]').type("Pop");
    cy.wait(1000);
    cy.get('[data-testid^="track-row-"]')
      .its("length")
      .then((initialLength) => {
        cy.scrollTo("bottom");
        cy.wait(1000);
        cy.get('[data-testid^="track-row-"]')
          .its("length")
          .should("be.gt", initialLength);
      });
  });

  it("navigue vers la page de détail d'une chanson lors du clic", () => {
    cy.get('[data-testid="search-input"]').type("Nikes");
    cy.wait(1000);
    cy.get('[data-testid^="track-row-"]').first().click();
    cy.url().should("include", "/track/");
  });

  it("gère le cas d'erreur", () => {
    cy.intercept("POST", "**/graphql**", { statusCode: 500 }).as("searchError");
    cy.get('[data-testid="search-input"]').type("Error Test");
    cy.wait("@searchError");
    cy.get('[data-testid="error-message"]').should("be.visible");
  });
});
