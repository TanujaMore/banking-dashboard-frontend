import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences and security
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT MENU */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <Tab label="Profile" active={activeTab==="profile"} onClick={()=>setActiveTab("profile")} />
            <Tab label="Notifications" active={activeTab==="notifications"} onClick={()=>setActiveTab("notifications")} />
            <Tab label="Security" active={activeTab==="security"} onClick={()=>setActiveTab("security")} />
            <Tab label="Billing" active={activeTab==="billing"} onClick={()=>setActiveTab("billing")} />
            <Tab label="Preferences" active={activeTab==="preferences"} onClick={()=>setActiveTab("preferences")} />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {activeTab === "profile" && <Profile />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "security" && <Security />}
          {activeTab === "billing" && <Billing />}
          {activeTab === "preferences" && <Preferences />}
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMMON ---------------- */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg font-medium
        ${active ? "bg-blue-900 text-white" : "hover:bg-gray-100"}`}
    >
      {label}
    </button>
  );
}

function Card({ children }) {
  return <div className="bg-white rounded-xl shadow p-6">{children}</div>;
}

function Toggle({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 rounded-full flex items-center px-1
        ${enabled ? "bg-blue-900" : "bg-gray-300"}`}
    >
      <div className={`h-4 w-4 bg-white rounded-full ${enabled ? "translate-x-6" : ""}`} />
    </button>
  );
}

/* ---------------- PROFILE ---------------- */

function Profile() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Full Name" value="John Doe" />
        <Input label="Email" value="john.doe@example.com" />
        <Input label="Phone" value="+1 555 123 4567" />
      </div>

      <button
        onClick={() => alert("Profile updated successfully")}
        className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg"
      >
        Save Changes
      </button>
    </Card>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */

function Notifications() {
  const [email, setEmail] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [push, setPush] = useState(false);

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      <Row label="Transaction alerts">
        <Toggle enabled={email} setEnabled={setEmail} />
      </Row>

      <Row label="Weekly spending report">
        <Toggle enabled={weekly} setEnabled={setWeekly} />
      </Row>

      <Row label="Push notifications">
        <Toggle enabled={push} setEnabled={setPush} />
      </Row>

      <button
        onClick={() => alert("Notification settings saved")}
        className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg"
      >
        Save Changes
      </button>
    </Card>
  );
}

/* ---------------- SECURITY ---------------- */

function Security() {
  const [twoFA, setTwoFA] = useState(false);

  return (
    <>
      <Card>
        <h2 className="text-xl font-bold mb-4">Security</h2>

        <Row label="Two-Factor Authentication">
          <button
            onClick={() => {
              setTwoFA(!twoFA);
              alert(twoFA ? "2FA Disabled" : "2FA Enabled");
            }}
            className={`px-4 py-2 rounded-lg text-white ${
              twoFA ? "bg-green-600" : "bg-blue-900"
            }`}
          >
            {twoFA ? "Enabled" : "Enable"}
          </button>
        </Row>
      </Card>

      <Card>
        <h3 className="font-semibold mb-4">Change Password</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm Password" type="password" />
        </div>

        <button
          onClick={() => alert("Password updated successfully")}
          className="mt-4 bg-gray-100 px-4 py-2 rounded-lg"
        >
          Update Password
        </button>
      </Card>
    </>
  );
}

/* ---------------- BILLING ---------------- */

function Billing() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Billing</h2>

      <p><b>Plan:</b> Premium</p>
      <p className="text-gray-500">$9.99 / month</p>

      <button
        onClick={() => alert("Redirecting to billing page")}
        className="mt-4 text-blue-900 font-medium"
      >
        Change Plan
      </button>
    </Card>
  );
}

/* ---------------- PREFERENCES ---------------- */

function Preferences() {
  return (
    <>
      <Card>
        <h2 className="text-xl font-bold mb-4">Preferences</h2>

        <Row label="Language">
          <select className="border rounded-lg px-3 py-2">
            <option>English</option>
          </select>
        </Row>
      </Card>

      <Card>
        <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your account?")) {
              alert("Account deleted");
              window.location.href = "/login";
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete Account
        </button>
      </Card>
    </>
  );
}

/* ---------------- HELPERS ---------------- */

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4 mb-4">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Input({ label, value="", type="text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
