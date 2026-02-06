import api from "../utils/api";

export const fetchBills = async () => {
  const res = await api.get("/bills");
  return res.data;
};

export const addBillApi = async (bill) => {
  const res = await api.post("/bills", bill);
  return res.data;
};

export const updateBillApi = async (id, data) => {
  const res = await api.put(`/bills/${id}`, data);
  return res.data;
};
