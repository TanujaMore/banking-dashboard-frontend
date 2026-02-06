import BillCard from "./BillCard";

export default function BillList({
  bills,
  onTogglePaid,
  onToggleAutoPay,
}) {
  /* SAFETY: ensure bills is always an array */
  const safeBills = Array.isArray(bills) ? bills : [];

  if (safeBills.length === 0) {
    return <p className="text-gray-500">No bills found</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {safeBills.map((bill) => (
        <BillCard
          key={bill?.id}
          bill={bill}
          onTogglePaid={onTogglePaid}
          onToggleAutoPay={onToggleAutoPay}
        />
      ))}
    </div>
  );
}
