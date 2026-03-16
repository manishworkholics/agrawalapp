import api from "./api";

export const getRelatedProfile = async (mobile) => {

  const res = await api.get(
    `/combine/getRelatedProfile?mobilenumber=${mobile}`
  );

  return res.data;

};