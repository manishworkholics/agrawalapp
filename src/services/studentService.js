import api from "./api";

export const getStudentIds = async (mobile) => {

  const res = await api.get(
    `/combine/getRelatedProfile?mobilenumber=${mobile}`
  );

  return res.data;

};

export const updateStudentTabStatus = async (id, mobile, status) => {

  const res = await api.post(
    "/combine/updateStudentTabStatus",
    {
      student_main_id: id,
      mobile: mobile,
      status: status
    }
  );

  return res.data;

};