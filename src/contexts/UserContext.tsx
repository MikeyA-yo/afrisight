import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../lib/api';
import { settingsApi, authApi } from '../lib/api';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = authApi.isAuthenticated();

  const refreshUser = async () => {
    if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await settingsApi.getProfile();
      if (response.success) {
        setUser(response.profile);
      } else {
        throw new Error(response.error || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      // If token is invalid, clear it
      if (err instanceof Error && err.message.includes('authentication')) {
        authApi.logout();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setError(null);
  };

  // Load user data on mount and when authentication status changes
  useEffect(() => {
    refreshUser();
  }, [isAuthenticated]);

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
    updateUser,
    logout,
    error,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper function to get user initials
export function getUserInitials(name: string): string {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}