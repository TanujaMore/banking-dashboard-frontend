import { useEffect, useState, useRef } from "react";
import API from "../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "../utils/format";

/* ----------- CURRENCIES ----------- */
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0095 },
  JPY: { symbol: "¥", rate: 1.8 },
};

/* ----------- PIE COLORS ----------- */
const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#facc15",
  "#ef4444",
  "#14b8a6",
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  const [currency, setCurrency] = useState("INR");
  const [notifications, setNotifications] = useState([]);

  // 🔒 prevents repeated notifications
  const notifiedOnce = useRef(false);

  const convert = (amount) =>
    amount != null ? Number(amount) * CURRENCIES[currency].rate : 0;

  /* ---------------- LOAD DASHBOARD DATA ---------------- */
  useEffect(() => {
    async function loadDashboard() {
      try {
        // Transactions
        const txRes = await API.get("/transactions");
        const allTx = txRes.data;

        const recentTx = allTx
          .slice()
          .sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date))
          .slice(0, 5);

        setTransactions(recentTx);

        // Accounts
        const accRes = await API.get("/accounts");
        const accounts = accRes.data;

        let balance = 0;
        accounts.forEach((a) => (balance += a.balance));

        let income = 0;
        let expenses = 0;

        allTx.forEach((tx) => {
          if (tx.txn_type === "credit") income += Number(tx.amount);
          if (tx.txn_type === "debit") expenses += Number(tx.amount);
        });

        setSummary({
          balance,
          accounts: accounts.length,
          income,
          expenses,
        });

        // Category summary
        const catRes = await API.get("/transactions/category-summary");
        setCategorySummary(catRes.data);

        // Rewards
        const rewardRes = await API.get("/rewards");
        const totalRewards = rewardRes.data.reduce(
          (sum, r) => sum + Number(r.points_balance || 0),
          0
        );
        setRewardPoints(totalRewards);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    }

    loadDashboard();
  }, []);

  /* ---------------- NOTIFICATIONS (SHOW ONCE) ---------------- */
  useEffect(() => {
    if (!transactions.length) return;
    if (notifiedOnce.current) return;

    transactions.forEach((tx) => {
      if (tx.txn_type === "credit") {
        notify(`Credited ${formatINR(convert(tx.amount))}`);
      } else {
        notify(`Debited ${formatINR(convert(tx.amount))}`);
      }
    });

    notifiedOnce.current = true;
  }, [transactions]);

  const notify = (message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const pieData = categorySummary.map((item) => ({
    name: item.category || "Others",
    value: item.total,
  }));

  return (
    <div className="space-y-6 relative">
      {/* 🔔 NOTIFICATIONS */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-black text-white px-4 py-3 rounded-lg shadow"
          >
            🔔 {n.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {Object.keys(CURRENCIES).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard title="Total Balance" value={formatINR(convert(summary?.balance))} />
        <StatCard title="Accounts" value={summary?.accounts} />
        <StatCard title="Income" value={formatINR(convert(summary?.income))} positive />
        <StatCard title="Expenses" value={formatINR(convert(summary?.expenses))} negative />
        <StatCard title="Reward Points" value={formatINR(rewardPoints)} />
      </div>

      {/* CHART + TRANSACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Spending Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>

          <table className="w-full text-left">
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-4">{tx.txn_date?.slice(0, 10)}</td>
                  <td>{tx.description}</td>
                  <td>{tx.category}</td>
                  <td
                    className={
                      tx.txn_type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {tx.txn_type === "credit" ? "+" : "-"}
                    {formatINR(convert(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENT ---------------- */

function StatCard({ title, value, positive, negative }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500">{title}</h3>
      <p
        className={`text-2xl font-bold mt-2 ${
          positive ? "text-green-600" : negative ? "text-red-600" : ""
        }`}
      >
        {value ?? "-"}
      </p>
    </div>
  );
}
