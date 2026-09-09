import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthUser, LoginRequestDto, RegisterRequestDto } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { decodeJwt, isTokenExpired } from '../utils/jwt';
import { mockStore } from '../api/mock/mockStore';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmployee: boolean;
  isManager: boolean;
  isHR: boolean;
  login: (dto: LoginRequestDto) => Promise<void>;
  register: (dto: RegisterRequestDto) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'Employee' | 'Manager' | 'HR') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('leavo_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('leavo_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    const t = localStorage.getItem('leavo_token');
    if (t && !isTokenExpired(t)) {
      return decodeJwt(t);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('leavo_token');
      if (storedToken) {
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
        // Default login as Leila Vance for initial seamless showcase if nothing is stored
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
      localStorage.setItem('leavo_token', res.token);
      localStorage.setItem('leavo_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: RegisterRequestDto) => {
    setIsLoading(true);
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
      localStorage.setItem('leavo_token', res.token);
      localStorage.setItem('leavo_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('leavo_token');
    localStorage.removeItem('leavo_user');
  }, []);

  // Instant role & profile switcher for testing/demoing all 3 personas easily
  const switchRole = (targetRole: 'Employee' | 'Manager' | 'HR') => {
    let targetEmail = 'leila.vance@company.com';
    if (targetRole === 'Manager') targetEmail = 'david.chen@company.com';
    if (targetRole === 'HR') targetEmail = 'admin@company.com';

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
    }
  };

  const roles = user?.roles || [];
  const isHR = roles.includes('HR') || roles.includes('Admin');
  const isManager = roles.includes('Manager') || isHR;
  const isEmployee = true; // All authenticated users are employees

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
        login,
        register,
        logout,
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
