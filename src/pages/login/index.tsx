import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { loginUser } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitLogin = async () => {
    setLoading(true);

    // Validasi Input
    if (!email && !password) {
      toast.error("Email dan password wajib diisi");
      setLoading(false);
      return;
    }

    if (!email) {
      toast.error("Email wajib diisi");
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error("Password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const { token, role } = await loginUser({ email, password });

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login berhasil");

      setTimeout(() => {
        router.push(role === "admin" ? "/admin" : "/user");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3E3F29] px-4">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        
        {/* Kiri */}
        <div
          className="hidden md:flex flex-col justify-center w-2/5 bg-cover bg-center text-white p-10 relative"
          style={{ backgroundImage: "url('/images/auth_pic.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10">
            <h1 className="text-4xl text-center font-bold mb-4">
              Taste the Best, Every Day
            </h1>
            <p className="text-sm text-center font-bold opacity-90">
              Log in to enjoy curated meals, top-rated restaurants, and
              exclusive culinary experiences near you.
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-3/5 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🫣" : "🤔"}
                </div>
              </div>
            </div>

            {/* Tombol */}
            <button
              onClick={submitLogin}
              disabled={loading}
              className="w-full bg-[#A89276] hover:bg-[#BCA88D] text-white py-3 rounded-md font-semibold transition disabled:opacity-60"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>

            {/* Register */}
            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#BCA88D] font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
