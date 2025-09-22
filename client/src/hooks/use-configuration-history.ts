import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Configuration } from "@shared/schema";

export interface ConfigurationHistory {
  id: string;
  configuration: Configuration;
  timestamp: string;
  packageName: string;
}

export function useConfigurationHistory() {
  const historyQuery = useQuery({
    queryKey: ["/api/configuration/history"],
  });

  const loadConfigurationMutation = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`/api/configuration/load/${id}`, {
        method: "POST",
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configuration/default"] });
    },
  });

  return {
    history: historyQuery.data as ConfigurationHistory[] | undefined,
    isLoading: historyQuery.isLoading,
    loadConfiguration: loadConfigurationMutation.mutate,
    isLoadingConfiguration: loadConfigurationMutation.isPending,
  };
}