// packages import
import { gql } from "@apollo/client";

// requête pour l'affichage des chansons
export const SEARCH_TRACKS = gql`
  query SearchTracks($query: String!, $limit: Int) {
    searchTracks(query: $query, limit: $limit) {
      data {
        id
        title
        duration
        artist {
          id
          name
          picture
        }
        album {
          id
          title
          cover
        }
      }
      total
      prev
      next
    }
  }
`;

// requête pour l'affichage des détails d'une chanson
export const GET_TRACK_DETAILS = gql`
  query GetTrackDetails($trackId: ID!) {
    getTrackDetails(trackId: $trackId) {
      id
      title
      duration
      artist {
        id
        name
        picture
        biography
      }
      album {
        id
        title
        cover
      }
    }
  }
`;
