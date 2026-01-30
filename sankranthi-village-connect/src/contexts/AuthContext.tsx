import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'public' | 'committee' | 'financial_manager' | 'event_manager' | 'rangoli_manager' | 'dance_manager' | 'judge';

interface User {
  id: string;
  role: UserRole;
  username: string;
  token?: string; // New stateless token
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, loginType: 'committee' | 'judge') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend API URL
const API_URL = 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('sankranthi_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure it's a newer stateless session (has token)
        if (parsed.token) {
          setUser(parsed);
        } else {
          // Clear legacy session
          localStorage.removeItem('sankranthi_user');
        }
      } catch {
        localStorage.removeItem('sankranthi_user');
      }
    }
  }, []);

  const login = async (username: string, password: string, loginType: 'committee' | 'judge'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Invalid username or password' };
      }

      // Check if user role matches login type
      if (loginType === 'judge' && data.user.role !== 'judge') {
        return { success: false, error: 'This account is not a judge account' };
      }
      if (loginType === 'committee' && data.user.role === 'judge') {
        return { success: false, error: 'Judges must use the Judges login' };
      }

      const userData = {
        id: '',
        username: data.user.username,
        role: data.user.role as UserRole,
        token: data.token
      };

      setUser(userData);
      localStorage.setItem('sankranthi_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sankranthi_user');
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    // Super admin ganesh has all roles
    if (user.username.toLowerCase() === 'ganesh') return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
