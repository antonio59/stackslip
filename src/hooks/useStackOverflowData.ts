import { useState, useCallback } from 'react'; // Removed unused useEffect
import { fetchUserData, fetchUserTags, type StackOverflowUser } from '../services/stackOverflowApi';
import { useToast } from '../components/ui/use-toast';

// Decorative receipt codes — still uses a CSPRNG so the values are
// unpredictable if this code is ever repurposed for something real.
function randomCode(alphabet: string, length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

interface UseStackOverflowDataResult {
  userData: StackOverflowUser | null;
  userTags: string[];
  loading: boolean;
  error: string | null;
  couponCode: string;
  authCode: string;
  fetchData: (username: string) => void;
}

export function useStackOverflowData(): UseStackOverflowDataResult {
  const [userData, setUserData] = useState<StackOverflowUser | null>(null);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const { toast } = useToast();

  const fetchData = useCallback(async (username: string) => {
    if (!username) return;

    setLoading(true);
    setError(null);
    setUserData(null); // Clear previous data
    setUserTags([]);
    setCouponCode('');
    setAuthCode('');

    let mounted = true; // Basic mount check for async operations

    try {
      const data = await fetchUserData(username);
      if (!mounted) return;

      setUserData(data);
      const tags = await fetchUserTags(data.user_id);
      if (!mounted) return;

      setUserTags(tags);
      setCouponCode(randomCode('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6));
      setAuthCode(randomCode('0123456789', 6));

    } catch (err) {
      if (!mounted) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error loading user data:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }

    // Cleanup function for the useCallback dependency effect simulation
    return () => {
      mounted = false;
    };
  }, [toast]); // Include toast in dependencies

  // Note: This hook now provides a fetchData function to be called explicitly,
  // rather than relying on useEffect internally based on props.
  // This gives more control to the component using the hook.

  return { userData, userTags, loading, error, couponCode, authCode, fetchData };
}