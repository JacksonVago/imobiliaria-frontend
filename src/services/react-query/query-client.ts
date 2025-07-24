import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  //define the default options for the query client, likes cache time, error retry, call on error, etc
  defaultOptions: {
    queries: {
      staleTime: 0, // No stale time, always fetch the data
      gcTime: 60 * 15 * 1000, // 15 minutes
      refetchOnWindowFocus: true,
    },
    mutations: {},
  },
});
