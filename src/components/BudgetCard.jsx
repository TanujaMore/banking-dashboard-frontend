import React from "react";

export default function BudgetCard({
  id,
  category,
  spent_amount,
  limit_amount,
  warning,
  onDelete,
  onEdit
}) {
  const percent = Math.min((spent_amount / limit_amount) * 100, 100);
  const isExceeded = spent_amount > limit_amount;

  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-3">

      {/* HEADER (only once) */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{category}</h3>

        <div className="flex gap-3">
          {/* EDIT */}
          <button
            onClick={() => onEdit({ id, category, spent_amount, limit_amount, warning })}
            className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
          >
            Edit
          </button>

          {/* DELETE */}
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>

      {/* DETAILS */}
      <p className="text-sm text-gray-600">
        Spent: ₹{spent_amount} / ₹{limit_amount}
      </p>

      {/* PROGRESS BAR */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${isExceeded ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* STATUS / WARNING */}
      {isExceeded ? (
        <p className="text-sm font-semibold text-red-600">⚠ Budget limit exceeded</p>
      ) : (
        <p className="text-sm font-semibold text-green-600">Within limit</p>
      )}
    </div>
  );
}
