import axios from "axios";

const token = localStorage.getItem("token");


const API = axios.create({
  baseURL: "https://talimhubapi.resume360.uz/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});

export default API;

export const API_URL = "https://talimhubapi.resume360.uz/api/v1";