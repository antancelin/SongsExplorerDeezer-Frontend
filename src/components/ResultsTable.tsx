// packages import
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// interface import
import { Track } from "../types";

// style import
import "../styles/components/ResultsTable.css";

// icons import
import { MdExplicit } from "react-icons/md";
import { CiTimer } from "react-icons/ci";

// component props
interface ResultsTableProps {
  tracks: Track[]; // liste des chansons à afficher
}

// type import
import { SortKey, SortOrder } from "../types";

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

  // fonction utilitaire pour formater la durée (sec) en minutes:secondes
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Fonction de réinitialisation
  const resetSort = () => {
    setSortKey(null);
    setSortOrder("asc");
  };

  return (
    <div className="results-table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")} className="sortable-header">
              <div className="header-container">
                <span className="header-content">
                  Title
                  <span className="sort-arrow">
                    {sortKey === "title"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "title" && (
                  <button onClick={resetSort} className="reset-sort-button">
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th
              onClick={() => handleSort("artist")}
              className="sortable-header"
            >
              <div className="header-container">
                <span className="header-content">
                  Artist
                  <span className="sort-arrow">
                    {sortKey === "artist"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "artist" && (
                  <button onClick={resetSort} className="reset-sort-button">
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th onClick={() => handleSort("album")} className="sortable-header">
              <div className="header-container">
                <span className="header-content">
                  Album
                  <span className="sort-arrow">
                    {sortKey === "album"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "album" && (
                  <button onClick={resetSort} className="reset-sort-button">
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th className="duration-icon">
              <div className="timer-reset-container">
                <CiTimer />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTracks.map((track) => (
            <tr
              key={track.id}
              onClick={() => handleTrackClick(track.id)}
              className="clickable-row"
            >
              <td className="track-name">
                <img src={track.album.coverSmall} />
                {track.title} {track.explicit && <MdExplicit />}
              </td>
              <td>{track.artist.name}</td>
              <td>{track.album.title}</td>
              <td>{formatDuration(track.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
