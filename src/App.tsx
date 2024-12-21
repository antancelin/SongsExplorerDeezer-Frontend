// packages import
import { useState } from "react";

// components import
import SearchBar from "./components/SearchBar";

// types import
import { Track } from "./types";

// style import
import "./styles/App.css";

function App() {
  // state to stock research
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  // function to use in SearchBar
  const handleSearch = (query: string) => {
    console.log("Search for: ", query);

    // later, API calling
  };

  return (
    <div className="app">
      <h1>Songs Explorer w/ Deezer</h1>
      <SearchBar onSearch={handleSearch} />
      {/* later, results display components adding */}
    </div>
  );
}

export default App;
