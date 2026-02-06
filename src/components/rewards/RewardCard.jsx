export default function RewardCard({ reward }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">{reward.program_name}</h3>
      <p className="text-xl">{reward.points_balance} points</p>
      <p className="text-sm text-gray-500">
        Last updated: {new Date(reward.last_updated).toLocaleDateString()}
      </p>
    </div>
  );
}
