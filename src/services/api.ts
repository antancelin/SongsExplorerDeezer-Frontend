// type import
import { Track } from "../types";

// URL de base de notre API, stockée dans le fichier .env
const API_URL = `${import.meta.env.VITE_API_URL}/graphql`;

// interface pour la réponse de recherche
interface SearchReponse {
  data: Track[];
  total: number;
  prev: string | null;
  next: string | null;
}

// interface pour un type générique pour les variables GraphQL
interface GraphQLVariables {
  [key: string]: string | number | undefined;
}

interface SearchParams {
  limit?: number;
  index?: number;
}

// fonction utilitaire pour faire des requêtes GraphQL, gère l'appel à l'API et la gestion d'erreurs
async function fetchGraphQL<T>(
  query: string,
  variables: GraphQLVariables
): Promise<T> {
  try {
    // appel à l'API GraphQL avec fetch
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

    // vérification si la requête a réussi
    if (!response.ok) {
      throw new Error("Erreur réseau");
    }

    // conversion de la réponse en JSON
    const json = await response.json();

    // vérification des erreurs GraphQL
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    // retourne les données
    return json.data;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error);
    throw error;
  }
}

// fonction pour rechercher des chansons, remplace l'ancienne requête 'SEARCH_TRACKS'
export async function searchTracks(
  query: string,
  params: SearchParams = {}
): Promise<SearchReponse> {
  const { limit = 50, index = 0 } = params;
  // la requête GraphQL en tant que string
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

  // appel à notre fonction utilitaire avec la requête et les variables
  const response = await fetchGraphQL<{ searchTracks: SearchReponse }>(
    graphqlQuery,
    { query, limit, index }
  );

  // retourne directement les données de searchTracks
  return response.searchTracks;
}

// fonction pour obtenir les détails d'une chanson, remplace l'ancienne requête 'GET_TRACK_DETAILS'
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

// hook personnalisé pour la recherche de chansons avec gestion de l'URL, ceci sera utilisé avec React Query dans nos composants
export const trackKeys = {
  all: ["tracks"] as const,
  search: (query: string) => [...trackKeys.all, "search", query] as const,
  details: (id: string) => [...trackKeys.all, "details", id] as const,
};
