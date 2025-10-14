import API from "./api";

// Get current logged in user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // fetch token from storage
    if (!token) throw new Error("No token found");

    const response = await API.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`, // attach token
      },
    });

    return response.data; // this will be { _id, email, companyName, contactPerson, avatar }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
