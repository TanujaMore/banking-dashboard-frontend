import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">Digital Banking Platform</h1>
      <p className="mb-6 text-lg">
        Manage accounts, transactions & insights in one place
      </p>

      <div className="space-x-4">
        <Link to="/login" className="bg-white text-blue-700 px-6 py-2 rounded">
          Login
        </Link>
        <Link to="/register" className="border px-6 py-2 rounded">
          Get Started
        </Link>
      </div>
    </div>
  );
}
