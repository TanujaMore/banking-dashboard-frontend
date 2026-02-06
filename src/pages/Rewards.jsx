import { useEffect, useState } from "react";
import API from "../utils/api";
import { fetchRewards } from "../services/rewardsService";

const MIN_REDEEM_POINTS = 10;

const getRewardLevel = (points) => {
  if (points >= 2000) return "💎 Platinum";
  if (points >= 1500) return "🥇 Gold";
  if (points >= 1000) return "🥈 Silver";
  return "🥉 Bronze";
};

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  // =============================
  // LOAD DATA
  // =============================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const rewardData = await fetchRewards();
    setRewards(rewardData);

    const accRes = await API.get("/accounts");
    setAccounts(accRes.data);

    if (accRes.data.length && !accountId) {
      setAccountId(accRes.data[0].id);
    }
  };

  // =============================
  // CALCULATIONS
  // =============================
  const bankReward = rewards.find(
    (r) => r.program_name === "Bank Rewards"
  );

  const totalPoints = bankReward?.points_balance || 0;

  // Only redeem points divisible by 10
  const redeemablePoints = Math.floor(totalPoints / 10) * 10;
  const redeemValue = redeemablePoints / 10;

  // =============================
  // REDEEM ACTION
  // =============================
  const redeem = async () => {
    if (
      redeemablePoints < MIN_REDEEM_POINTS ||
      !accountId
    )
      return;

    try {
      setRedeeming(true);

      const res = await API.post(
        `/rewards/redeem?account_id=${accountId}&points=${redeemablePoints}`
      );

      alert(
        `₹${res.data.credited_amount} credited successfully\nRemaining points: ${res.data.remaining_points}`
      );

      await loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Redeem failed");
    } finally {
      setRedeeming(false);
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rewards</h1>

      {/* SUMMARY */}
      <div className="bg-purple-600 text-white p-6 rounded-xl">
        <p>Total Reward Points</p>
        <p className="text-3xl font-bold">{totalPoints}</p>
        <p>Level: {getRewardLevel(totalPoints)}</p>
      </div>

      {/* REDEEM */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <p className="font-medium">
          Redeem Value: ₹{redeemValue}
        </p>

        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.bank_name} ({a.account_type})
            </option>
          ))}
        </select>

        <button
          disabled={
            redeeming ||
            redeemablePoints < MIN_REDEEM_POINTS ||
            !accountId
          }
          onClick={redeem}
          className={`w-full py-2 rounded text-white ${
            redeemablePoints < MIN_REDEEM_POINTS
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600"
          }`}
        >
          {redeeming ? "Redeeming..." : "Redeem Rewards"}
        </button>

        {redeemablePoints < MIN_REDEEM_POINTS && (
          <p className="text-sm text-red-500">
            Minimum {MIN_REDEEM_POINTS} points required to redeem
          </p>
        )}

        <p className="text-sm text-gray-500">
          💡 10 reward points = ₹1 credited to your account
        </p>
      </div>
    </div>
  );
}
