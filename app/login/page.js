"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiBook } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success("Welcome back!");
      if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "writer") router.push("/dashboard/writer");
      else router.push("/dashboard/user");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin("user");
      toast.success("Welcome!");
      if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "writer") router.push("/dashboard/writer");
      else router.push("/dashboard/user");
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <FiBook className="text-gold text-3xl" />
            <span className="text-gold font-serif text-3xl font-bold">Fable</span>
          </Link>
          <h2 className="text-white text-2xl font-serif font-bold mt-4">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-8">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gold/20 hover:border-gold/40 rounded-xl text-gray-300 hover:text-white transition-all duration-200 mb-6 disabled:opacity-50"
          >
            <FcGoogle size={22} />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gold/20" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-gold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}