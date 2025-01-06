/// <reference types="cypress" />
// Search Page Tests
describe("Home", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays title and logo correctly", () => {
    cy.get('[data-testid="app-logo"]')
      .should("have.attr", "src")
      .and("include", "deezer-logo.png");
    cy.get('[data-testid="app-title"]').should("have.text", "DEEZER EXPLORER");
  });

  it("display search bar", () => {
    cy.get('[data-testid="search-input"]').should("be.visible");
    cy.get('[data-testid="search-input"]').should(
      "have.attr",
      "placeholder",
      "Rechercher une chanson..."
    );
  });

  it("allows you to search for a song", () => {
    // intercept GraphQL query with exact expected structure
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: [
                  {
                    id: 1,
                    title: "Nikes",
                    duration: 180,
                    explicit: false,
                    artist: {
                      id: 1,
                      name: "Frank Ocean",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 1,
                      title: "Blonde",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                ],
                total: 1,
                prev: null,
                next: null,
              },
            },
          },
        });
      }
    }).as("searchTracksQuery");

    // perform the search
    const searchTerm = "Nikes";
    cy.get('[data-testid="search-input"]').type(searchTerm);
    cy.get('[data-testid="search-input"]').should("have.value", searchTerm);

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // check that the results table is displayed
    cy.get('[data-testid="results-table"]').should("exist");
  });

  it("allows you to sort the results", () => {
    // intercept GraphQL query with multiple results to test sorting
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: [
                  {
                    id: 1,
                    title: "Apples",
                    duration: 180,
                    explicit: false,
                    artist: {
                      id: 1,
                      name: "Artist A",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 1,
                      title: "Album A",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                  {
                    id: 2,
                    title: "Bananas",
                    duration: 200,
                    explicit: true,
                    artist: {
                      id: 2,
                      name: "Artist B",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 2,
                      title: "Album B",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                ],
                total: 2,
                prev: null,
                next: null,
              },
            },
          },
        });
      }
    }).as("searchTracksQuery");

    // perform the search
    cy.get('[data-testid="search-input"]').type("Nikes");

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // test sorting functionality
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↑");
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↓");
  });

  it("allows you to reset the sorting", () => {
    // intercept GraphQL query with test data
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: [
                  {
                    id: 1,
                    title: "Apples",
                    duration: 180,
                    explicit: false,
                    artist: {
                      id: 1,
                      name: "Artist A",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 1,
                      title: "Album A",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                  {
                    id: 2,
                    title: "Bananas",
                    duration: 200,
                    explicit: true,
                    artist: {
                      id: 2,
                      name: "Artist B",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 2,
                      title: "Album B",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                ],
                total: 2,
                prev: null,
                next: null,
              },
            },
          },
        });
      }
    }).as("searchTracksQuery");

    // perform the search
    cy.get('[data-testid="search-input"]').type("Nikes");

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // array is loaded we can test resetting the sort
    cy.get('[data-testid="sort-title"]').click();
    cy.get('[data-testid="reset-title-sort"]').click();
    cy.get('[data-testid="title-sort-arrow"]').should("contain", "↕");
  });

  it("correctly displays the duration column", () => {
    // intercept the GraphQL query to guarantee results
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

    // perform the search to display the table
    cy.get('[data-testid="search-input"]').type("test");

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // table is displayed, check the duration column
    cy.get('[data-testid="duration-header"]').should("be.visible");
    cy.get('[data-testid="duration-icon"]').should("exist");
  });

  it("correctly handles different duration formats", () => {
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

    // perform the search
    cy.get('[data-testid="search-input"]').type("test");

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // check different duration formats
    cy.get('[data-testid="track-duration-1"]').should("contain", "0:45");
    cy.get('[data-testid="track-duration-2"]').should("contain", "3:00");
    cy.get('[data-testid="track-duration-3"]').should("contain", "60:00");
  });

  it("retains search after page reload", () => {
    cy.get('[data-testid="search-input"]').type("Daft Punk");
    cy.wait(1000);
    cy.reload();
    cy.get('[data-testid="search-input"]').should("have.value", "Daft Punk");
  });

  it("load more results when scrolling", () => {
    // first page of results
    cy.intercept("POST", "/graphql", (req) => {
      if (
        req.body.query.includes("SearchTracks") &&
        !req.body.variables.index
      ) {
        // answer for the first page
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: Array.from({ length: 20 }, (_, i) => ({
                  id: i + 1,
                  title: `Pop Song ${i + 1}`,
                  duration: 180,
                  explicit: false,
                  artist: {
                    id: i + 1,
                    name: `Artist ${i + 1}`,
                    picture: "artist-picture.jpg",
                  },
                  album: {
                    id: i + 1,
                    title: `Album ${i + 1}`,
                    coverSmall: "album-cover-small.jpg",
                    coverBig: "album-cover-big.jpg",
                  },
                })),
                total: 40,
                prev: null,
                next: "nextpage",
              },
            },
          },
        });
      }
    }).as("initialSearch");

    // next page of results
    cy.intercept("POST", "/graphql", (req) => {
      if (
        req.body.query.includes("SearchTracks") &&
        req.body.variables.index > 0
      ) {
        // answer for next page
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: Array.from({ length: 20 }, (_, i) => ({
                  id: i + 21,
                  title: `Pop Song ${i + 21}`,
                  duration: 180,
                  explicit: false,
                  artist: {
                    id: i + 21,
                    name: `Artist ${i + 21}`,
                    picture: "artist-picture.jpg",
                  },
                  album: {
                    id: i + 21,
                    title: `Album ${i + 21}`,
                    coverSmall: "album-cover-small.jpg",
                    coverBig: "album-cover-big.jpg",
                  },
                })),
                total: 40,
                prev: "prevpage",
                next: null,
              },
            },
          },
        });
      }
    }).as("nextPageSearch");

    // perform the initial search
    cy.get('[data-testid="search-input"]').type("Pop");

    // wait for initial loading
    cy.wait("@initialSearch");

    // check the initial number of lines
    cy.get('[data-testid^="track-row-"]').should("have.length", 20);

    // trigger scroll
    cy.scrollTo("bottom");

    // wait for the next page to load
    cy.wait("@nextPageSearch");

    // Check if more results after scrolling
    cy.get('[data-testid^="track-row-"]').should("have.length", 40);
  });

  it("navigates to a song's detail page when clicked", () => {
    // intercept GraphQL search query
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("SearchTracks")) {
        req.reply({
          body: {
            data: {
              searchTracks: {
                data: [
                  {
                    id: 123,
                    title: "Nikes",
                    duration: 180,
                    explicit: false,
                    artist: {
                      id: 1,
                      name: "Frank Ocean",
                      picture: "artist-picture.jpg",
                    },
                    album: {
                      id: 1,
                      title: "Blonde",
                      coverSmall: "album-cover-small.jpg",
                      coverBig: "album-cover-big.jpg",
                    },
                  },
                ],
                total: 1,
                prev: null,
                next: null,
              },
            },
          },
        });
      }
    }).as("searchTracksQuery");

    // perform the search
    cy.get('[data-testid="search-input"]').type("Nikes");

    // wait for GraphQL API response
    cy.wait("@searchTracksQuery");

    // check that the line is present and click on it
    cy.get('[data-testid="track-row-123"]').click();

    // verify that the URL has changed to include the track ID
    cy.url().should("include", "/track/123");
  });

  it("handles error case", () => {
    cy.intercept("POST", "**/graphql**", { statusCode: 500 }).as("searchError");
    cy.get('[data-testid="search-input"]').type("Error Test");
    cy.wait("@searchError");
    cy.get('[data-testid="error-message"]').should("be.visible");
  });
});
