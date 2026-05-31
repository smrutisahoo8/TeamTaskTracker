import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthResponse, AuthState, UserSummary } from '../types';

interface AppContextValue {
  auth: AuthState;
  login: (response: AuthResponse) => void;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const initialAuth: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuth);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('team-task-tracker-auth');
    if (saved) {
      try {
        setAuth(JSON.parse(saved));
      } catch {
        localStorage.removeItem('team-task-tracker-auth');
      }
    }
  }, []);

  const login = (response: AuthResponse) => {
    const nextAuth: AuthState = {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };
    setAuth(nextAuth);
    localStorage.setItem('team-task-tracker-auth', JSON.stringify(nextAuth));
  };

  const logout = () => {
    setAuth(initialAuth);
    localStorage.removeItem('team-task-tracker-auth');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider value={{ auth, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
