// packages import
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // considers data "fresh" for 5 minutes
      retry: 2, // number of attempts in case of failure
    },
  },
});
