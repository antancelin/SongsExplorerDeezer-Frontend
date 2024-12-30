// packages import
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TRACK_DETAILS } from "../graphql/queries";

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
  // import du navigate
  const navigate = useNavigate();

  // récupération de l'ID depuis l'URL
  const { id } = useParams<{ id: string }>();

  // requête GraphQL pour obtenir les détails d'une chanson
  const { loading, error, data } = useQuery(GET_TRACK_DETAILS, {
    variables: { trackId: id },
    skip: !id,
  });

  // gestion du chargement
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Erreur : {error.message}</div>;
  }
  if (!data?.getTrackDetails) {
    return <div>Chanson non trouvée</div>;
  }

  // fonction pour retourner à la page précédente
  const handleBack = () => {
    navigate(-1); // utilise l'historique de navigation
  };

  // fonction utilitaire pour formater la durée (sec) en minutes:secondes
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const track = data.getTrackDetails;

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
