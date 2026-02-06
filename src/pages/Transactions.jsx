import { useEffect, useState } from "react";
import API from "../utils/api";
import { formatINR } from "../utils/format";

/* ------------------ CURRENCIES ------------------ */
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0095 },
  JPY: { symbol: "¥", rate: 1.8 },
};

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState("INR");

  /* ------------------ ADD TRANSACTION STATES ------------------ */
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [txnDate, setTxnDate] = useState("");
  const [merchant, setMerchant] = useState("");

  /* ------------------ FETCH ACCOUNTS ------------------ */
  useEffect(() => {
    API.get("/accounts")
      .then((res) => {
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccount(res.data[0].id);
        }
      })
      .catch(() => alert("Failed to load accounts"));
  }, []);

  /* ------------------ FETCH TRANSACTIONS ------------------ */
  useEffect(() => {
    if (!selectedAccount) return;

    API.get(`/transactions/${selectedAccount}`)
      .then((res) => setTransactions(res.data))
      .catch(() => alert("Failed to load transactions"));
  }, [selectedAccount]);

  /* ------------------ FETCH CATEGORIES ------------------ */
  useEffect(() => {
    API.get("/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  /* ------------------ CSV IMPORT ------------------ */
  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    API.post("/transactions/upload-csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        alert("CSV uploaded successfully ✅");
        API.get(`/transactions/${selectedAccount}`).then((res) =>
          setTransactions(res.data)
        );
      })
      .catch(() => alert("CSV upload failed ❌"));
  };

  /* ------------------ ADD TRANSACTION ------------------ */
  const handleAddTransaction = () => {
    if (!desc || !amount) {
      alert("Please fill all fields");
      return;
    }

    API.post("/transactions/", {
      account_id: Number(selectedAccount),
      description: desc,
      merchant: merchant,
      amount: Number(amount),
      txn_type: type,
      currency: currency,
      txn_date: txnDate,
    })
      .then(() => {
        alert("Transaction added successfully ✅");

        setDesc("");
        setAmount("");
        setType("credit");
        setShowForm(false);
        setTxnDate("");
        setMerchant("");

        API.get(`/transactions/${selectedAccount}`).then((res) =>
          setTransactions(res.data)
        );
      })
      .catch(() => alert("Failed to add transaction ❌"));
  };

  /* ------------------ UPDATE CATEGORY ------------------ */
  const handleCategoryChange = (txnId, newCategory) => {
    API.put(`/transactions/${txnId}/category`, null, {
      params: { category: newCategory },
    })
      .then(() => {
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === txnId ? { ...tx, category: newCategory } : tx
          )
        );
      })
      .catch(() => alert("Failed to update category ❌"));
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-500">
            View and manage your transaction history
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* ACCOUNT SELECT */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.bank_name} ({acc.account_type})
              </option>
            ))}
          </select>

          {/* CURRENCY */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* CSV UPLOAD */}
          <label className="bg-blue-900 text-white px-4 py-2 rounded-lg cursor-pointer">
            ⬆ Import CSV
            <input type="file" accept=".csv" hidden onChange={handleCSV} />
          </label>

          {/* ADD BUTTON */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* ADD TRANSACTION FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow w-96">
          <h3 className="text-lg font-bold mb-4">Add Transaction</h3>

          <input
            type="text"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <input
            type="text"
            placeholder="Merchant (eg: Zomato, Amazon)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <input
            type="date"
            value={txnDate}
            onChange={(e) => setTxnDate(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-3"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
          >
            <option value="credit">Credit (Income)</option>
            <option value="debit">Debit (Expense)</option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleAddTransaction}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <p className="text-gray-500 text-sm">
            Showing {transactions.length} transactions
          </p>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">DESCRIPTION</th>
              <th className="px-6 py-3">MERCHANT</th>
              <th className="px-6 py-3">CATEGORY</th>
              <th className="px-6 py-3">CURRENCY</th>
              <th className="px-6 py-3 text-right">AMOUNT</th>
              <th className="px-6 py-3 text-center">TYPE</th>
              <th className="p-3">DATE</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{tx.id}</td>
                <td className="px-6 py-4 font-medium">{tx.description || "-"}</td>
                <td className="px-6 py-4">{tx.merchant || "-"}</td>

                <td className="px-6 py-4">
                  <select
                    value={tx.category || "Others"}
                    onChange={(e) =>
                      handleCategoryChange(tx.id, e.target.value)
                    }
                    className="border rounded px-3 py-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-6 py-4">{tx.currency || "INR"}</td>

                {/* ✅ FIXED AMOUNT WITH COMMAS */}
                <td
                  className={`px-6 py-4 text-right font-semibold ${
                    tx.txn_type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {tx.txn_type === "credit" ? "+" : "-"}
                  {formatINR(Math.abs(Number(tx.amount)))}
                </td>

                <td className="px-6 py-4 text-center">
                  {tx.txn_type === "credit" ? "⬇ Credit" : "⬆ Debit"}
                </td>

                <td className="p-3">
                  {tx.txn_date
                    ? new Date(tx.txn_date).toISOString().split("T")[0]
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
