// src/services/auth.js
import API from "./api";

export const loginUser = async (email, password) => {
  const { data } = await API.post("/users/login", { email, password });
  localStorage.setItem("token", data.token);
  return data;
};

// Updated registerUser to match backend
export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  phone,
}) => {
  const contactPerson = `${firstName} ${lastName}`;
  const { data } = await API.post("/users/register", {
    email,
    password,
    companyName,
    contactPerson,
    phone,
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};
