/// <reference types="cypress" />
// Track Page Tests
describe("Song details page", () => {
  beforeEach(() => {
    // intercept GraphQL query with exact expected structure
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

    // visiting the page with a specific ID
    cy.visit("/track/717273842");

    // wait for GraphQL API response
    cy.wait("@getTrackDetails");
  });

  it("should display song details correctly", () => {
    cy.get('[data-testid="track-title"]').should(
      "contain",
      "Titre de la chanson"
    );

    // Checking the duration format (240 seconds = 4:00)
    cy.get('[data-testid="track-duration"]').should("contain", "4:00");

    // checking the explicit icon
    cy.get('[data-testid="explicit-icon"]').should("exist");
  });

  it("should display album information correctly", () => {
    cy.get('[data-testid="album-title"]').should("contain", "Titre de l'album");

    cy.get('[data-testid="album-cover"]')
      .should("have.attr", "src", "https://example.com/cover.jpg")
      .should("have.attr", "alt", "Titre de l'album");
  });

  it("should display artist information correctly", () => {
    // intercept GraphQL query with data from trackDetails.json
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

    // visit the page with the matching ID
    cy.visit("/track/123");

    // wait for GraphQL API response
    cy.wait("@getTrackDetailsDelayed");

    // check artist information in the artist-info section
    cy.get(".artist-info").within(() => {
      // check artist profile picture
      cy.get("img")
        .should("have.attr", "src", "https://example.com/artist.jpg")
        .should("have.attr", "alt", "Nom de l'artiste");

      // check artist name
      cy.get("h2").should("contain", "Nom de l'artiste");

      // check Biography
      cy.get(".artist-biography").within(() => {
        cy.get("h3").should("contain", "Biography");
        cy.get("p").should(
          "contain",
          "Ceci est une biographie fictive de l'artiste."
        );
      });
    });
  });

  it("should handle navigation", () => {
    // first simulate a previous page
    cy.visit("/search");
    cy.visit("/track/717273842");
    cy.wait("@getTrackDetails");

    cy.get('[data-testid="back-button"]').click();
    cy.url().should("include", "/search");
  });

  it("should handle loading errors", () => {
    // simulating a GraphQL error
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

  it("should show skeleton loader while loading", () => {
    // simulate the GraphQL response with a structure that matches your API exactly
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("GetTrackDetails")) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getTrackDetails: {
                id: "717273842",
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

    // visit the page with the same ID as in the mocked response
    cy.visit("/track/717273842");

    // check that the skeleton is displayed
    cy.get('[data-testid="track-skeleton"]').should("exist");

    // wait for GraphQL query to complete
    cy.wait("@getTrackDetailsDelayed")
      .its("response.body.data.getTrackDetails")
      .should("exist");

    // wait for content to load by checking for an element that only exists in the loaded content
    cy.get('[data-testid="track-title"]', { timeout: 10000 })
      .should("exist")
      .and("contain", "Titre de la chanson")
      .then(() => {
        // UOnce we have confirmed that the content is loaded, we can verify that the skeleton is gone
        cy.get('[data-testid="track-skeleton"]').should("not.exist");
      });
  });
});
