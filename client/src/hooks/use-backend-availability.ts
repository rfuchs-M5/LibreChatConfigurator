import { useState, useEffect } from 'react';

export function useBackendAvailability() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check if we're on a known static hosting platform
    const isStaticHosting = () => {
      const hostname = window.location.hostname;
      return hostname.includes('.netlify.app') || 
             hostname.includes('.vercel.app') ||
             hostname.includes('.github.io') ||
             hostname.includes('.surge.sh') ||
             hostname.includes('.firebase.app') ||
             hostname.includes('.pages.dev'); // Cloudflare Pages
    };

    // Create AbortSignal with timeout (fallback for older browsers)
    const createTimeoutSignal = (timeoutMs: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // Clean up timeout when signal is aborted
      controller.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
      
      return controller.signal;
    };

    // Test multiple endpoints for robust detection
    const robustBackendCheck = async (): Promise<boolean> => {
      const endpoints = [
        '/api/configuration/default',
        '/api/package/generate', // Test the specific functionality we care about
        '/api/profiles'
      ];

      const checks = endpoints.map(endpoint => 
        fetch(endpoint, {
          method: 'HEAD', // Lightweight check
          signal: createTimeoutSignal(3000), // 3 second timeout
          cache: 'no-cache'
        }).then(response => {
          // More specific validation - check for actual success
          return response.status >= 200 && response.status < 300;
        }).catch(() => false) // Any error means endpoint unavailable
      );

      try {
        const results = await Promise.allSettled(checks);
        // If any endpoint succeeds, backend is available
        return results.some(result => 
          result.status === 'fulfilled' && result.value === true
        );
      } catch {
        return false;
      }
    };

    const checkBackendAvailability = async () => {
      try {
        // Fast path: if we know it's static hosting, skip the check
        if (isStaticHosting()) {
          console.log('🌐 Detected static hosting platform - running in demo mode');
          if (mounted) {
            setIsBackendAvailable(false);
            setIsChecking(false);
          }
          return;
        }

        // Otherwise, perform robust backend detection
        console.log('🔍 Checking backend availability...');
        const isAvailable = await robustBackendCheck();
        
        if (mounted) {
          setIsBackendAvailable(isAvailable);
          setIsChecking(false);
          console.log(`✅ Backend ${isAvailable ? 'available' : 'unavailable'} - ${isAvailable ? 'full functionality' : 'demo mode'}`);
        }
      } catch (error) {
        // Fallback: any unexpected error means no backend
        console.log('❌ Backend check failed - running in demo mode');
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