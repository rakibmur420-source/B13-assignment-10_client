"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import ReaderSidebar from "@/components/ReaderSidebar";
import axios from "axios";
import toast from "react-hot-toast";

const recentActivity = [
  { icon: "🟢", text: 'Purchased "The Silent Echo"', tag: "Purchase", color: "text-green-400 bg-green-500/20" },
  { icon: "❤️", text: 'Bookmarked "Whispers in the Dark"', tag: "Bookmark", color: "text-red-400 bg-red-500/20" },
  { icon: "📘", text: 'Started reading "The Last Chapter"', tag: "Read", color: "text-blue-400 bg-blue-500/20" },
  { icon: "👤", text: 'Reviewed "Midnight Tales"', tag: "Review", color: "text-gray-400 bg-gray-500/20" },
];

export default function ProfilePage({ isWriter = false }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ booksRead: 24, purchased: 18, bookmarks: 7 });
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    setName(user.name || "");
  }, [user, loading]);

  const handleSave = async () => {
    try {
      await axios.patch(`${API_URL}/api/users/${user._id}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (e) { toast.error("Failed to update"); }
  };

  const Sidebar = user?.role === "writer" ? WriterSidebar : ReaderSidebar;

  if (loading) return (
    <div className="flex">
      <div className="w-56 min-h-screen bg-navy-light" />
      <main className="flex-1 flex items-center justify-center min-h-screen bg-navy">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </main>
    </div>
  );

  return (
    <div className="flex bg-navy min-h-screen">
      <Sidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        {/* Header */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <span className="text-gold text-3xl font-bold">{user?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-navy-light flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div>
                {editMode ? (
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="bg-navy border border-gold/30 text-white text-xl font-bold rounded-lg px-3 py-1 focus:outline-none" />
                ) : (
                  <h2 className="text-white text-2xl font-bold">{user?.name}</h2>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold capitalize">
                    👤 {user?.role === "user" ? "Reader" : user?.role}
                  </span>
                  <span className="text-gray-400 text-sm">✉ {user?.email}</span>
                  <span className="text-gray-400 text-sm">📅 Member since January 2024</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push("/ebooks")}
                className="flex items-center gap-1 px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">
                📖 My Ebooks
              </button>
              <button onClick={() => router.push(user?.role === "writer" ? "/dashboard/writer/bookmarks" : "/dashboard/reader/bookmarks")}
                className="flex items-center gap-1 px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">
                ❤️ Bookmarks
              </button>
              {editMode ? (
                <button onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-2 bg-gold text-navy rounded-xl text-xs font-bold transition-all">
                  ✓ Save
                </button>
              ) : (
                <button onClick={() => setEditMode(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Activity Stats */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Activity Stats</h3>
            <div className="space-y-3">
              {[
                { icon: "📘", label: "Books Read", value: stats.booksRead, bg: "bg-blue-500/10" },
                { icon: "🟢", label: "Purchased", value: stats.purchased, bg: "bg-green-500/10" },
                { icon: "❤️", label: "Bookmarks", value: stats.bookmarks, bg: "bg-red-500/10" },
                { icon: "🕒", label: "Last Active", value: "2 hours ago", bg: "bg-purple-500/10" },
              ].map(s => (
                <div key={s.label} className={`flex items-center justify-between px-4 py-3 rounded-xl ${s.bg}`}>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <span>{s.icon}</span><span>{s.label}</span>
                  </div>
                  <span className="text-white font-bold text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5">{a.icon}</span>
                    <div>
                      <p className="text-gray-300 text-sm">{a.text}</p>
                      <p className="text-gray-500 text-xs">{i + 2} days ago</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.color}`}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: "User ID", value: user?._id?.slice(0, 12) + "..." },
                { label: "Email Verified", value: "Pending", badge: "bg-yellow-500/20 text-yellow-400" },
                { label: "Account Status", value: "Active", badge: "bg-green-500/20 text-green-400" },
                { label: "Account Type", value: user?.role === "user" ? "Reader" : user?.role, capitalize: true },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                  <span className="text-gray-400 text-sm">{d.label}</span>
                  {d.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.badge}`}>{d.value}</span>
                  ) : (
                    <span className={`text-gray-300 text-sm ${d.capitalize ? "capitalize" : ""}`}>{d.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="bg-navy-light border border-gold/10 rounded-2xl p-5 cursor-pointer hover:border-gold/30 transition-all"
              onClick={() => router.push(user?.role === "writer" ? "/dashboard/writer/books" : "/dashboard/reader/purchased")}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">My Library</h3>
                  <p className="text-gray-400 text-xs mt-1">View all your purchased ebooks</p>
                </div>
                <span className="text-2xl">📚</span>
              </div>
              <button className="mt-3 text-xs text-gold hover:underline">Go to Library →</button>
            </div>
            <div className="bg-purple-600 rounded-2xl p-5 cursor-pointer hover:bg-purple-700 transition-all"
              onClick={() => router.push(user?.role === "writer" ? "/dashboard/writer/bookmarks" : "/dashboard/reader/bookmarks")}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Saved Books</h3>
                  <p className="text-purple-200 text-xs mt-1">Manage your bookmarks</p>
                </div>
                <span className="text-2xl">❤️</span>
              </div>
              <button className="mt-3 text-xs text-purple-200 hover:underline">View Bookmarks →</button>
            </div>
            {user?.role === "writer" && (
              <div className="bg-green-600 rounded-2xl p-5 cursor-pointer hover:bg-green-700 transition-all"
                onClick={() => router.push("/dashboard/writer")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Writer Dashboard</h3>
                    <p className="text-green-100 text-xs mt-1">Manage your ebooks and sales</p>
                  </div>
                  <span className="text-2xl">✍️</span>
                </div>
                <button className="mt-3 text-xs text-green-100 hover:underline">Go to Writer Dashboard →</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
