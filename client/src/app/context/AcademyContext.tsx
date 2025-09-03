"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth, User } from "./AuthContext";

export interface Academy {
  id: number;
  name: string;
  location?: string;
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
  const { user, setUser } = useAuth();
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [currentAcademy, setCurrentAcademy] = useState<Academy | null>(null);

  // ---------------------------
  // Fetch academies for user
  // ---------------------------
  const fetchAcademies = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academies/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch academies");

      const data: Academy[] = await res.json();
      setAcademies(data);

      // Determine active academy
      const active =
        data.find((a) => a.id === Number(user?.activeAcademyId)) || data[0];

      if (active) {
        setCurrentAcademy(active);

        // Auto-switch if user has no activeAcademyId
        if (!user?.activeAcademyId) {
          try {
            await handleAcademySwitch(active);
          } catch (err) {
            console.error("Failed to auto-switch academy:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching academies:", err);
    }
  };

  // Fetch academies on user load or role change
  useEffect(() => {
    if (!user) return;
    const role = user.role?.toLowerCase();
    if (role === "admin" || role === "superadmin") {
      fetchAcademies();
    }
  }, [user]);

  // ---------------------------
  // Switch academy safely
  // ---------------------------
  const handleAcademySwitch = async (academy: Academy) => {
    if (!user) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/academies/switch/${academy.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to switch academy");

      const data = await res.json();

      // Always preserve current token if API does not return one
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
      // Do not logout automatically, just preserve user
    }
  };

  // ---------------------------
  // Create academy safely
  // ---------------------------
  const createAcademy = async (academyData: Partial<Academy>) => {
    if (!user?.token) return null;

    try {
      // 1. Create academy
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(academyData),
      });

      if (!res.ok) throw new Error("Failed to create academy");
      const academy: Academy = await res.json();

      // 2. Link user with academy
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-academies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, academyId: academy.id }),
      });

      // 3. Update state safely
      setAcademies((prev) => [...prev, academy]);
      setCurrentAcademy(academy);

      const updatedUser: User = {
        ...user,
        token: user.token, // preserve token
        activeAcademyId: academy.id,
        academyIds: [...(user.academyIds || []), academy.id],
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

  return (
    <AcademyContext.Provider
      value={{ academies, currentAcademy, handleAcademySwitch, createAcademy, refreshAcademies }}
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
