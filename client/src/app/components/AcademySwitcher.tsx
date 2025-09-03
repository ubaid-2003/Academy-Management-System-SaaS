"use client";

import { useUserAcademies } from "../hooks/useUserAcademies";
import { switchAcademy } from "../hooks/useSwitchAcademy";
import { useState } from "react";

const AcademySwitcher = () => {
  const { academies, loading, error } = useUserAcademies();
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleSwitch = async (id: number) => {
    try {
      await switchAcademy(id);
      setActiveId(id);
      alert("Switched academy successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading academies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Select Active Academy</h2>
      <ul>
        {academies.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => handleSwitch(a.id)}
              style={{
                fontWeight: activeId === a.id ? "bold" : "normal",
              }}
            >
              {a.name} ({a.role})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademySwitcher;
