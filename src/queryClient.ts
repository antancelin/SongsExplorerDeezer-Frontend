// packages import
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // considère les données comme "fraîches" pendant 5 minutes
      retry: 2, // nombre de tentatives en cas d'échec
    },
  },
});
