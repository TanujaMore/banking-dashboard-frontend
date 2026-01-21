import { getData, saveData } from "../utils/storage";

export default function CSVUpload({ onUpload }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split("\n").slice(1);
      const existing = getData("transactions");
      const parsed = [];

      rows.forEach(row => {
        if (!row.trim()) return;
        const [date, description, amount, type, merchant, category] = row.split(",");
        parsed.push({
          id: Date.now() + Math.random(),
          date,
          description,
          amount,
          type,
          merchant,
          category
        });
      });

      const updated = [...existing, ...parsed];
      saveData("transactions", updated);
      onUpload(updated);
    };
    reader.readAsText(file);
  };

  return <input type="file" accept=".csv" onChange={handleFile} />;
}
