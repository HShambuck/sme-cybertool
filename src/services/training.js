// services/training.js
import API from "./api";

// Get all training modules
export const getAllModules = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.search) params.append("search", filters.search);

    const response = await API.get(`/training?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching training modules:", error);
    throw error;
  }
};

// Get single module by ID
export const getModuleById = async (id) => {
  try {
    const response = await API.get(`/training/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching module:", error);
    throw error;
  }
};

// Get modules by category
export const getModulesByCategory = async (category) => {
  try {
    const response = await API.get(`/training/category/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules by category:", error);
    throw error;
  }
};

// Get recommended modules
export const getRecommendedModules = async () => {
  try {
    const response = await API.get("/training/recommended");
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended modules:", error);
    throw error;
  }
};

// Start a module
export const startModule = async (moduleId) => {
  try {
    const response = await API.post(`/training/${moduleId}/start`);
    return response.data;
  } catch (error) {
    console.error("Error starting module:", error);
    throw error;
  }
};

// Update progress
export const updateProgress = async (moduleId, progressData) => {
  try {
    const response = await API.put(
      `/training/${moduleId}/progress`,
      progressData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};

// Complete module
export const completeModule = async (moduleId) => {
  try {
    const response = await API.post(`/training/${moduleId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error completing module:", error);
    throw error;
  }
};

// Submit quiz
export const submitQuiz = async (moduleId, answers) => {
  try {
    const response = await API.post(`/training/${moduleId}/quiz`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};

// Rate module
export const rateModule = async (moduleId, rating, feedback) => {
  try {
    const response = await API.post(`/training/${moduleId}/rate`, {
      rating,
      feedback,
    });
    return response.data;
  } catch (error) {
    console.error("Error rating module:", error);
    throw error;
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await API.get("/training/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
