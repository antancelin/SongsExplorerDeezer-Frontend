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
  tracks: Track[]; // list of songs to display
}

// type import
import { SortKey, SortOrder } from "../types";

const ResultsTable = ({ tracks }: ResultsTableProps) => {
  // navigate import
  const navigate = useNavigate();

  // states  for sorting
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // results sorting function
  const sortedTracks = sortKey
    ? [...tracks].sort((a, b) => {
        let compareA: string;
        let compareB: string;

        // selection of values ​​to compare according to the sort key
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

        // applying sort order
        return sortOrder === "asc"
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      })
    : tracks; // if no sorting selected, display in API order

  // sort change management
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      // if same column, we reverse the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // if new column, we sort in ascending order
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // navigation function when 'clicking' on a song
  const handleTrackClick = (trackId: number) => {
    navigate(`/track/${trackId}`);
  };

  // utility function to format duration (sec) in minutes:seconds
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // reset sort function
  const resetSort = () => {
    setSortKey(null);
    setSortOrder("asc");
  };

  return (
    <div data-testid="results-table" className="results-table">
      <table>
        <thead>
          <tr>
            <th
              data-testid="sort-title"
              onClick={() => handleSort("title")}
              className="sortable-header"
            >
              <div className="header-container">
                <span className="header-content">
                  Title
                  <span data-testid="title-sort-arrow" className="sort-arrow">
                    {sortKey === "title"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "title" && (
                  <button
                    data-testid="reset-title-sort"
                    onClick={resetSort}
                    className="reset-sort-button"
                  >
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th
              data-testid="sort-artist"
              onClick={() => handleSort("artist")}
              className="sortable-header"
            >
              <div className="header-container">
                <span className="header-content">
                  Artist
                  <span data-testid="artist-sort-arrow" className="sort-arrow">
                    {sortKey === "artist"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "artist" && (
                  <button
                    data-testid="reset-artist-sort"
                    onClick={resetSort}
                    className="reset-sort-button"
                  >
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th
              data-testid="sort-album"
              onClick={() => handleSort("album")}
              className="sortable-header"
            >
              <div className="header-container">
                <span className="header-content">
                  Album
                  <span data-testid="album-sort-arrow" className="sort-arrow">
                    {sortKey === "album"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </span>
                {sortKey === "album" && (
                  <button
                    data-testid="reset-album-sort"
                    onClick={resetSort}
                    className="reset-sort-button"
                  >
                    Reset
                  </button>
                )}
              </div>
            </th>
            <th data-testid="duration-header" className="duration-icon">
              <div className="timer-reset-container">
                <CiTimer data-testid="duration-icon" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTracks.map((track) => (
            <tr
              data-testid={`track-row-${track.id}`}
              key={track.id}
              onClick={() => handleTrackClick(track.id)}
              className="clickable-row"
            >
              <td className="track-name">
                <img
                  data-testid={`track-cover-${track.id}`}
                  src={track.album.coverSmall}
                  alt={track.title}
                />
                <div className="track-title">
                  <span className="title-text">
                    {track.title}
                    {track.explicit && (
                      <MdExplicit
                        data-testid={`track-explicit-${track.id}`}
                        size={18}
                        style={{ marginLeft: "4px" }}
                      />
                    )}
                  </span>
                </div>
              </td>
              <td data-testid={`track-artist-${track.id}`}>
                {track.artist.name}
              </td>
              <td data-testid={`track-album-${track.id}`}>
                {track.album.title}
              </td>
              <td data-testid={`track-duration-${track.id}`}>
                {formatDuration(track.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
