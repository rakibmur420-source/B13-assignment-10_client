"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { FiSun, FiMoon, FiMenu, FiX, FiBook } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "writer") return "/dashboard/writer";
    return "/dashboard/reader";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 dark:bg-navy/95 backdrop-blur-sm border-b border-gold/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FiBook className="text-gold text-2xl" />
            <span className="text-gold font-serif text-2xl font-bold tracking-wide">Fable</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-gold transition-colors duration-200 font-medium">Home</Link>
            <Link href="/ebooks" className="text-gray-300 hover:text-gold transition-colors duration-200 font-medium">Browse Books</Link>
            {user && (
              <Link href={getDashboardLink()} className="text-gray-300 hover:text-gold transition-colors duration-200 font-medium">Dashboard</Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-navy-light hover:bg-gold/20 text-gold transition-colors duration-200"
                title="Toggle theme"
              >
                {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-gold text-sm font-bold">{user.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">Hi, {user.name?.split(" ")[0]}!</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gold/30 hover:border-gold text-gold rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-lg text-sm transition-colors duration-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full text-gold">
                {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gold p-2">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gold/20 space-y-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-3 text-gray-300 hover:text-gold transition-colors duration-200">Home</Link>
            <Link href="/ebooks" onClick={() => setMenuOpen(false)} className="block py-3 text-gray-300 hover:text-gold transition-colors duration-200">Browse Books</Link>
            {user && (
              <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block py-3 text-gray-300 hover:text-gold transition-colors duration-200">Dashboard</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="mt-2 w-full px-4 py-2 border border-gold/30 text-gold rounded-lg text-sm font-medium">
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 text-center text-gray-300 hover:text-gold">Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="py-2 text-center bg-gold text-navy font-semibold rounded-lg">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
