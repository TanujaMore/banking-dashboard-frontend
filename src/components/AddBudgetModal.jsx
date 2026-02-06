import { useState, useEffect } from "react";

export default function AddBudgetModal({ isOpen, onClose, onAdd, onUpdate, initialData }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  // 🔹 Prefill when editing
  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month);
      setYear(initialData.year);
      setCategory(initialData.category);
      setLimit(initialData.limit_amount);
    } else {
      setMonth("");
      setYear("");
      setCategory("");
      setLimit("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!month || !year || !category || !limit) {
      alert("Please fill all fields");
      return;
    }

    const data = {
      month: Number(month),
      year: Number(year),
      category,
      limit_amount: Number(limit),
    };

    if (initialData) {
      // 🔥 EDIT MODE
      onUpdate(initialData.id, data);
    } else {
      // 🔥 ADD MODE
      onAdd(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-6 space-y-4">

        <h2 className="text-xl font-bold">
          {initialData ? "Edit Budget" : "Add Budget"}
        </h2>

        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="number"
          placeholder="Year (e.g. 2026)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Category (Food, Education, etc.)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="number"
          placeholder="Limit Amount"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
