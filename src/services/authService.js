import api from "./api";

export const loginUser = async mobile => {

  const res = await api.post("/login", {
    mobile
  });

  return res.data;

};