// style import
import "../styles/components/TableSkeleton.css";

const TableSkeleton = () => {
  // création de 5 lignes de squelette
  const skeletonRows = Array(15).fill(null);

  return (
    <div className="results-table skeleton">
      <table>
        {/* <thead>
          <tr>
            <th className="skeleton-header"></th>
            <th className="skeleton-header"></th>
            <th className="skeleton-header"></th>
            <th className="skeleton-header"></th>
          </tr>
        </thead> */}
        <thead>
          <tr>
            <th className="sortable-header">
              <div className="header-container">
                <span className="header-content">
                  <div className="skeleton-header"></div>
                </span>
              </div>
            </th>
            <th className="sortable-header">
              <div className="header-container">
                <span className="header-content">
                  <div className="skeleton-header"></div>
                </span>
              </div>
            </th>
            <th className="sortable-header">
              <div className="header-container">
                <span className="header-content">
                  <div className="skeleton-header"></div>
                </span>
              </div>
            </th>
            <th className="duration-icon">
              <div className="timer-reset-container">
                <div className="skeleton-header"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="skeleton-row">
              <td className="track-name">
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
              </td>
              <td>
                <div className="skeleton-text"></div>
              </td>
              <td>
                <div className="skeleton-text"></div>
              </td>
              <td>
                <div className="skeleton-duration"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
