"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuperAdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Save token + role
    localStorage.setItem("superadmin_token", data.token);
    localStorage.setItem("role", data.role);

    // ✅ Redirect
    router.push("/dashboard");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF6EE] px-4">
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border"
        style={{
          borderColor: "#C8A951",
          boxShadow:
            "0 0 40px rgba(200,169,81,0.7), 0 0 20px rgba(155,43,43,0.4)",
        }}
      >
        {/* LEFT PANEL */}
        <div
          className="hidden md:flex flex-col justify-center px-14"
          style={{
            background: "linear-gradient(135deg, #7B1F1F, #3B0A0D)",
          }}
        >
          <h1
            className="text-4xl font-semibold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All-in-One Restaurant POS
          </h1>

          <div
            className="w-12 h-[2px] my-5 rounded"
            style={{ backgroundColor: "#C8A951" }}
          />

          <p className="text-sm leading-relaxed text-white/90 max-w-sm">
            Centralized control over billing, inventory, analytics, and
            multi-restaurant operations.
          </p>

          <p className="text-xs uppercase tracking-widest text-white/80 mt-8">
            Super Admin Access
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-8 py-12 bg-white">
          <div className="w-full max-w-md">
            <h2
              className="text-3xl font-semibold text-[#3B0A0D] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Super Admin Login
            </h2>

            <p className="text-sm text-[#7B1F1F] mb-8">
              Sign in to access the control dashboard
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#3B0A0D] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pos.com"
                className="w-full px-4 py-3 rounded-lg text-sm border outline-none bg-white
                           text-[#3B0A0D] placeholder:text-[#B89A8C]"
                style={{ borderColor: "#C8A951" }}
              />
            </div>

            {/* PASSWORD (PRO TOGGLE) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#3B0A0D] mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm border outline-none bg-white
                             text-[#3B0A0D] placeholder:text-[#B89A8C]"
                  style={{ borderColor: "#C8A951" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-[#7B1F1F] hover:text-[#9B2B2B] transition"
                >
                  {showPassword ? (
                    /* Eye Off */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 002.83 2.83" />
                      <path d="M16.24 16.24A9.77 9.77 0 0012 18c-5 0-9-6-9-6a18.4 18.4 0 014.25-4.75" />
                      <path d="M9.88 5.1A9.77 9.77 0 0112 6c5 0 9 6 9 6a18.4 18.4 0 01-3.14 4.06" />
                    </svg>
                  ) : (
                    /* Eye */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-6 11-6 11 6 11 6-4 6-11 6-11-6-11-6z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-sm font-medium text-white transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: "#7B1F1F",
                boxShadow: "0 0 18px rgba(176,48,48,0.9)",
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-xs text-center text-[#7B1F1F] mt-8">
              Authorized access only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
