import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(true);
  const [step, setStep] = useState("login"); // login | otp

  const [username, setUsername] = useState("");   // email
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [remember, setRemember] = useState(false);

  /* CAPTCHA */
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* 🔐 CAPTCHA GENERATOR */
  const generateCaptcha = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnpqrstuvwxyz";
    const all = upper + lower;

    let result = "";
    result += upper.charAt(Math.floor(Math.random() * upper.length));
    result += lower.charAt(Math.floor(Math.random() * lower.length));

    for (let i = 0; i < 3; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }

    result = result
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setCaptchaText(result);
    setCaptchaInput("");
  };

  // 🔹 STEP 1: CHECK LOGIN + SEND OTP
  const sendOTP = async () => {
    if (!username || !password) {
      alert("Enter email and password");
      return;
    }

    if (captchaInput !== captchaText) {
      alert("Captcha does not match");
      generateCaptcha();
      return;
    }

    try {
      // FastAPI expects FORM DATA with username & password
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      await API.post("/users/login", formData);

      alert("OTP sent to registered mobile (Demo: 123456)");
      setStep("otp");

    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    }
  };

  // 🔹 STEP 2: VERIFY OTP + FINAL LOGIN
  const verifyOTP = async () => {
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await API.post("/users/login", formData);

      // Save JWT token
      localStorage.setItem("token", response.data.access_token);

      alert("Login successful 🎉");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-900">

        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-xl w-full max-w-md">

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            className="absolute top-4 right-4 text-sm px-3 py-1 rounded bg-gray-300 dark:bg-gray-700"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">
            Secure Bank Login
          </h2>

          {/* 🔐 LOGIN FORM */}
          {step === "login" && (
            <div className="space-y-4">
              <Input label="Email" value={username} onChange={setUsername} />
              <Input label="Password" type="password" value={password} onChange={setPassword} />

              {/* CAPTCHA */}
              <div>
                <label className="block text-sm mb-1">Captcha</label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-gray-700 text-white font-bold rounded">
                    {captchaText}
                  </div>
                  <button onClick={generateCaptcha} className="text-xl">🔄</button>
                </div>
                <input
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded text-black"
                  placeholder="Enter captcha"
                />
              </div>

              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember Me
              </label>

              <button
                onClick={sendOTP}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Login with OTP
              </button>
            </div>
          )}

          {/* 🔢 OTP SCREEN */}
          {step === "otp" && (
            <div className="space-y-4 text-center">
              <p className="text-sm">Enter OTP sent to mobile</p>

              <input
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-widest text-xl px-4 py-2 border rounded text-black"
              />

              <button
                onClick={verifyOTP}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Verify OTP
              </button>

              <button
                onClick={() => setStep("login")}
                className="text-sm text-blue-500 hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}

          <p className="text-center text-xs mt-6 opacity-70">
            Secure Digital Banking Portal
          </p>
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded text-black"
      />
    </div>
  );
}
