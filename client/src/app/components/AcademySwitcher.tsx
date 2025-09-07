"use client";

import { useAcademy } from "@/app/context/AcademyContext";

const AcademySwitcher = () => {
  const { academies, currentAcademy, handleAcademySwitch } = useAcademy();

  if (!academies.length) return <p>No academies found.</p>;

  return (
    <div>
      <h2>Select Active Academy</h2>
      <ul>
        {academies.map((academy) => (
          <li key={academy.id} style={{ marginBottom: "8px" }}>
            <button
              onClick={() => handleAcademySwitch(academy)}
              style={{
                fontWeight: currentAcademy?.id === academy.id ? "bold" : "normal",
                backgroundColor:
                  currentAcademy?.id === academy.id ? "#d1fae5" : "#f3f4f6",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {academy.name} {academy.status ? `(${academy.status})` : ""}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademySwitcher;
