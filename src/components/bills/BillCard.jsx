export default function BillCard({
  bill,
  onTogglePaid,
  onToggleAutoPay,
}) {
  /* SAFETY: fallback values */
  const safeBill = bill || {};
  const status = safeBill.status || "upcoming";

  const styles = {
    paid: "bg-green-50 border-green-500",
    overdue: "bg-red-50 border-red-500",
    upcoming: "bg-yellow-50 border-yellow-400",
  };

  return (
    <div
      className={`border-l-4 rounded-xl shadow p-5 space-y-4 ${
        styles[status] || styles.upcoming
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            {safeBill.biller_name || "Unnamed Bill"}
          </h3>
          <p className="text-sm text-gray-600">
            {safeBill.category || "General"}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-medium">
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Due: {safeBill.due_date || "--"}
        </p>
        <p className="text-xl font-bold">
          ₹{Number(safeBill.amount_due || 0)}
        </p>
      </div>

      <p className="text-sm text-green-700">
        🔔 Reminder set
      </p>

      <div className="border-t pt-3 space-y-2">
        <label className="flex justify-between items-center text-sm">
          Auto-pay
          <input
            type="checkbox"
            checked={!!safeBill.autoPay}
            onChange={() =>
              safeBill.id && onToggleAutoPay(safeBill.id)
            }
          />
        </label>

        <button
          onClick={() =>
            safeBill.id && onTogglePaid(safeBill.id)
          }
          className={`w-full py-2 rounded-lg ${
            safeBill.paid
              ? "bg-green-600 text-white"
              : "bg-slate-900 text-white"
          }`}
        >
          {safeBill.paid ? "Undo Payment" : "Mark as Paid"}
        </button>
      </div>
    </div>
  );
}
