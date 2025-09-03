'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | string;
  avatar?: string;
  token: string;
  activeAcademyId?: number;
  academyIds?: number[];
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateActiveAcademy: (academyId: number) => Promise<void>;
  canCreateAcademy: boolean;
  activeAcademyId?: number;
  academyIds: number[];
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  logout: () => { },
  updateActiveAcademy: async () => { },
  canCreateAcademy: false,
  activeAcademyId: undefined,
  academyIds: [],
  fetchWithAuth: async () => new Response(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // ✅ Load user from localStorage on mount
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
        localStorage.removeItem('token');
      }
    }
  }, []);

  // ✅ Sync user → localStorage
  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ✅ Switch active academy
  const updateActiveAcademy = async (academyId: number) => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/academies/switch/${academyId}`, {
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
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('token', updatedUser.token);
    } catch (err) {
      console.error('Error switching academy:', err);
      alert('Failed to switch academy. Please try again.');
    }
  };

  // ✅ Fetch with Auth wrapper
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!user?.token) throw new Error('No token found');

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${user.token}`,
    };

    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) logout();
    return res;
  };

  // ✅ Admin check (case insensitive)
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

export const useAuth = () => useContext(AuthContext);
