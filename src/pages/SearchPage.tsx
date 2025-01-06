// packages import
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

// services import
import { searchTracks } from "../services/api";

// components import
import SearchBar from "../components/SearchBar";
import ResultsTable from "../components/ResultsTable";
import TableSkeleton from "../components/TableSkeleton";

// types import
import { Track } from "../types";

// style import
import "../styles/pages/SearchPage.css";

// images import
import logo from "../assets/img/deezer-logo.png";

const SearchPage = () => {
  // MANAGING URL PARAMETERS
  // using URL parameters for search persistence
  const [searchParams, setSearchParams] = useSearchParams(); // hook for URL parameters
  const initialSearch = searchParams.get("search") || ""; // retrieving initial search in URL (or empty)

  // LOCAL STATE
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch); // local state for search

  // URL/STATE SYNCHRONIZATION
  // added a useEffect to listen for URL changes
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams, searchQuery]);

  // SEARCH QUERY CONFIGURATION
  const {
    data, // data from the query
    fetchNextPage, // function to fetch the next page
    hasNextPage, // indicates if there is a next page
    isFetchingNextPage, // indicates if a request is in progress
    isLoading, // indicates if a request is in progress
    error, // error from the query
  } = useInfiniteQuery({
    // unique key for this query
    queryKey: ["tracks", searchQuery],

    // initial page parameter
    initialPageParam: 0,

    // function that retrieves data
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
      // returning undefined if all items are loaded or the total number of items
      return loadedItems < lastPage.total ? loadedItems : undefined;
    },

    // don't run query if no search query
    enabled: searchQuery.length > 0,
  });

  // search manager that updates the URL
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

  // infinite scroll management
  const handleScroll = useCallback(() => {
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 100;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // adding scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // all tracks from all pages
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
