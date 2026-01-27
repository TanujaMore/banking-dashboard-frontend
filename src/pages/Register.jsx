import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  // FORM STATES
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔥 REAL REGISTER FUNCTION (NOW PERFECT)
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please agree to the Terms and Privacy Policy");
      return;
    }

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Name, Email and Password are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 🔴 SEND EXACT FIELDS BACKEND EXPECTS
      const response = await API.post(
        "/users/register",
        {
          name: fullName,        // 🔥 VERY IMPORTANT (THIS FIXES THE BUG)
          email: email,
          phone: phone,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Account created successfully 🎉 Please login now");
      navigate("/login");

    } catch (error) {
      console.error("REGISTER ERROR FULL:", error);

      if (error.response && error.response.data) {
        alert(JSON.stringify(error.response.data, null, 2));
      } else {
        alert("Backend server not running");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black animate-gradient" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

          {/* BANK LOGO */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-900 text-white flex items-center justify-center text-3xl font-bold animate-pulse">
              🏦
            </div>
            <h2 className="mt-3 text-2xl font-bold">Create Account</h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-4">

            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={setFullName}
            />

            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />

            <Input
              label="Phone Number"
              placeholder="+91 9876543210"
              value={phone}
              onChange={setPhone}
            />

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer"
                >
                  👁️
                </span>
              </div>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {/* TERMS */}
            <label className="flex gap-2 text-sm mt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              I agree to the Terms of Service and Privacy Policy
            </label>

            {/* CREATE ACCOUNT BUTTON */}
            <button className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded">
              Create Account
            </button>

            {/* FOOTER */}
            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, placeholder = "", type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />
    </div>
  );
}
