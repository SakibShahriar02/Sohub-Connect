import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const authData = localStorage.getItem('authSession');
      if (authData) {
        const { isAuthenticated, expiresAt } = JSON.parse(authData);
        return isAuthenticated && new Date().getTime() < expiresAt;
      }
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const authData = localStorage.getItem('authSession');
      if (authData) {
        const { isAuthenticated: stored, expiresAt } = JSON.parse(authData);
        if (stored && new Date().getTime() < expiresAt && !isAuthenticated) {
          setIsAuthenticated(true);
        } else if (new Date().getTime() >= expiresAt) {
          localStorage.removeItem('authSession');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.warn('Failed to read auth session from localStorage:', error);
    }
  }, [isAuthenticated]);

  const login = () => {
    try {
      const expiresAt = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
      const authData = { isAuthenticated: true, expiresAt };
      setIsAuthenticated(true);
      localStorage.setItem('authSession', JSON.stringify(authData));
    } catch (error) {
      console.warn('Failed to save auth session to localStorage:', error);
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      localStorage.removeItem('authSession');
    } catch (error) {
      console.warn('Failed to remove auth session from localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};