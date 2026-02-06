import { useEffect, useState } from "react";
import API from "../utils/api";
import { formatINR } from "../utils/format"; // ✅ ADDED

/* ------------------ MAIN COMPONENT ------------------ */

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* ---------------- FETCH ACCOUNTS ---------------- */

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/accounts/");
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load accounts. Please login again.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  /* ---------------- ADD ACCOUNT ---------------- */

  const addAccount = async (data) => {
    try {
      await API.post("/accounts/", data);
      alert("Account added successfully");
      setShowModal(false);
      fetchAccounts(); // reload accounts
    } catch (err) {
      console.error(err);
      alert("Error while adding account");
    }
  };

  /* ---------------- DELETE ACCOUNT ---------------- */

  const deleteAccount = async (id) => {
    try {
      await API.delete(`/accounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Account deleted successfully");
      fetchAccounts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete account");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-gray-500">Manage all your connected accounts</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-5 py-2 rounded-lg"
        >
          + Add Account
        </button>
      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">
        <Summary label="Total Accounts" value={accounts.length} />

        <Summary
          label="Total Balance"
          value={formatINR(
            accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)
          )}
        />

        <Summary
          label="Positive Accounts"
          value={accounts.filter((a) => a.balance > 0).length}
        />
      </div>

      {/* ACCOUNTS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <AccountCard key={acc.id} acc={acc} onDelete={deleteAccount} />
        ))}
      </div>

      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onSave={addAccount}
        />
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Summary({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function AccountCard({ acc, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-3">
      <h3 className="text-xl font-semibold">{acc.bank_name}</h3>

      <p className="text-gray-500">{acc.account_type}</p>

      <p
        className={`text-2xl font-bold ${
          acc.balance >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {formatINR(acc.balance)}
      </p>

      <button
        onClick={() => onDelete(acc.id)}
        className="text-sm text-red-500 underline"
      >
        Delete Account
      </button>
    </div>
  );
}

/* ---------------- ADD ACCOUNT MODAL ---------------- */

function AddAccountModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    bank_name: "",
    account_type: "Savings",
    balance: 0,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.bank_name || !form.account_type) {
      alert("Please fill all required fields");
      return;
    }

    onSave({
      bank_name: form.bank_name,
      account_type: form.account_type,
      balance: Number(form.balance || 0),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Account</h2>

        <label>Bank Name</label>
        <input
          name="bank_name"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          onChange={handleChange}
        />

        <label>Account Type</label>
        <select
          name="account_type"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          onChange={handleChange}
        >
          <option>Savings</option>
          <option>Checking</option>
          <option>Credit</option>
          <option>Investment</option>
        </select>

        <label>Initial Balance</label>
        <input
          type="number"
          name="balance"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-blue-900 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
