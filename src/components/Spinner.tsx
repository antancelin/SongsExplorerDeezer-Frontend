// style import
import "../styles/components/Spinner.css";

// logo import
import logo from "../assets/img/deezer-logo.png";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <img src={logo} alt="loaging..." className="spinner" />
    </div>
  );
};

export default Spinner;
