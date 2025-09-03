import API from "../lib/api";

export const switchAcademy = async (academyId?: number) => {
  try {
    const url = academyId ? `/academies/switch/${academyId}` : `/academies/switch`;
    const res = await API.post(url);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to switch academy");
  }
};
