import api from "./api";

export const getFeesDetails = async (mobile) => {

  const res = await api.get(
    `/fees/getFeesDetail?mobilenumber=${mobile}`
  );

  return res.data;

};