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

// interface pour les props optionnelles
interface TrackDetailsProps {
  className?: string;
}

const TrackPage = ({ className = "" }: TrackDetailsProps) => {
  // Navigation et récupération de l'ID
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: track,
    isLoading,
    error,
  } = useQuery({
    // Clé unique pour cette requête
    queryKey: ["track", id],

    // Fonction qui récupère les données
    queryFn: () => getTrackDetails(id!),

    // Ne pas exécuter la requête si pas d'ID
    enabled: !!id,

    // Garder les données en cache pendant 5 minutes
    staleTime: 1000 * 60 * 5,
  });

  // Gestion du chargement et des erreurs
  if (isLoading) {
    return <TrackSkeleton />;
  }

  if (error) {
    return (
      <div data-testid="error-message" className="error-container">
        Erreur : {(error as Error).message}
      </div>
    );
  }

  if (!track) {
    return <div>Chanson non trouvée</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

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

      {/* Colonne gauche - Infos de la chanson */}
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

      {/* Colonne droite - Infos de l'artiste */}
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
