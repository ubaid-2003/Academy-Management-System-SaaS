'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string; // make flexible, backend might send different cases
  avatar?: string;
  token: string;
  activeAcademyId?: number;
  academyIds?: number[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateActiveAcademy: (academyId?: number) => Promise<any>;
  canCreateAcademy: boolean;
  activeAcademyId?: number;
  academyIds: number[];
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.token) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Sync user → localStorage whenever it changes
  useEffect(() => {
    if (user?.token) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Switch active academy
  const updateActiveAcademy = async (academyId?: number) => {
    if (!user?.token) return;

    try {
      const url = academyId
        ? `${API_BASE_URL}/academies/switch/${academyId}`
        : `${API_BASE_URL}/academies/switch`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) logout();
        throw new Error('Failed to switch academy');
      }

      const data = await res.json();

      const updatedUser: User = {
        ...user,
        token: data.token || user.token,
        activeAcademyId: data.currentAcademy?.id ?? academyId,
        academyIds: data.academyIds || user.academyIds || [],
        permissions: data.permissions || user.permissions || [],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return data;
    } catch (err) {
      console.error('Error switching academy:', err);
      alert('Failed to switch academy. Please try again.');
    }
  };

  // Fetch wrapper with auth
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!user?.token) throw new Error('No token found');

    const headers: Record<string, string> = {
      Authorization: `Bearer ${user.token}`,
      ...(options.headers ? options.headers as Record<string, string> : {}),
    };

    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      logout();
      throw new Error('Invalid token. Logged out.');
    }

    return res;
  };

  const canCreateAcademy = user?.role?.toLowerCase() === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        updateActiveAcademy,
        canCreateAcademy,
        activeAcademyId: user?.activeAcademyId,
        academyIds: user?.academyIds || [],
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
