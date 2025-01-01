// packages import
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // ajout suite react-query
import { useInfiniteQuery } from "@tanstack/react-query"; // ajout suite react-query

// services import
import { searchTracks } from "../services/api";

// components import
import SearchBar from "../components/SearchBar";
import ResultsTable from "../components/ResultsTable";
import Spinner from "../components/Spinner";

// types import
import { Track } from "../types";

// style import
import "../styles/pages/SearchPage.css";

// images import
import logo from "../assets/img/deezer-logo.png";

const SearchPage = () => {
  // Utilisation des paramètres d'URL pour la persistance de la recherche
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // États locaux
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Ajout d'un useEffect pour écouter les changements d'URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams, searchQuery]); // Cette dépendance signifie que l'effet s'exécute quand l'URL change

  // Configuration de la requête infinie avec React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["tracks", searchQuery],

    // Ajout du paramètre initial de page
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      // pageParam est déjà le numéro de page/index
      const result = await searchTracks(searchQuery, {
        limit: 50,
        index: pageParam,
      });
      return result;
    },

    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce(
        (total, page) => total + page.data.length,
        0
      );
      // Si nous avons chargé moins d'éléments que le total disponible,
      // retourne l'index de la prochaine page, sinon undefined
      return loadedItems < lastPage.total ? loadedItems : undefined;
    },

    // Ne pas exécuter la requête si la recherche est vide
    enabled: searchQuery.length > 0,
  });

  // Gestionnaire de recherche qui met à jour l'URL
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        setSearchParams({ search: query.trim() });
      } else {
        setSearchParams({});
      }
      setSearchQuery(query.trim());
    },
    [setSearchParams]
  );

  // Gestion du scroll infini
  const handleScroll = useCallback(() => {
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Configuration de l'écouteur de scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Combine tous les résultats des différentes pages
  const allTracks =
    data?.pages.reduce<Track[]>((acc, page) => [...acc, ...page.data], []) ||
    [];

  return (
    <div className="app">
      <div className="title">
        <img src={logo} alt="deezer-logo" />
        <h1>DEEZER EXPLORER</h1>
      </div>
      <SearchBar initialValue={initialSearch} onSearch={handleSearch} />
      {isLoading && <Spinner />}
      {error && <div>Erreur : {(error as Error).message}</div>}
      {searchQuery && allTracks.length > 0 && (
        <ResultsTable tracks={allTracks} />
      )}
    </div>
  );
};

export default SearchPage;
