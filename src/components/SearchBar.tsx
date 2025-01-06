// packages import
import { useState, useCallback, useEffect } from "react";
import { debounce } from "../utils/debounce";

// icons import
import { BiSearch, BiX } from "react-icons/bi";

// style import
import "../styles/components/SearchBar.css";

// what the component will receive from its parent
interface SearchBarProps {
  onSearch: (query: string) => void; // function called when user searches
  initialValue?: string; // new prop for the initial value, optional thanks to the '?'
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  // local state to store the input value
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  // effect to synchronize searchTerm with initialValue
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // creating a debounced version of onSearch
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 800), // delay en ms
    [onSearch]
  );

  // effect that triggers when SearchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // function called on each change in input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    debouncedSearch(newValue);
  };

  // function to clear the search bar
  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div data-testid="search-bar" className="search-bar">
      <div className="search-input-container">
        <BiSearch data-testid="search-icon" className="search-icon" />
        <input
          data-testid="search-input"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Rechercher une chanson..."
          className="search-input"
        />
        {searchTerm && (
          <BiX
            data-testid="clear-search-button"
            className="clear-icon"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
