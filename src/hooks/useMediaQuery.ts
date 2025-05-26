
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a media query matches - SSR compatible
 * @param query The media query to check
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    // Set initial value
    setMatches(media.matches);

    const listener = () => {
      setMatches(media.matches);
    };

    // Modern browsers use addEventListener/removeEventListener
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]); // Only re-run if query changes

  return matches;
};
