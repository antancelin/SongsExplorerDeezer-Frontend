// packages import
import { useCallback, useEffect, useState } from "react";

// graphql import
import { useQuery } from "@apollo/client";
import { SEARCH_TRACKS } from "../graphql/queries";

// components import
import SearchBar from "../components/SearchBar";
import ResultsTable from "../components/ResultsTable";
import Spinner from "../components/Spinner";

// types import
import { Track } from "../types";

// style import
import "../styles/pages/SearchPage.css";

const SearchPage = () => {
  // states pour gérer la recherche et la pagination
  const [searchQuery, setSearchQuery] = useState<string>("");

  // states pour contrôler l'affichage progressif
  const [visibleTracks, setVisibleTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // configuration de la requête GraphQL
  const { loading, error, data, fetchMore } = useQuery(SEARCH_TRACKS, {
    variables: { query: searchQuery, limit: 50, index: 0 },
    skip: !searchQuery, // ne pas exécuter la requête si pas de term de recherche
    // ajout d'options pour éviter les problèmes de cache
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  // met à jour les chansons visibles initialement
  useEffect(() => {
    if (data?.searchTracks) {
      setVisibleTracks(data.searchTracks.data);
      setCurrentIndex(50);
    }
  }, [data]);

  // gestion du scroll infini
  const handleScroll = useCallback(() => {
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100;

    if (
      isBottom &&
      !loading &&
      data?.searchTracks.total > visibleTracks.length
    ) {
      fetchMore({
        variables: {
          query: searchQuery,
          limit: 50,
          index: currentIndex,
        },
      }).then((fetchMoreResult) => {
        if (fetchMoreResult.data) {
          setVisibleTracks([
            ...visibleTracks,
            ...fetchMoreResult.data.searchTracks.data,
          ]);
          setCurrentIndex(currentIndex + 50);
        }
      });
    }
  }, [loading, data, visibleTracks, currentIndex, fetchMore, searchQuery]);

  // configuration de l'écouteur de scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // gestionnaire de recherche
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim() !== searchQuery) {
        // Vérifie si la recherche a changé
        setVisibleTracks([]); // Réinitialise seulement si nouvelle recherche
        setCurrentIndex(0);
        setSearchQuery(query.trim());
      }

      if (!query.trim()) {
        setVisibleTracks([]);
        setCurrentIndex(0);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

  return (
    <div className="app">
      <h1>Songs Explorer w/ Deezer</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <Spinner />}
      {error && <div>Erreur : {error.message}</div>}
      {searchQuery && data?.searchTracks && (
        <ResultsTable tracks={visibleTracks} />
      )}
    </div>
  );
};

export default SearchPage;
