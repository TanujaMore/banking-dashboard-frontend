import api from "../utils/api";

export const fetchRewards = async () => {
  const res = await api.get("/rewards");
  return res.data;
};

export const addRewardApi = async (reward) => {
  const res = await api.post("/rewards", reward);
  return res.data;
};

export const updateRewardApi = async (id, data) => {
  const res = await api.put(`/rewards/${id}`, data);
  return res.data;
};
export const deleteRewardApi = async (id) => {
  const res = await api.delete(`/rewards/${id}`);
  return res.data;
};
export const redeemRewards = async (accountId) => {
  const res = await API.post(`/rewards/redeem?account_id=${accountId}`);
  return res.data;
};