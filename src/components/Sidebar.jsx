import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  List,
  Tags,
  PieChart,
  Settings,
  HelpCircle,
  Receipt,   
  Gift 
} from "lucide-react";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100";

  const activeClass =
    "bg-blue-100 text-blue-700 font-semibold";

  return (
    <div className="w-64 h-screen bg-white border-r p-4 flex flex-col gap-2 overflow-y-auto">
  

      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Digital Bank
      </h2>

      {/* MENU LINKS */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>

      <NavLink
        to="/accounts"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <CreditCard size={20} />
        Accounts
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <List size={20} />
        Transactions
      </NavLink>

      {/* 🔥 NEW ITEMS FOR MILESTONE 2 */}
      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <Tags size={20} />
        Categories
      </NavLink>

      <NavLink
        to="/budgets"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <PieChart size={20} />
        Budgets
      </NavLink>
      
      <NavLink 
        to="/bills"
        className={({ isActive }) =>
         `${linkClass} ${isActive ? activeClass : ""}`
         }
      >
        <Receipt size={20} />
        Bills
      </NavLink>

      
    <NavLink
      to="/rewards"
      className={({ isActive }) =>
        `${linkClass} ${isActive ? activeClass : ""}`
        }
    >
      <Gift size={20} />
      Rewards
    </NavLink>


      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >


        <Settings size={20} />
        Settings
      </NavLink>

      <NavLink
        to="/help"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeClass : ""}`
        }
      >
        <HelpCircle size={20} />
        Help
      </NavLink>
    </div>
  );
}
