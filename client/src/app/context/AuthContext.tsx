'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ----------------------
// User interface
// ----------------------
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | string; // Only Admin now
  avatar?: string;
  token: string;           // JWT token from login
  activeAcademyId?: number;
  academyIds?: number[];
}

// ----------------------
// Auth context type
// ----------------------
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateActiveAcademy: (academyId: number) => Promise<void>;
  canCreateAcademy: boolean; // Flag to check if user can create academies
}

// ----------------------
// Create context
// ----------------------
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  updateActiveAcademy: async () => {},
  canCreateAcademy: false,
});

// ----------------------
// AuthProvider
// ----------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  // ----------------------
  // Logout
  // ----------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ----------------------
  // Update active academy
  // ----------------------
  const updateActiveAcademy = async (academyId: number) => {
    if (!user) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academies/switch/${academyId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to switch academy');

      const data = await res.json();

      const updatedUser: User = {
        ...user,
        token: data.token,
        activeAcademyId: data.currentAcademy?.id || academyId,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('token', data.token);
    } catch (err) {
      console.error('Error switching academy:', err);
    }
  };

  // ----------------------
  // Check if user can create academy
  // ----------------------
  const canCreateAcademy = user?.role === 'Admin'; // Only Admin now

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, updateActiveAcademy, canCreateAcademy }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------
// Custom hook
// ----------------------
export const useAuth = () => useContext(AuthContext);
