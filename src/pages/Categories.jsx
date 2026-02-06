import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      alert("Failed to load categories ❌");
    }
  };

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await API.post("/categories/", {
        name: categoryName,
        keywords: "" // handled internally by system
      });

      alert("Category created successfully ✅");
      setCategoryName("");
      setOpenModal(false);
      fetchCategories();
    } catch (err) {
      alert("Error creating category ❌");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">
            Organize your transactions using categories
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-medium"
        >
          + Create Category
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Category Name</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3 font-medium">{cat.name}</td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td className="p-5 text-center text-gray-400">
                  No categories added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE CATEGORY MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-6 space-y-5">

            <h2 className="text-xl font-semibold">Create Category</h2>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              Categories help you group your transactions (for example: Food,
              Travel, Education). You can select them while adding or editing
              transactions.
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Category Name
              </label>
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Medical, Entertainment"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
              >
                Save Category
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
