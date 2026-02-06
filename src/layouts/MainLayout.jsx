import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

/*
  Layout with Sidebar + Topbar + Content
*/

export default function MainLayout({
  user,
  notifications = [],
  onLogout,
}) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const navigate = useNavigate();

  /* ✅ LOGOUT HANDLER */
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-xl animate-pulse">
            🏦
          </div>
          <h1 className="text-lg font-bold tracking-wide">
            Digital Bank
          </h1>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <MenuLink to="/dashboard" icon="📊" label="Dashboard" />
          <MenuLink to="/accounts" icon="💳" label="Accounts" />
          <MenuLink to="/transactions" icon="🔁" label="Transactions" />

          {/* 🔥 MILESTONE 2 LINKS */}
          <MenuLink to="/categories" icon="🏷️" label="Categories" />
          <MenuLink to="/budgets" icon="📈" label="Budgets" />


          <MenuLink to="/bills" icon="🧾" label="Bills" />
          <MenuLink to="/rewards" icon="🎁" label="Rewards" />

          <hr className="my-4 border-white/10" />


          <MenuLink to="/settings" icon="⚙️" label="Settings" />
          <MenuLink to="/help" icon="❓" label="Help Center" />
        </nav>

        {/* LOGOUT */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN AREA ---------------- */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">

          {/* SEARCH */}
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-[420px]">
            🔍
            <input
              type="text"
              placeholder="Search transactions, accounts..."
              className="bg-transparent ml-2 outline-none w-full"
            />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-6 relative">

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setOpenNotify(!openNotify)}
                className="relative text-xl"
              >
                🔔
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-cyan-500 rounded-full" />
                )}
              </button>

              {openNotify && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border z-50">
                  <div className="p-4 border-b font-semibold">
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-sm">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 text-sm border-b last:border-0 hover:bg-gray-50"
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative">
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="text-right">
                  <p className="font-medium">
                    {user?.name || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user ? "Premium Member" : ""}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center">
                  👤
                </div>
              </div>

              {openProfile && user && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border p-4 z-50">
                  <p className="font-semibold mb-2">Profile</p>

                  <ProfileRow label="Name" value={user.name} />
                  <ProfileRow label="Phone" value={user.phone} />
                  <ProfileRow label="Account" value={user.accountNo} />
                  <ProfileRow label="Card" value={user.cardNo} />

                  <hr className="my-3" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 🔥 HERE YOUR ROUTE PAGES WILL RENDER */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function MenuLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${
          isActive
            ? "bg-blue-600/20 text-cyan-400"
            : "hover:bg-white/10 text-gray-300"
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
