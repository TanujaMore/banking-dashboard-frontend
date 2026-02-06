import { useState } from "react";

export default function BillForm({ onAdd, onClose }) {
  const [billerName, setBillerName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [autoPay, setAutoPay] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    onAdd({
      biller_name: billerName,
      amount_due: Number(amount),
      due_date: dueDate,        // YYYY-MM-DD
      auto_pay: autoPay,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end">
      <form
        onSubmit={submit}
        className="bg-white w-96 p-6 space-y-4"
      >
        <h2 className="text-xl font-bold">Add Bill</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Biller Name"
          value={billerName}
          onChange={(e) => setBillerName(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={autoPay}
            onChange={(e) => setAutoPay(e.target.checked)}
          />
          Auto Pay
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Save Bill
          </button>
        </div>
      </form>
    </div>
  );
}
