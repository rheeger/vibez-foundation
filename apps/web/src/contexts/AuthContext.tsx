import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useGetCurrentUser } from '../api/hooks';
import { useAppStore } from '../store/useAppStore';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { isLoading } = useGetCurrentUser();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const appIsLoading = useAppStore((state) => state.isLoading);
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    setUser(null);
    router.push('/auth/login');
  };
  
  // Check for protected routes
  useEffect(() => {
    const isProtectedRoute = 
      router.pathname.startsWith('/dashboard') || 
      router.pathname.startsWith('/profile');
      
    if (!isLoading && !user && isProtectedRoute) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);
  
  // Auth state values
  const authValues: AuthContextProps = {
    isAuthenticated: !!user,
    isLoading: isLoading || appIsLoading,
    user,
    logout,
  };
  
  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 