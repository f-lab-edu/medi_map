import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  username?: string;
  provider?: string;
  googleAccessToken?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = () => {
    console.log('[useAuth] Checking auth state...');
    const accessToken = Cookies.get('accessToken');
    const userData = Cookies.get('user');
    
    if (accessToken && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('[useAuth] User data found:', parsedUserData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('[useAuth] Error parsing user data:', error);
        setUser(null);
      }
    } else {
      console.log('[useAuth] No auth data found');
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('[useAuth] Mounted, checking auth...');
    checkAuth();

    const handleAuthStateChange = () => {
      console.log('[useAuth] Detected auth state change');
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    setUser(null);
    router.push('/auth/login');
  };

  return { user, isLoading, logout, checkAuth };
}; 