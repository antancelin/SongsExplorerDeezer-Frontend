// Cette interface définit la structure d'une piste/chanson
// Chaque propriété est typée, donc TypeScript nous alertera si on essaie d'utiliser
// un type incorrect (par exemple, mettre un string à la place d'un number pour l'id)
export interface Track {
  id: number; // L'identifiant unique de la chanson
  title: string; // Le titre de la chanson
  duration: number; // La durée en secondes
  explicit: boolean; // paroles explicit ou non
  artist: Artist; // Les informations de l'artiste (voir l'interface Artist ci-dessous)
  album: Album; // Les informations de l'album (voir l'interface Album ci-dessous)
}

// Interface pour les données d'un artiste
// Quand on recevra les données de l'API Deezer, on s'attend à recevoir ces informations
export interface Artist {
  id: number; // L'identifiant unique de l'artiste
  name: string; // Le nom de l'artiste
  picture: string; // L'URL de la photo de l'artiste
  biography?: string; // Biographie (depuis Discogs) - "?" car optionnel, peut être non présente immédiatement
  discogsId?: number; // ID Discogs de l'artiste - "?" car optionnel, utile pour faire correspondre les éléments entre l'api Deezer et Discogs
}

// Interface pour les données d'un album
export interface Album {
  id: number; // L'identifiant unique de l'album
  title: string; // Le titre de l'album
  coverSmall: string; // L'URL de la pochette de l'album (petite)
  coverBig: string; // L'URL de la pochette de l'album (moyenne)
}

// Interface pour la réponse de l'API lors d'une recherche
// Cette structure nous permet de gérer la pagination des résultats
export interface SearchResponse {
  data: Track[]; // Un tableau de chansons
  total: number; // Le nombre total de résultats
  prev?: string; // URL optionnelle (?) pour la page précédente
  next?: string; // URL optionnelle (?) pour la page suivante
}
