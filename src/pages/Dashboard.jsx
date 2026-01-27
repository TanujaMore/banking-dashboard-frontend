import { useEffect, useState } from "react";
import API from "../utils/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

/*
  This component ONLY displays data received from backend.
*/

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
  /* ---------------- DATA STATES ---------------- */
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);

  /* ---------------- CURRENCY ---------------- */
  const [currency, setCurrency] = useState("INR");

  const convert = (amount) =>
    amount != null
      ? (Number(amount) * CURRENCIES[currency].rate).toFixed(2)
      : "-";

  /* ---------------- NOTIFICATIONS ---------------- */
  const [notifications, setNotifications] = useState([]);

  /* ---------------- LOAD DASHBOARD DATA ---------------- */
  useEffect(() => {
    async function loadDashboard() {
      try {
        // 🔹 Load all transactions
        const txRes = await API.get("/transactions");
        const allTx = txRes.data;

        // 🔹 Sort by latest date and take 5 recent
        const recentTx = allTx
          .slice()
          .sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date))
          .slice(0, 5);

        setTransactions(recentTx);

        // 🔹 Load accounts
        const accRes = await API.get("/accounts");
        const accounts = accRes.data;

        // 🔹 Calculate summary from backend data
        let totalBalance = 0;
        accounts.forEach((acc) => (totalBalance += acc.balance));

        let income = 0;
        let expenses = 0;

        allTx.forEach((tx) => {
          if (tx.txn_type === "credit") income += Number(tx.amount);
          if (tx.txn_type === "debit") expenses += Number(tx.amount);
        });

        setSummary({
          balance: totalBalance,
          accounts: accounts.length,
          income: income,
          expenses: expenses,
        });

        // 🔹 Load categorized spend for pie chart
        const catRes = await API.get("/transactions/category-summary");
        setCategorySummary(catRes.data);

      } catch (error) {
        console.log("Dashboard backend error", error);
      }
    }

    loadDashboard();
  }, []);

  /* ---------------- NOTIFICATION EFFECT ---------------- */
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    transactions.forEach((tx) => {
      if (tx.txn_type === "credit") {
        notify(`Credited ${CURRENCIES[currency].symbol}${convert(tx.amount)}`);
      } else if (tx.txn_type === "debit") {
        notify(`Debited ${CURRENCIES[currency].symbol}${convert(tx.amount)}`);
      }
    });
    // eslint-disable-next-line
  }, [transactions]);

  const notify = (message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // -------- CATEGORY SPEND DATA FOR PIE CHART (ONLY DEBIT) --------
  const pieData = categorySummary.map((item) => ({
    name: item.category || "Others",
    value: item.total,
  }));

  return (
    <div className="space-y-6 relative">

      {/* NOTIFICATIONS */}
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

        {/* CURRENCY SELECTOR */}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`${CURRENCIES[currency].symbol}${convert(summary?.balance)}`}
        />
        <StatCard title="Total Accounts" value={summary?.accounts} />
        <StatCard
          title="Monthly Income"
          value={`${CURRENCIES[currency].symbol}${convert(summary?.income)}`}
          positive
        />
        <StatCard
          title="Monthly Expenses"
          value={`${CURRENCIES[currency].symbol}${convert(summary?.expenses)}`}
          negative
        />
      </div>

      {/* CHART + TRANSACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 🔹 CATEGORIZED SPEND CHART */}
        <div className="md:col-span-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Spending Distribution</h2>

          {pieData.length === 0 ? (
            <p className="text-gray-400">No spending data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="md:col-span-2 bg-white rounded-xl shadow">
          <div className="p-6 border-b flex justify-between">
            <div>
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <p className="text-gray-500 text-sm">
                Your latest financial activity
              </p>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm border-b">
              <tr>
                <th className="p-4">Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {transactions?.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="p-4">
                    {tx.txn_date?.slice(0, 10)}
                  </td>
                  <td className="font-medium">{tx.description}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                      {tx.category || "Others"}
                    </span>
                  </td>
                  <td
                    className={
                      tx.txn_type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {CURRENCIES[currency].symbol}
                    {convert(tx.amount)}
                  </td>
                  <td>{tx.txn_type === "credit" ? "⬆️" : "⬇️"}</td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* THIS MONTH */}
      <div className="bg-white rounded-xl shadow p-6 w-[300px]">
        <h2 className="text-xl font-bold mb-4">This Month</h2>

        <SummaryRow
          label="Income"
          value={`${CURRENCIES[currency].symbol}${convert(summary?.income)}`}
          positive
        />
        <SummaryRow
          label="Expenses"
          value={`${CURRENCIES[currency].symbol}${convert(summary?.expenses)}`}
          negative
        />

        <hr className="my-4" />

        <SummaryRow
          label="Net"
          value={
            summary
              ? `${CURRENCIES[currency].symbol}${convert(
                  summary.income - summary.expenses
                )}`
              : "-"
          }
          positive
        />
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function StatCard({ title, value, positive, negative }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500">{title}</h3>
      <p
        className={`text-2xl font-bold mt-2 ${
          positive
            ? "text-green-600"
            : negative
            ? "text-red-600"
            : ""
        }`}
      >
        {value ?? "-"}
      </p>
    </div>
  );
}

function SummaryRow({ label, value, positive, negative }) {
  return (
    <div className="flex justify-between mb-3">
      <span>{label}</span>
      <span
        className={
          positive
            ? "text-green-600"
            : negative
            ? "text-red-600"
            : ""
        }
      >
        {value ?? "-"}
      </span>
    </div>
  );
}
