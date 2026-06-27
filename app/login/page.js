"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiBook, FiShield } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const roles = [
    { value: "user", label: "Reader", emoji: "📖", desc: "Browse & buy ebooks" },
    { value: "writer", label: "Writer", emoji: "✍️", desc: "Manage your ebooks" },
    { value: "admin", label: "Admin", emoji: "🛡️", desc: "Platform control" },
  ];

  const redirectByRole = (role) => {
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/reader");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      redirectByRole(user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const user = await googleLogin(selectedRole);
      toast.success(`Welcome, ${user.name}!`);
      redirectByRole(user.role);
    } catch (err) {
      console.error("Google login error:", err?.code, err?.message, err);
      const msg = err?.code === "auth/popup-blocked"
        ? "Popup blocked! Please allow popups for this site."
        : err?.code === "auth/unauthorized-domain"
        ? "Domain not authorized. Check Firebase settings."
        : err?.code === "auth/popup-closed-by-user"
        ? "Popup closed. Please try again."
        : err?.response?.data?.message || "Google login failed. Please try again.";
      toast.error(msg);
    } finally { setGoogleLoading(false); }
  };

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <FiBook className="text-gold text-3xl" />
            <span className="text-gold font-serif text-3xl font-bold">Fable</span>
          </Link>
          <h2 className="text-white text-2xl font-serif font-bold mt-4">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block font-medium">I am signing in as</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button key={role.value} type="button" onClick={() => setSelectedRole(role.value)}
                  className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                    selectedRole === role.value ? "bg-gold border-gold text-navy font-bold" : "border-gold/20 text-gray-400 hover:border-gold/40 hover:text-gray-300"
                  }`}>
                  <span className="text-lg">{role.emoji}</span>
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2 text-center">{roles.find(r => r.value === selectedRole)?.desc}</p>
          </div>

          {selectedRole === "admin" ? (
            <div className="flex items-start gap-2 mb-6 p-3 bg-gold/10 border border-gold/20 rounded-xl">
              <FiShield className="text-gold text-base mt-0.5 flex-shrink-0" />
              <p className="text-gold text-xs leading-relaxed">Admin login uses email &amp; password only. Default: <strong>admin@fable.com</strong> / <strong>Admin@123</strong></p>
            </div>
          ) : (
            <>
              <button onClick={handleGoogleLogin} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gold/20 hover:border-gold/40 rounded-xl text-gray-300 hover:text-white transition-all mb-6 disabled:opacity-50">
                <FcGoogle size={22} />
                {googleLoading ? "Signing in..." : `Continue with Google as ${selectedRole === "writer" ? "Writer" : "Reader"}`}
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gold/20" /><span className="text-gray-500 text-sm">or</span><div className="flex-1 h-px bg-gold/20" />
              </div>
            </>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50">
              {loading ? "Signing in..." : `Sign In as ${roles.find(r => r.value === selectedRole)?.label}`}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold hover:underline font-medium">Register here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
