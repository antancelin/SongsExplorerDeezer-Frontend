// packages import
import { useCallback, useEffect, useState } from "react"; // fonctionnalités de base de React
import { useSearchParams } from "react-router-dom"; // gestion des paramètres d'URL
import { useInfiniteQuery } from "@tanstack/react-query"; // gestion des requêtes infinies

// services import
import { searchTracks } from "../services/api"; // fonction de recherche de chansons

// components import
import SearchBar from "../components/SearchBar"; // composant de barre de recherche
import ResultsTable from "../components/ResultsTable"; // composant de tableau de résultats
// import Spinner from "../components/Spinner"; // composant de spinner (loading)
import TableSkeleton from "../components/TableSkeleton"; // composant de squelette de tableau

// types import
import { Track } from "../types"; // type de données pour les chansons

// style import
import "../styles/pages/SearchPage.css";

// images import
import logo from "../assets/img/deezer-logo.png";

const SearchPage = () => {
  // --- GESTION DES PARAMÈTRES D'URL ---
  // Utilisation des paramètres d'URL pour la persistance de la recherche
  const [searchParams, setSearchParams] = useSearchParams(); // hook pour les paramètres d'URL
  const initialSearch = searchParams.get("search") || ""; // récupération de la recherche initiale dans l'URL (ou vide)

  // --- ÉTAT LOCAL ---
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch); // état local pour la recherche

  // --- SYNCHRONISATION URL/ÉTAT ---
  // Ajout d'un useEffect pour écouter les changements d'URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams, searchQuery]); // Cette dépendance signifie que l'effet s'exécute quand l'URL change

  // --- CONFIGURATION DE LA REQUÊTE DE RECHERCHE ---
  const {
    data, // resultats de la recherche
    fetchNextPage, // fonction pour charger plus de résultats
    hasNextPage, // indique si il y a plus de résultats à charger
    isFetchingNextPage, // indique si une requête est en cours
    isLoading, // indique si une requête est en cours
    error, // indique si une erreur est survenue
  } = useInfiniteQuery({
    // Clé unique pour cette requête
    queryKey: ["tracks", searchQuery],

    // Ajout du paramètre initial de page
    initialPageParam: 0,

    // Fonction qui récupère les données
    queryFn: async ({ pageParam }) => {
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
      <div data-testid="app-header" className="title">
        <img data-testid="app-logo" src={logo} alt="deezer-logo" />
        <h1 data-testid="app-title">DEEZER EXPLORER</h1>
      </div>
      <SearchBar initialValue={initialSearch} onSearch={handleSearch} />
      {isLoading && <TableSkeleton />}
      {error && (
        <div data-testid="error-message">
          Erreur : {(error as Error).message}
        </div>
      )}
      {searchQuery && allTracks.length > 0 && (
        <ResultsTable tracks={allTracks} />
      )}
    </div>
  );
};

export default SearchPage;
