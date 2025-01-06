// track interface
export interface Track {
  id: number;
  title: string;
  duration: number;
  explicit: boolean;
  artist: Artist;
  album: Album;
}

// artist interface
export interface Artist {
  id: number;
  name: string;
  picture: string;
  biography?: string;
  discogsId?: number;
}

// album interface
export interface Album {
  id: number;
  title: string;
  coverSmall: string;
  coverBig: string;
}

// interface for API response when searching
export interface SearchResponse {
  data: Track[];
  total: number;
  prev?: string;
  next?: string;
}

// type for sort state
export type SortKey = "title" | "artist" | "album";
export type SortOrder = "asc" | "desc";
