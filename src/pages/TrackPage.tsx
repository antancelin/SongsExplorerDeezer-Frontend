// packages import
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TRACK_DETAILS } from "../graphql/queries";

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
    return <div>Chargement...</div>;
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

  const track = data.getTrackDetails;

  return (
    <div className={`track-details ${className}`}>
      <button onClick={() => handleBack()} className="back-button">
        ← Retour
      </button>
      <div className="track-header">
        <h1>{track.title}</h1>
        <div className="album-info">
          <h3>{track.album.title}</h3>
          <img src={track.album.cover} alt={track.album.title} />
        </div>
      </div>

      <div className="artist-info">
        <img src={track.artist.picture} alt={track.artist.name} />
        <h2>{track.artist.name}</h2>
      </div>

      {track.artist.biography && (
        <div className="artist-biography">
          <h3>Biographie de l'artiste</h3>
          <p>{track.artist.biography}</p>
        </div>
      )}
    </div>
  );
};

export default TrackPage;
