import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import API from "../utils/api";
import BudgetCard from "../components/BudgetCard.jsx";
import AddBudgetModal from "../components/AddBudgetModal.jsx";
import { formatINR } from "../utils/format"; // ✅ ADDED

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const Budgets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [editBudget, setEditBudget] = useState(null);

  /* 🔹 LOAD REAL BUDGET PROGRESS FROM BACKEND */
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const res = await API.get("/budgets/progress");
      setBudgets(res.data);
    } catch (error) {
      console.log("Error loading budgets", error);
    }
  };

  /* 🔹 ADD NEW BUDGET */
  const handleAddBudget = async (newBudget) => {
    try {
      await API.post("/budgets", newBudget);
      loadBudgets();
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to add budget ❌");
      console.log(error);
    }
  };

  /* 🔹 UPDATE BUDGET */
  const handleUpdateBudget = async (id, updatedData) => {
    try {
      await API.put(`/budgets/${id}`, updatedData);
      loadBudgets();
      setEditBudget(null);
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to update budget ❌");
      console.log(error);
    }
  };

  /* 🔹 DELETE BUDGET */
  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await API.delete(`/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("Failed to delete budget ❌");
      console.log(error);
    }
  };

  /* 🔹 PIE DATA */
  const pieData = budgets.map((b) => ({
    name: b.category,
    value: b.spent_amount,
  }));

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Budgets</h1>
          <p className="text-slate-500">Visual overview of your spending</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-700"
        >
          + Add Budget
        </button>
      </div>

      {/* -------- CHARTS -------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 🔹 Spending Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow border h-80">
          <h3 className="text-lg font-bold mb-4">Spending Distribution</h3>

          {pieData.length === 0 ? (
            <p className="text-gray-400">No spending data available</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatINR(value)} // ✅ formatted tooltip
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 🔹 Budget vs Spent */}
        <div className="bg-white p-6 rounded-2xl shadow border h-80">
          <h3 className="text-lg font-bold mb-4">Budget vs Spent</h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgets}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatINR(value)} // ✅ formatted tooltip
              />
              <Legend />
              <Bar dataKey="limit_amount" fill="#e2e8f0" name="Limit" />
              <Bar dataKey="spent_amount" fill="#3b82f6" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* -------- BUDGET STATUS CARDS -------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            category={budget.category}
            spent_amount={formatINR(budget.spent_amount)} // ✅ formatted
            limit_amount={formatINR(budget.limit_amount)} // ✅ formatted
            warning={budget.warning}
            onDelete={handleDeleteBudget}
            onEdit={(b) => {
              setEditBudget(b);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* -------- ADD / EDIT MODAL -------- */}
      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditBudget(null);
        }}
        onAdd={handleAddBudget}
        onUpdate={handleUpdateBudget}
        initialData={editBudget}
      />
    </div>
  );
};

export default Budgets;
