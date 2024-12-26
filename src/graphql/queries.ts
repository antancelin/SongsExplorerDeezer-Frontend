// packages import
import { gql } from "@apollo/client";

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
