import { useState, useEffect } from "react";
import API from "../lib/api";

export interface UserAcademy {
  id: number;
  name: string;
  status: string;
  role: string;
}

export const useUserAcademies = () => {
  const [academies, setAcademies] = useState<UserAcademy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademies = async () => {
    try {
      setLoading(true);
      const res = await API.get<UserAcademy[]>("/academies/user");
      setAcademies(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch academies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  return { academies, loading, error, fetchAcademies };
};
