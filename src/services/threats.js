// src/services/threats.js
import API from "./api";

export const getThreatUpdates = async () => {
  try {
    const response = await API.get("/threats");
    return response.data;
  } catch (error) {
    console.error("Error fetching threat updates:", error);
    throw error;
  }
};

export const getThreatById = async (id) => {
  try {
    const response = await API.get(`/threats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching threat:", error);
    throw error;
  }
};

export const filterThreatsBySeverity = async (severity) => {
  try {
    const response = await API.get(`/threats/filter/severity/${severity}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering threats:", error);
    throw error;
  }
};

export const filterThreatsByCategory = async (category) => {
  try {
    const response = await API.get(`/threats/filter/category/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering threats:", error);
    throw error;
  }
};
