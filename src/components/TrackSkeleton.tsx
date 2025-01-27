// skeleton component for the TrackDetails component
const TrackSkeleton = () => {
  return (
    <div data-testid="track-skeleton" className="track-details skeleton">
      <button className="back-button skeleton-button">← Retour</button>

      {/* left column - song info */}
      <div className="track-header">
        <div className="track-title">
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-duration"></div>
        <div className="album-info">
          <div className="skeleton-album-title"></div>
          <div className="skeleton-album-cover"></div>
        </div>
      </div>

      {/* right column - artist info */}
      <div className="artist-info">
        <div className="skeleton-artist-img"></div>
        <div className="skeleton-artist-name"></div>

        <div className="artist-biography">
          <div className="skeleton-biography-title"></div>
          <div className="skeleton-text-lines">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="skeleton-text-line"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSkeleton;
