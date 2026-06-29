import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, RegisterPayload, LoginPayload } from '../api/authApi';
import { useApp } from './AppContext';

export type UserRole = 'CLIENT' | 'FREELANCER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setUser: setAppUser,
    setToken: setAppToken,
    setRole: setAppRole,
    setAuthStep: setAppAuthStep,
    setActiveTab: setAppActiveTab,
  } = useApp();

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await authApi.getMe();
      if (response && response.status === 'success' && response.data?.user) {
        const u = response.data.user;
        const normalizedUser: User = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          isVerified: u.isVerified,
          avatar: u.avatar,
        };
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));

        // SYNC WITH APP CONTEXT
        setAppToken(localStorage.getItem('token'));
        setAppUser(u);
        setAppRole(u.role.toLowerCase() as any);
        setAppAuthStep('authenticated');
        setAppActiveTab('dashboard');
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Failed to fetch user profiles:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const activeToken = localStorage.getItem('token');
    if (activeToken) {
      setToken(activeToken);
      fetchCurrentUser();
    } else {
      clearAuth();
      setIsLoading(false);
    }

    // Listen to global logout event from axios interceptor
    const handleLogoutEvent = () => {
      clearAuth();
    };
    window.addEventListener('auth_logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth_logout', handleLogoutEvent);
    };
  }, []);

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // SYNC WITH APP CONTEXT
    setAppToken(null);
    setAppUser(null);
    setAppRole('public');
    setAppAuthStep('login');
    setAppActiveTab('home');
  };

  const login = async (payload: LoginPayload) => {
    try {
      const response = await authApi.login(payload);
      if (response && response.status === 'success' && response.data) {
        const { accessToken, refreshToken, user: u } = response.data;
        const normalizedUser: User = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          isVerified: u.isVerified,
          avatar: u.avatar,
        };
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        setToken(accessToken);
        setUser(normalizedUser);

        // SYNC WITH APP CONTEXT
        setAppToken(accessToken);
        setAppUser(u);
        setAppRole(u.role.toLowerCase() as any);
        setAppAuthStep('authenticated');
        setAppActiveTab('dashboard');
        
        return { success: true, user: normalizedUser };
      }
      return { success: false, message: response?.message || 'Login failed.' };
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid credentials or connection error.';
      const code = error.response?.data?.code;
      return { success: false, message: msg, code, emailNotVerified: code === 'EMAIL_NOT_VERIFIED' || msg.includes('verify') };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await authApi.register(payload);
      return { success: true, message: response.message || 'Registration successful. Verification email sent.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await authApi.verifyEmail(verificationToken);
      return { success: true, message: response.message || 'Email verified successfully.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Verification failed.' };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await authApi.resendVerification(email);
      return { success: true, message: response.message || 'Verification email resent.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to resend verification email.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authApi.forgotPassword(email);
      return { success: true, message: response.message || 'Password reset email sent.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to request reset.' };
    }
  };

  const resetPassword = async (verificationToken: string, word: string) => {
    try {
      const response = await authApi.resetPassword(verificationToken, word);
      return { success: true, message: response.message || 'Password reset successfully.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Reset failed.' };
    }
  };

  const logout = async () => {
    const activeRefreshToken = localStorage.getItem('refreshToken');
    if (activeRefreshToken) {
      try {
        await authApi.logout(activeRefreshToken);
      } catch (err) {
        console.warn('Backend logout failed:', err);
      }
    }
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
