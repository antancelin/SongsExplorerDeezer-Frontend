// packages import
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrackDetails } from "../services/api";

// component import
import Spinner from "../components/Spinner";

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
    return <Spinner />;
  }

  if (error) {
    return <div>Erreur : {(error as Error).message}</div>;
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
      <button onClick={handleBack} className="back-button">
        ← Retour
      </button>

      {/* Colonne gauche - Infos de la chanson */}
      <div className="track-header">
        <div className="track-title">
          <h1>{track.title}</h1>
          {track.explicit && <MdExplicit className="explicit-icon" />}
        </div>
        <p>{formatDuration(track.duration)}</p>
        <div className="album-info">
          <h3>{track.album.title}</h3>
          <img src={track.album.coverBig} alt={track.album.title} />
        </div>
      </div>

      {/* Colonne droite - Infos de l'artiste */}
      <div className="artist-info">
        <img src={track.artist.picture} alt={track.artist.name} />
        <h2>{track.artist.name}</h2>

        {track.artist.biography && (
          <div className="artist-biography">
            <h3>Biography</h3>
            <p>{track.artist.biography}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
