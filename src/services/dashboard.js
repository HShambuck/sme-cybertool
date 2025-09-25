// services/dashboard.js
import API from "./api";

export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await API.get("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
