import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthUser, LoginRequestDto, RegisterRequestDto } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { decodeJwt, isTokenExpired } from '../utils/jwt';
import { mockStore } from '../api/mock/mockStore';
import { queryClient } from '../api/queryClient';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmployee: boolean;
  isManager: boolean;
  isHR: boolean;
  isDemoMode: boolean;
  login: (dto: LoginRequestDto) => Promise<void>;
  register: (dto: RegisterRequestDto) => Promise<void>;
  logout: () => void;
  enterDemoMode: (persona?: 'Employee' | 'Manager' | 'HR') => void;
  switchRole: (role: 'Employee' | 'Manager' | 'HR') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('leavo_token'));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    () => localStorage.getItem('leavo_demo_mode') === 'true'
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const isDemo = localStorage.getItem('leavo_demo_mode') === 'true';
    const saved = localStorage.getItem('leavo_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    const t = localStorage.getItem('leavo_token');
    if (t && !isTokenExpired(t) && !isDemo) {
      return decodeJwt(t);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = () => {
      const isDemo = localStorage.getItem('leavo_demo_mode') === 'true';
      const storedToken = localStorage.getItem('leavo_token');

      if (isDemo) {
        setIsDemoMode(true);
        const savedUser = localStorage.getItem('leavo_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        } else {
          const defaultUser = mockStore.getUserByEmail('leila.vance@company.com');
          if (defaultUser) {
            const demoUser: AuthUser = {
              id: defaultUser.id,
              email: defaultUser.email,
              fullName: `${defaultUser.firstName} ${defaultUser.lastName}`,
              roles: defaultUser.roles,
            };
            setUser(demoUser);
            localStorage.setItem('leavo_user', JSON.stringify(demoUser));
          }
        }
      } else if (storedToken) {
        setIsDemoMode(false);
        if (isTokenExpired(storedToken)) {
          logout();
        } else {
          const decoded = decodeJwt(storedToken);
          if (decoded) {
            setUser(decoded);
            setToken(storedToken);
          } else {
            logout();
          }
        }
      } else {
        // By default, user is unauthenticated - uses actual database on login
        setIsDemoMode(false);
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen to unauthorized event from Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('leavo_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('leavo_unauthorized', handleUnauthorized);
  }, []);

  const login = async (dto: LoginRequestDto) => {
    setIsLoading(true);
    // Explicitly wipe all demo flags and clear query cache so the application solely queries the real database
    localStorage.removeItem('leavo_demo_mode');
    localStorage.removeItem('leavo_force_mock');
    queryClient.clear();
    setIsDemoMode(false);
    try {
      const res = await authApi.login(dto);
      const decoded = decodeJwt(res.token);

      const authUser: AuthUser = decoded || {
        id: 'usr-default',
        email: res.email,
        fullName: res.fullName,
        roles: ['Employee'],
      };

      setToken(res.token);
      setUser(authUser);
      setIsDemoMode(false);
      localStorage.removeItem('leavo_demo_mode');
      localStorage.removeItem('leavo_force_mock');
      localStorage.setItem('leavo_token', res.token);
      localStorage.setItem('leavo_user', JSON.stringify(authUser));
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: RegisterRequestDto) => {
    setIsLoading(true);
    localStorage.removeItem('leavo_demo_mode');
    localStorage.removeItem('leavo_force_mock');
    queryClient.clear();
    setIsDemoMode(false);
    try {
      const res = await authApi.register(dto);
      const decoded = decodeJwt(res.token);

      const authUser: AuthUser = decoded || {
        id: 'usr-default',
        email: res.email,
        fullName: res.fullName,
        roles: ['Employee'],
      };

      setToken(res.token);
      setUser(authUser);
      setIsDemoMode(false);
      localStorage.removeItem('leavo_demo_mode');
      localStorage.removeItem('leavo_force_mock');
      localStorage.setItem('leavo_token', res.token);
      localStorage.setItem('leavo_user', JSON.stringify(authUser));
      queryClient.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const enterDemoMode = (persona: 'Employee' | 'Manager' | 'HR' = 'Employee') => {
    // Reset mock store to clean defaults so every demo session starts fresh
    mockStore.resetToDefaults();
    queryClient.clear();

    let targetEmail = 'leila.vance@company.com';
    if (persona === 'Manager') targetEmail = 'david.chen@company.com';
    if (persona === 'HR') targetEmail = 'elena.rostova@company.com';

    const target = mockStore.getUserByEmail(targetEmail) || mockStore.getUsers()[0];
    const demoUser: AuthUser = {
      id: target.id,
      email: target.email,
      fullName: `${target.firstName} ${target.lastName}`,
      roles: target.roles,
    };

    setIsDemoMode(true);
    setUser(demoUser);
    setToken('mock-demo-token');
    localStorage.setItem('leavo_demo_mode', 'true');
    localStorage.setItem('leavo_user', JSON.stringify(demoUser));
    localStorage.setItem('leavo_token', 'mock-demo-token');
    queryClient.clear();
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('leavo_token');
    localStorage.removeItem('leavo_user');
    localStorage.removeItem('leavo_demo_mode');
    localStorage.removeItem('leavo_force_mock');
    // Ensure all demo interactions in memory are discarded on session end and query cache is completely purged
    mockStore.resetToDefaults();
    queryClient.clear();
  }, []);

  // Instant role & profile switcher (active in Demo Mode)
  const switchRole = (targetRole: 'Employee' | 'Manager' | 'HR') => {
    if (!isDemoMode) return;

    let targetEmail = 'leila.vance@company.com';
    if (targetRole === 'Manager') targetEmail = 'david.chen@company.com';
    if (targetRole === 'HR') targetEmail = 'elena.rostova@company.com';

    const target = mockStore.getUserByEmail(targetEmail);
    if (target) {
      const newUser: AuthUser = {
        id: target.id,
        email: target.email,
        fullName: `${target.firstName} ${target.lastName}`,
        roles: target.roles,
      };
      setUser(newUser);
      localStorage.setItem('leavo_user', JSON.stringify(newUser));
      queryClient.clear();
    }
  };

  const roles = user?.roles || [];
  const isHR = roles.includes('HR') || roles.includes('Admin');
  const isManager = roles.includes('Manager') && !isHR;
  const isEmployee = roles.includes('Employee') && !isHR;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isEmployee,
        isManager,
        isHR,
        isDemoMode,
        login,
        register,
        logout,
        enterDemoMode,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
