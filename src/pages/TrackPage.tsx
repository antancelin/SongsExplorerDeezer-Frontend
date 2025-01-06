// packages import
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrackDetails } from "../services/api";

// component import
import TrackSkeleton from "../components/TrackSkeleton";

// style import
import "../styles/pages/TrackPage.css";

// icons import
import { MdExplicit } from "react-icons/md";

// interface for optional props
interface TrackDetailsProps {
  className?: string;
}

const TrackPage = ({ className = "" }: TrackDetailsProps) => {
  // navigation and ID retrieval
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: track,
    isLoading,
    error,
  } = useQuery({
    // unique key for this query
    queryKey: ["track", id],

    // function that retrieves data
    queryFn: () => getTrackDetails(id!),

    // don't run query if no ID
    enabled: !!id,

    // keep data cached for 5 minutes
    staleTime: 1000 * 60 * 5,
  });

  // loading and error management
  if (isLoading) {
    return <TrackSkeleton />;
  }

  if (error) {
    return (
      <div data-testid="error-message" className="error-container">
        Error : {(error as Error).message}
      </div>
    );
  }

  if (!track) {
    return <div>Song not found</div>;
  }

  // function to navigate back
  const handleBack = () => {
    navigate(-1);
  };

  // function to format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`track-details ${className}`}>
      <button
        data-testid="back-button"
        onClick={handleBack}
        className="back-button"
      >
        ← Retour
      </button>

      {/* left column - song info */}
      <div className="track-header">
        <div className="track-title">
          <h1 data-testid="track-title">{track.title}</h1>
          {track.explicit && (
            <MdExplicit data-testid="explicit-icon" className="explicit-icon" />
          )}
        </div>
        <p data-testid="track-duration">{formatDuration(track.duration)}</p>
        <div className="album-info">
          <h3 data-testid="album-title">{track.album.title}</h3>
          <img
            data-testid="album-cover"
            src={track.album.coverBig}
            alt={track.album.title}
          />
        </div>
      </div>

      {/* right column - artist info */}
      <div className="artist-info">
        <img
          data-testid="artist-picture"
          src={track.artist.picture}
          alt={track.artist.name}
        />
        <h2 data-testid="artist-name">{track.artist.name}</h2>

        {track.artist.biography && (
          <div data-testid="artist-biography" className="artist-biography">
            <h3 data-testid="biography-title">Biography</h3>
            <p data-testid="biography-content">{track.artist.biography}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
