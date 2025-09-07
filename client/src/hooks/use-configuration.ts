import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Configuration, type InsertConfigurationProfile, type PackageGenerationRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useConfiguration() {
  const queryClient = useQueryClient();
  
  // Get default configuration
  const { data: defaultConfiguration, isLoading } = useQuery({
    queryKey: ["/api/configuration/default"],
  });

  const [configuration, setConfiguration] = useState<Configuration>(
    defaultConfiguration || {} as Configuration
  );

  useEffect(() => {
    if (defaultConfiguration) {
      setConfiguration(defaultConfiguration);
    }
  }, [defaultConfiguration]);

  // Save configuration profile
  const saveProfileMutation = useMutation({
    mutationFn: async (profile: InsertConfigurationProfile) => {
      const response = await apiRequest("POST", "/api/profiles", profile);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
    },
  });

  // Generate package
  const generatePackageMutation = useMutation({
    mutationFn: async (request: PackageGenerationRequest) => {
      const response = await apiRequest("POST", "/api/package/generate", request);
      return response.json();
    },
  });

  // Validate configuration
  const validateMutation = useMutation({
    mutationFn: async (config: Configuration) => {
      const response = await apiRequest("POST", "/api/configuration/validate", config);
      return response.json();
    },
  });

  const updateConfiguration = (updates: Partial<Configuration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  };

  const saveProfile = async (profileData: Omit<InsertConfigurationProfile, "configuration">) => {
    return saveProfileMutation.mutateAsync({
      ...profileData,
      configuration,
    });
  };

  const generatePackage = async (request: Omit<PackageGenerationRequest, "configuration">) => {
    return generatePackageMutation.mutateAsync({
      ...request,
      configuration,
    });
  };

  const validateConfiguration = async () => {
    return validateMutation.mutateAsync(configuration);
  };

  return {
    configuration,
    updateConfiguration,
    saveProfile,
    generatePackage,
    validateConfiguration,
    isLoading,
    isSaving: saveProfileMutation.isPending,
    isGenerating: generatePackageMutation.isPending,
    isValidating: validateMutation.isPending,
  };
}
