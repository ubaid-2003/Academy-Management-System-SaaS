"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// 1️⃣ Define Academy type
export interface Academy {
  id: number;
  name: string;
  location: string;
}

// 2️⃣ Define context type
interface AcademyContextType {
  academies: Academy[];
  currentAcademy: Academy | null;
  switchAcademy: (academy: Academy) => void;
  loading: boolean;
}

// 3️⃣ Create context with default values
const AcademyContext = createContext<AcademyContextType>({
  academies: [],
  currentAcademy: null,
  switchAcademy: () => {},
  loading: true,
});

// 4️⃣ Provider with typed children
export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [currentAcademy, setCurrentAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        const res = await axios.get("/api/academies"); // your backend endpoint
        setAcademies(res.data);
        setCurrentAcademy(res.data[0] || null); // default to first academy
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAcademies();
  }, []);

  const switchAcademy = (academy: Academy) => {
    setCurrentAcademy(academy);
  };

  return (
    <AcademyContext.Provider value={{ academies, currentAcademy, switchAcademy, loading }}>
      {children}
    </AcademyContext.Provider>
  );
};

// 5️⃣ Hook to use context
export const useAcademy = () => useContext(AcademyContext);
