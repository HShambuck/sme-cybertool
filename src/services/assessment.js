// services/assessment.js
import API from "./api";

export const createAssessment = async (assessmentData) => {
  try {
    console.log("📤 Sending assessment to backend...");
    const response = await API.post("/assessments", assessmentData);
    console.log("✅ Backend response received:", response.status);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating assessment:", error);

    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timed out. The assessment is taking longer than expected."
      );
    } else if (error.response) {
      throw new Error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

export const getLatestAssessment = async () => {
  try {
    const response = await API.get("/assessments/latest");
    return response.data;
  } catch (error) {
    console.error("Error fetching latest assessment:", error);
    throw error;
  }
};

export const getAllAssessments = async () => {
  try {
    const response = await API.get("/assessments");
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

export const scoreAssessment = async (responses) => {
  try {
    const response = await API.post("/assessments/score", { responses });
    return response.data;
  } catch (error) {
    console.error("Error scoring assessment:", error);
    throw error;
  }
};
