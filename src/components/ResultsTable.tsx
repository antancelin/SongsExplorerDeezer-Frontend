// packages import
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// interface import
import { Track } from "../types";

// style import
import "../styles/components/ResultsTable.css";

// component props
interface ResultsTableProps {
  tracks: Track[]; // liste des chansons à afficher
}

// type pour le state de tri
type SortKey = "title" | "artist" | "album";
type SortOrder = "asc" | "desc";

const ResultsTable = ({ tracks }: ResultsTableProps) => {
  // import du navigate
  const navigate = useNavigate();

  // states pour le tri
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // fonction de tri des résultats
  const sortedTracks = sortKey
    ? [...tracks].sort((a, b) => {
        let compareA: string;
        let compareB: string;

        // sélection des valeurs à comparer sela la clé de tri
        switch (sortKey) {
          case "artist":
            compareA = a.artist.name.toLowerCase();
            compareB = b.artist.name.toLowerCase();
            break;

          case "album":
            compareA = a.album.title.toLowerCase();
            compareB = b.album.title.toLowerCase();
            break;

          default: // 'title'
            compareA = a.title.toLowerCase();
            compareB = b.title.toLowerCase();
        }

        // application de l'ordre de tri
        return sortOrder === "asc"
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      })
    : tracks; // si aucune tri selectionné, affichage dans l'ordre de l'API

  // gestion du changement de tri
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      // si même colonne, on inverse l'ordre
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // si nouvelle colonne, on trie par ordre ascendant
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // fonction de navigtion au 'clic' sur une chanson
  const handleTrackClick = (trackId: number) => {
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="results-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>
              Titre {sortKey === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("artist")}>
              Artiste{" "}
              {sortKey === "artist" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("album")}>
              Album {sortKey === "album" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            {/* <th>Durée</th> */}
          </tr>
        </thead>
        <tbody>
          {sortedTracks.map((track) => (
            <tr
              key={track.id}
              onClick={() => handleTrackClick(track.id)}
              className="clickable-row"
            >
              <td>{track.title}</td>
              <td>{track.artist.name}</td>
              <td>{track.album.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
