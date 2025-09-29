import { useState, useEffect } from 'react';

export function useBackendAvailability() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkBackendAvailability = async () => {
      try {
        // Try to ping the backend with a simple API call
        const response = await fetch('/api/configuration/default', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (mounted) {
          setIsBackendAvailable(response.ok);
          setIsChecking(false);
        }
      } catch (error) {
        // Backend is not available (likely static hosting)
        if (mounted) {
          setIsBackendAvailable(false);
          setIsChecking(false);
        }
      }
    };

    checkBackendAvailability();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    isBackendAvailable,
    isChecking,
    isDemo: isBackendAvailable === false,
  };
}