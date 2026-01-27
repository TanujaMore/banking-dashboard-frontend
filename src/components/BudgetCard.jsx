import API from "../utils/api";

export default function BudgetCard({
  id,
  category,
  spent_amount,
  limit_amount,
  warning,
  onDelete,
}) {
  const percent = Math.min((spent_amount / limit_amount) * 100, 100);

  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-2">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{category}</h3>

        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold"
        >
          Delete
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Spent: ₹{spent_amount} / ₹{limit_amount}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${
            spent_amount > limit_amount ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Warning */}
      <p
        className={`text-sm font-semibold ${
          warning?.includes("exceeded") ? "text-red-600" : "text-green-600"
        }`}
      >
        {warning}
      </p>
    </div>
  );
}
