import React, { useState } from "react";

const AddBudgetModal = ({ isOpen, onClose, onAdd }) => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!category || !limit) return;

    const newBudget = {
      category: category,
      limit_amount: Number(limit),
      month: Number(month),
      year: Number(year),
    };

    onAdd(newBudget);
    setCategory("");
    setLimit("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Add Monthly Budget</h2>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            type="text"
            placeholder="Food, Travel, Education..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Monthly Limit</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <div>
            <label className="block text-sm mb-1">Month</label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-black"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Add Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
