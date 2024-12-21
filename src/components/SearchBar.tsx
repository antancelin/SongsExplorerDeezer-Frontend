// packages import
import { useState } from "react";
import "../styles/components/SearchBar.css";

// Props : ce que le composant va recevoir de son parent
interface SearchBarProps {
  onSearch: (query: string) => void; // Fonction appelée quand l'utilisateur recherche
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  // État local pour stocker la valeur de l'input
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fonction appelée quand le formulaire est soumis
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page
    onSearch(searchTerm); // Appelle la fonction reçue en props avec le terme de recherche
  };

  // Fonction appelée à chaque changement dans l'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Rechercher une chanson..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;
