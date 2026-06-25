"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiBook } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const redirectByRole = (role) => {
    if (role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/reader");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success("Account created! Welcome to Fable 🎉");
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin(formData.role);
      toast.success("Welcome to Fable! 🎉");
      redirectByRole(user.role);
    } catch { toast.error("Google sign-up failed"); }
    finally { setGoogleLoading(false); }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <FiBook className="text-gold text-3xl" />
            <span className="text-gold font-serif text-3xl font-bold">Fable</span>
          </Link>
          <h2 className="text-white text-2xl font-serif font-bold mt-4">Create Account</h2>
          <p className="text-gray-400 mt-2">Join thousands of readers and writers</p>
        </div>
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-8">
          {/* Role */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block font-medium">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "user", label: "Reader", emoji: "📖", desc: "Browse & buy ebooks" },
                { value: "writer", label: "Writer", emoji: "✍️", desc: "Publish your ebooks" },
              ].map(role => (
                <button key={role.value} type="button" onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`py-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    formData.role === role.value ? "bg-gold border-gold text-navy font-bold" : "border-gold/20 text-gray-400 hover:border-gold/40"
                  }`}>
                  <span className="text-2xl">{role.emoji}</span>
                  <span>{role.label}</span>
                  <span className={`text-xs font-normal ${formData.role === role.value ? "text-navy/70" : "text-gray-600"}`}>{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gold/20 hover:border-gold/40 rounded-xl text-gray-300 hover:text-white transition-all mb-6 disabled:opacity-50">
            <FcGoogle size={22} />
            {googleLoading ? "Signing up..." : `Continue with Google as ${formData.role === "user" ? "Reader" : "Writer"}`}
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gold/20" /><span className="text-gray-500 text-sm">or</span><div className="flex-1 h-px bg-gold/20" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "Your full name", icon: <FiUser /> },
              { name: "email", label: "Email", type: "email", placeholder: "your@email.com", icon: <FiMail /> },
              { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: <FiLock />, minLength: 6 },
              { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••", icon: <FiLock /> },
            ].map(f => (
              <div key={f.name}>
                <label className="text-gray-400 text-sm mb-2 block">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{f.icon}</span>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange} required
                    placeholder={f.placeholder} minLength={f.minLength}
                    className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none" />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 mt-2">
              {loading ? "Creating account..." : `Create ${formData.role === "writer" ? "Writer" : "Reader"} Account`}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
