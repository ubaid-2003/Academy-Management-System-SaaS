"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth, User } from "./AuthContext";

// ---------------------------
// Academy interface
// ---------------------------
export interface Academy {
  id: number;
  name: string;
  status?: string;
  principalName?: string;
  totalStudents?: number;
  totalTeachers?: number;
}

// ---------------------------
// Context type
// ---------------------------
interface AcademyContextType {
  academies: Academy[];
  currentAcademy: Academy | null;
  handleAcademySwitch: (academy: Academy) => Promise<void>;
  createAcademy: (academyData: Partial<Academy>) => Promise<Academy | null>;
  refreshAcademies: () => Promise<void>;
}

// ---------------------------
// Create context
// ---------------------------
const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

// ---------------------------
// Provider component
// ---------------------------
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || "Failed to fetch academies");
      }

      const data: Academy[] = await res.json();
      setAcademies(Array.isArray(data) ? data : []);

      const active =
        data.find((a) => a.id === Number(user?.activeAcademyId)) || data[0] || null;

      if (active) {
        setCurrentAcademy(active);
        if (!user?.activeAcademyId) {
          await handleAcademySwitch(active);
        }
      }
    } catch (err) {
      console.error("Error fetching academies:", err);
    }
  };

  // ---------------------------
  // Switch academy globally
  // ---------------------------
  const handleAcademySwitch = async (academy: Academy) => {
    if (!user) return;

    try {
      const res = await fetchWithAuth(`/academies/switch/${academy.id}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to switch academy");
      }

      const data = await res.json();
      const newUser: User = {
        ...user,
        token: data.token || user.token,
        activeAcademyId: data.currentAcademy?.id || academy.id,
      };

      setUser(newUser);
      setCurrentAcademy(data.currentAcademy || academy);
      console.log("Switched academy:", data.currentAcademy?.name || academy.name);
    } catch (err) {
      console.error("Switch academy error:", err);
    }
  };

  // ---------------------------
  // Create academy
  // ---------------------------
  const createAcademy = async (academyData: Partial<Academy>) => {
    if (!user?.token) return null;

    try {
      const res = await fetchWithAuth(`/academies`, {
        method: "POST",
        body: JSON.stringify(academyData),
      });

      if (!res.ok) {
        const resJson = await res.json().catch(() => ({}));
        throw new Error(resJson.message || "Failed to create academy");
      }

      const resJson = await res.json();
      const academy: Academy = resJson.academy;

      // Update state
      setAcademies((prev) => [...prev, academy]);
      setCurrentAcademy(academy);

      const updatedUser: User = {
        ...user,
        activeAcademyId: academy.id,
        academyIds: [...(user.academyIds || []), academy.id],
        token: user.token,
      };
      setUser(updatedUser);

      return academy;
    } catch (err) {
      console.error("Error creating academy:", err);
      return null;
    }
  };

  // ---------------------------
  // Refresh academies manually
  // ---------------------------
  const refreshAcademies = async () => {
    await fetchAcademies();
  };

  // ---------------------------
  // Fetch academies on user load
  // ---------------------------
  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role === "admin" || role === "superadmin") {
        fetchAcademies();
      }
    }
  }, [user]);

  return (
    <AcademyContext.Provider
      value={{
        academies,
        currentAcademy,
        handleAcademySwitch,
        createAcademy,
        refreshAcademies,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

// ---------------------------
// Hook to use academy context
// ---------------------------
export const useAcademy = (): AcademyContextType => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error("useAcademy must be used inside AcademyProvider");
  return context;
};
