import api from "./api";

export const getSchools = async () => {

  const res = await api.get("/schools");

  return res.data;

};