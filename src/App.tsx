// packages import
import { useCallback, useEffect, useState } from "react";

// graphql import
import { ApolloProvider, useQuery } from "@apollo/client";
import { client } from "./graphql/client";
import { SEARCH_TRACKS } from "./graphql/queries";

// components import
import SearchBar from "./components/SearchBar";
import ResultsTable from "./components/ResultsTable";

// types import
import { Track } from "./types";

// style import
import "./styles/App.css";

function AppContent() {
  // states pour gérer la recherche et la pagination
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  // states pour contrôler l'affichage progressif
  const [visibleTracks, setVisibleTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // configuration de la requête GraphQL
  const { loading, error, data, fetchMore } = useQuery(SEARCH_TRACKS, {
    variables: { query: searchQuery, limit: 50, index: 0 },
    skip: !searchQuery, // ne pas exécuter la requête si pas de term de recherche
  });

  // met à jour les chansons visiblens initialement
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

  // const handleScroll = useCallback(() => {
  //   const isBottom =
  //     window.innerHeight + document.documentElement.scrollTop >=
  //     document.documentElement.scrollHeight - 100;

  //   if (isBottom && !loading && data?.searchTracks.total > allTracks.length) {
  //     fetchMore({
  //       variables: {
  //         query: searchQuery,
  //         limit: 50,
  //         index: allTracks.length,
  //       },
  //       updateQuery: (prev, { fetchMoreResult }) => {
  //         if (!fetchMoreResult) {
  //           return prev;
  //         }
  //         return {
  //           searchTracks: {
  //             ...fetchMoreResult.searchTracks,
  //             data: [
  //               ...prev.searchTracks.data,
  //               ...fetchMoreResult.searchTracks.data,
  //             ],
  //           },
  //         };
  //       },
  //     });
  //   }
  // }, [fetchMore, loading, data, allTracks.length, searchQuery]);

  // configuration de l'écouteur de scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // function to use in SearchBar
  const handleSearch = (query: string) => {
    setVisibleTracks([]); // réinitialise les résultats
    setCurrentIndex(0);
    setSearchQuery(query);
  };

  return (
    <div className="app">
      <h1>Songs Explorer w/ Deezer</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur : {error.message}</div>}
      {data?.searchTracks && <ResultsTable tracks={visibleTracks} />}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AppContent />
    </ApolloProvider>
  );
}

export default App;
