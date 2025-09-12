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

  // Fetch all academies for the user
  const fetchAcademies = async () => {
    if (!user?.token) return;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`);
      const data = await res.json().catch(() => []);
      const dataArray: Academy[] = Array.isArray(data) ? data : [];

      setAcademies(dataArray);

      // Determine active academy
      const active = dataArray.find(a => a.id === user.activeAcademyId) || dataArray[0] || null;
      setCurrentAcademy(active);

      if (active && !user.activeAcademyId) {
        await handleAcademySwitch(active);
      }
    } catch (err) {
      console.error('Error fetching academies:', err);
      setAcademies([]);
      setCurrentAcademy(null);
    }
  };

  // Switch active academy
  const handleAcademySwitch = async (academy: Academy) => {
    if (!user) return;

    // 🚀 Optimistic update
    setCurrentAcademy(academy);
    const optimisticUser: User = {
      ...user,
      activeAcademyId: academy.id,
    };
    setUser(optimisticUser);
    localStorage.setItem("user", JSON.stringify(optimisticUser));

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/academies/switch/${academy.id}`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => ({}));

      const newActiveAcademy = data.currentAcademy || academy;

      // ✅ Final update from backend
      const updatedUser: User = {
        ...user,
        token: data.token || user.token,
        activeAcademyId: newActiveAcademy.id,
        academyIds: data.academyIds || user.academyIds || [],
        permissions: data.permissions || user.permissions || [],
      };

      setCurrentAcademy(newActiveAcademy);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", updatedUser.token);
    } catch (err) {
      console.error("Switch academy error:", err);
      alert("Failed to switch academy. Please try again.");

      // ❌ Rollback if error
      await fetchAcademies();
    }
  };


  const createAcademy = async (academyData: Partial<Academy>) => {
    if (!user?.token) return null;

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/academies`, {
        method: "POST",
        body: JSON.stringify(academyData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create academy");

      const resJson = await res.json().catch(() => ({}));
      const academy: Academy = resJson.academy;

      // ✅ Update state immediately
      setAcademies((prev) => [...prev, academy]);
      setCurrentAcademy(academy);

      // ✅ Refresh academies in background to stay in sync
      refreshAcademies();

      const updatedUser: User = {
        ...user,
        token: resJson.token || user.token,
        activeAcademyId: academy.id,
        academyIds: [...(user.academyIds || []), academy.id],
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", updatedUser.token);

      return academy;
    } catch (err) {
      console.error("Error creating academy:", err);
      return null;
    }
  };


  const refreshAcademies = async () => fetchAcademies();

  useEffect(() => {
    if (user?.token) fetchAcademies();
  }, [user]);

  return (
    <AcademyContext.Provider
      value={{ academies, currentAcademy, handleAcademySwitch, createAcademy, refreshAcademies }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used inside AcademyProvider');
  return context;
};
