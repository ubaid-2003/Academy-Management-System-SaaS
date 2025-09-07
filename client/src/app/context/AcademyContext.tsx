'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, User } from './AuthContext';

export interface Academy {
  id: number;
  name: string;
  status?: string;
  principalName?: string;
  totalStudents?: number;
  totalTeachers?: number;
}

interface AcademyContextType {
  academies: Academy[];
  currentAcademy: Academy | null;
  handleAcademySwitch: (academy: Academy) => Promise<void>;
  createAcademy: (academyData: Partial<Academy>) => Promise<Academy | null>;
  refreshAcademies: () => Promise<void>;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, fetchWithAuth } = useAuth();
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [currentAcademy, setCurrentAcademy] = useState<Academy | null>(null);

  // ---------------------------
  // Fetch academies for logged-in user
  // ---------------------------
  const fetchAcademies = async () => {
    if (!user?.token) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`);
      const data = await res.json().catch(() => []);

      // Ensure data is always an array
      const dataArray: Academy[] = Array.isArray(data) ? data : [];

      setAcademies(dataArray);

      // Pick active academy
      const active =
        dataArray.find((a) => a.id === Number(user?.activeAcademyId)) ||
        dataArray[0] ||
        null;

      setCurrentAcademy(active);

      // Switch academy if no activeAcademyId
      if (active && !user.activeAcademyId) {
        await handleAcademySwitch(active);
      }
    } catch (err) {
      console.error('Error fetching academies:', err);
      setAcademies([]);
      setCurrentAcademy(null);
    }
  };

  // ---------------------------
  // Switch academy
  // ---------------------------
  const handleAcademySwitch = async (academy: Academy) => {
    if (!user) return;

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/academies/switch/${academy.id}`,
        { method: 'POST' }
      );

      const data = await res.json().catch(() => ({}));

      const newActiveAcademy = data.currentAcademy || academy;

      setCurrentAcademy(newActiveAcademy);

      setUser({
        ...user,
        token: data.token || user.token,
        activeAcademyId: newActiveAcademy.id,
      });
    } catch (err) {
      console.error('Switch academy error:', err);
      alert('Failed to switch academy. Please try again.');
    }
  };

  // ---------------------------
  // Create academy
  // ---------------------------
  const createAcademy = async (academyData: Partial<Academy>) => {
    if (!user?.token) return null;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies`, {
        method: 'POST',
        body: JSON.stringify(academyData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || 'Failed to create academy');
      }

      const resJson = await res.json().catch(() => ({}));
      const academy: Academy = resJson.academy;

      // Update local state
      setAcademies((prev) => [...prev, academy]);
      setCurrentAcademy(academy);

      setUser({
        ...user,
        token: user.token, // token remains same after creation
        activeAcademyId: academy.id,
        academyIds: [...(user.academyIds || []), academy.id],
      });

      return academy;
    } catch (err) {
      console.error('Error creating academy:', err);
      return null;
    }
  };

  const refreshAcademies = async () => {
    await fetchAcademies();
  };

  useEffect(() => {
    if (user) {
      fetchAcademies();
    }
  }, [user]);

  return (
    <AcademyContext.Provider
      value={{ academies, currentAcademy, handleAcademySwitch, createAcademy, refreshAcademies }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = (): AcademyContextType => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used inside AcademyProvider');
  return context;
};
