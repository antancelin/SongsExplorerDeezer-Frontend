// type import
import { Track } from "../types";

// base URL of our API, stored in the .env file
const API_URL = `${import.meta.env.VITE_API_URL}/graphql`;

// interface for search response
interface SearchReponse {
  data: Track[];
  total: number;
  prev: string | null;
  next: string | null;
}

// interface for a generic type for GraphQL variables
interface GraphQLVariables {
  [key: string]: string | number | undefined;
}

// interface for search parameters
interface SearchParams {
  limit?: number;
  index?: number;
}

// utility function for making GraphQL queries, handles API call and error handling
async function fetchGraphQL<T>(
  query: string,
  variables: GraphQLVariables
): Promise<T> {
  try {
    // Calling GraphQL API with fetch
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // checking if the request was successful
    if (!response.ok) {
      throw new Error("Network error");
    }

    // converting response to JSON
    const json = await response.json();

    // GraphQL error checking
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    // returns the data
    return json.data;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}

// function to search for songs, replaces the old query 'SEARCH_TRACKS'
export async function searchTracks(
  query: string,
  params: SearchParams = {}
): Promise<SearchReponse> {
  const { limit = 50, index = 0 } = params;
  // GraphQL query as string
  const graphqlQuery = `
    query SearchTracks($query: String!, $limit: Int) {
      searchTracks(query: $query, limit: $limit) {
        data {
          id
          title
          duration
          explicit
          artist {
            id
            name
            picture
          }
          album {
            id
            title
            coverSmall
            coverBig
          }
        }
        total
        prev
        next
      }
    }
  `;

  // call our utility function with query and variables
  const response = await fetchGraphQL<{ searchTracks: SearchReponse }>(
    graphqlQuery,
    { query, limit, index }
  );

  // directly returns data from searchTracks
  return response.searchTracks;
}

// function to get song details, replaces old 'GET_TRACK_DETAILS' query
export async function getTrackDetails(trackId: string): Promise<Track> {
  const graphqlQuery = `
      query GetTrackDetails($trackId: ID!) {
        getTrackDetails(trackId: $trackId) {
          id
          title
          duration
          explicit
          artist {
            id
            name
            picture
            biography
          }
          album {
            id
            title
            coverSmall
            coverBig
          }
        }
      }
    `;

  const response = await fetchGraphQL<{ getTrackDetails: Track }>(
    graphqlQuery,
    { trackId }
  );

  return response.getTrackDetails;
}

// custom hook for searching songs with URL handling, this will be used with React Query in our components
export const trackKeys = {
  all: ["tracks"] as const,
  search: (query: string) => [...trackKeys.all, "search", query] as const,
  details: (id: string) => [...trackKeys.all, "details", id] as const,
};
