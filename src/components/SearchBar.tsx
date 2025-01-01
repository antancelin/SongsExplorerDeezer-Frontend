// packages import
import { useState, useCallback, useEffect } from "react";
import { debounce } from "../utils/debounce";

// icons import
import { BiSearch, BiX } from "react-icons/bi";

// style import
import "../styles/components/SearchBar.css";

// Props : ce que le composant va recevoir de son parent
interface SearchBarProps {
  onSearch: (query: string) => void; // Fonction appelée quand l'utilisateur recherche
  initialValue?: string; // Nouvelle prop pour la valeur initiale, optionnelle grâce au '?'
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  // État local pour stocker la valeur de l'input
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  // Effet pour synchroniser searchTerm avec initialValue
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Création d'un version debounced de onSearch
  // useCallback mémorise la fonction pour éviter des recréations inutiles
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 800), // délai en ms
    [onSearch]
  );

  // effet qui se déclnche quand SearchTerm change
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Fonction appelée à chaque changement dans l'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    // même si valeur est vide, on transmet
    debouncedSearch(newValue);
  };

  // fonction pour vider la barre de recherche
  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <BiSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Rechercher une chanson..."
          className="search-input"
        />
        {searchTerm && <BiX className="clear-icon" onClick={handleClear} />}
      </div>
    </div>
  );
};

export default SearchBar;
