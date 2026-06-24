"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiBook } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/user");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      toast.success("Account created successfully! Welcome to Fable 🎉");
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin(formData.role);
      toast.success("Welcome to Fable! 🎉");
      redirectByRole(user.role);
    } catch (err) {
      toast.error("Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20 pb-10">
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
          <h2 className="text-white text-2xl font-serif font-bold mt-4">Create Account</h2>
          <p className="text-gray-400 mt-2">Join thousands of readers and writers</p>
        </div>

        {/* Card */}
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-8">

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block font-medium">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`py-4 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                  formData.role === "user"
                    ? "bg-gold border-gold text-navy font-bold"
                    : "border-gold/20 text-gray-400 hover:border-gold/40 hover:text-gray-300"
                }`}
              >
                <span className="text-2xl">📖</span>
                <span>Reader</span>
                <span className={`text-xs font-normal ${formData.role === "user" ? "text-navy/70" : "text-gray-600"}`}>
                  Browse &amp; buy ebooks
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "writer" })}
                className={`py-4 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                  formData.role === "writer"
                    ? "bg-gold border-gold text-navy font-bold"
                    : "border-gold/20 text-gray-400 hover:border-gold/40 hover:text-gray-300"
                }`}
              >
                <span className="text-2xl">✍️</span>
                <span>Writer</span>
                <span className={`text-xs font-normal ${formData.role === "writer" ? "text-navy/70" : "text-gray-600"}`}>
                  Publish your ebooks
                </span>
              </button>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gold/20 hover:border-gold/40 rounded-xl text-gray-300 hover:text-white transition-all duration-200 mb-6 disabled:opacity-50"
          >
            <FcGoogle size={22} />
            {googleLoading
              ? "Signing up..."
              : `Continue with Google as ${formData.role === "user" ? "Reader" : "Writer"}`}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gold/20" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 mt-2"
            >
              {loading
                ? "Creating account..."
                : `Create ${formData.role === "writer" ? "Writer" : "Reader"} Account`}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
