import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Add interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- AUTH --------------------
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  // store token in localStorage
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (credentials) => {
  const res = await api.post("/auth/register", credentials);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const addEmployee = async (employeeData) => {
  const res = await api.post("/admin/employees", employeeData);
  return res.data;
};

export const addDepartment = async (departmentData) => {
  const res = await api.post("/dropdowns/departments", departmentData);
  return res.data;
};

export const addDesignation = async (designationData) => {
  const res = await api.post("/dropdowns/designations", designationData);
  return res.data;
};

export const addLocation = async (locationData) => {
  const res = await api.post("/dropdowns/locations", locationData);
  return res.data;
};

export const fetchEmployees = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/employees?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const updateEmployee = async (empNo, employeeData) => {
  try {
    const res = await api.put(`/admin/employees/${empNo}`, employeeData);
    return res.data;
  } catch (err) {
    if (err.response) throw err.response.data;
    throw err;
  }
};

export const deleteEmployee = async (empNo) => {
  try {
    const res = await api.delete(`/admin/employees/${empNo}`);
    return res.data;
  } catch (err) {
    if (err.response) throw err.response.data;
    throw err;
  }
};

// Dropdowns
export const fetchDepartments = async () => {
  const response = await api.get("/dropdowns/departments");
  return response.data;
};

export const fetchLocations = async () => {
  const response = await api.get("/dropdowns/locations");
  return response.data;
};

export const fetchDesignations = async () => {
  const response = await api.get("/dropdowns/designations");
  return response.data;
};
