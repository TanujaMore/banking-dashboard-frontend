import { useEffect, useState } from "react"
import API from "../utils/api"; // your axios file

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    keywords: "",
  });

  // 🔹 LOAD CATEGORIES FROM BACKEND
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      alert("Backend not running or error fetching categories ❌");
    }
  };

  // 🔹 OPEN CREATE MODAL
  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", keywords: "" });
    setOpenModal(true);
  };

  // 🔹 OPEN EDIT MODAL
  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      keywords: cat.keywords || "",
    });
    setOpenModal(true);
  };

  // 🔹 SAVE CATEGORY (CREATE OR UPDATE)
  const handleSave = async () => {
    try {
      if (editingCategory) {
        // UPDATE
        await API.put(`/categories/${editingCategory.id}`, formData);
        alert("Category updated successfully ✅");
      } else {
        // CREATE
        await API.post("/categories/", formData);
        alert("Category created successfully ✅");
      }

      setOpenModal(false);
      fetchCategories();
    } catch (err) {
      alert("Error saving category ❌");
    }
  };

  // 🔹 DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`);
      alert("Category deleted ✅");
      fetchCategories();
    } catch (err) {
      alert("Error deleting category ❌");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">
            Manage categories and automatic categorization rules
          </p>
        </div>

        <button
          onClick={openCreate}
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
              <th className="p-3">Category</th>
              <th className="p-3">Keywords (Rules)</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-sm text-gray-600">
                  {cat.keywords || "-"}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="p-5 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <div>
              <label className="block mb-1 text-sm">Category Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. Food"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                Keywords (comma separated)
              </label>
              <input
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="zomato, swiggy, restaurant"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
