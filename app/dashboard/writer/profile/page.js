"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";
import toast from "react-hot-toast";

const RECENT_ACTIVITY = [
  { icon: "🟢", text: 'Purchased "The Silent Echo"', tag: "Purchase", tagColor: "bg-green-500/20 text-green-400", ago: "2 days ago" },
  { icon: "❤️", text: 'Bookmarked "Whispers in the Dark"', tag: "Bookmark", tagColor: "bg-red-500/20 text-red-400", ago: "3 days ago" },
  { icon: "📘", text: 'Started reading "The Last Chapter"', tag: "Read", tagColor: "bg-blue-500/20 text-blue-400", ago: "5 days ago" },
  { icon: "👤", text: 'Reviewed "Midnight Tales"', tag: "Review", tagColor: "bg-gray-500/20 text-gray-400", ago: "1 week ago" },
];

export default function WriterProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [stats, setStats] = useState({ publishedBooks: 0, totalSales: 0, bookmarks: 0, lastActive: "2 hours ago" });
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "writer") { router.push("/"); return; }
    setName(user.name || "");
    fetchRealStats();
  }, [user, loading]);

  const fetchRealStats = async () => {
    const userId = user.id || user._id;
    try {
      const [booksRes, salesRes, bookmarksRes] = await Promise.all([
        axios.get(`${API_URL}/api/ebooks/writer/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/transactions/my-sales`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/users/${userId}/bookmarks`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats({
        publishedBooks: (booksRes.data || []).filter(b => b.status === "published").length,
        totalSales: (salesRes.data || []).length,
        bookmarks: (bookmarksRes.data || []).length,
        lastActive: "2 hours ago",
      });
    } catch (e) {}
    finally { setFetching(false); }
  };

  const handleSave = async () => {
    const userId = user.id || user._id;
    try {
      await axios.patch(`${API_URL}/api/users/${userId}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Profile updated!"); setEditMode(false);
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center"><div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "January 2024";
  const userId = user?.id || user?._id || "";

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        {/* Profile Header */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden border-2 border-gold/20">
                  {user?.photoURL
                    ? <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                    : <span className="text-gold text-3xl font-bold">{user?.name?.charAt(0)}</span>}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-navy-light flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div>
                {editMode ? (
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="bg-navy border border-gold/30 text-white text-xl font-bold rounded-lg px-3 py-1 focus:outline-none mb-1" />
                ) : (
                  <h2 className="text-white text-2xl font-bold mb-1">{user?.name}</h2>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold font-medium">👤 Writer</span>
                  <span className="text-gray-400 text-sm">✉ {user?.email}</span>
                  <span className="text-gray-400 text-sm">📅 Member since {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => router.push("/dashboard/writer/books")} className="px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">📖 My Ebooks</button>
              <button onClick={() => router.push("/dashboard/writer/bookmarks")} className="px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">❤️ Bookmarks</button>
              {editMode
                ? <button onClick={handleSave} className="px-4 py-2 bg-gold text-navy rounded-xl text-xs font-bold">✓ Save Changes</button>
                : <button onClick={() => setEditMode(true)} className="px-3 py-2 bg-navy border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl text-xs font-medium transition-all">✏️ Edit Profile</button>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Activity Stats — REAL DATA */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Activity Stats</h3>
            {fetching ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-navy rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: "📖", label: "Published Books", value: stats.publishedBooks, bg: "bg-blue-500/10", color: "text-blue-400" },
                  { icon: "💰", label: "Total Sales", value: stats.totalSales, bg: "bg-green-500/10", color: "text-green-400" },
                  { icon: "❤️", label: "Bookmarks", value: stats.bookmarks, bg: "bg-red-500/10", color: "text-red-400" },
                  { icon: "🕒", label: "Last Active", value: stats.lastActive, bg: "bg-purple-500/10", color: "text-purple-400" },
                ].map(s => (
                  <div key={s.label} className={`flex items-center justify-between px-4 py-3 rounded-xl ${s.bg}`}>
                    <div className="flex items-center gap-2 text-gray-300 text-sm"><span>{s.icon}</span><span>{s.label}</span></div>
                    <span className={`font-bold text-sm ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-base mt-0.5 flex-shrink-0">{a.icon}</span>
                    <div>
                      <p className="text-gray-300 text-sm leading-snug">{a.text}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{a.ago}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${a.tagColor}`}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Account Details</h3>
            <div className="space-y-0">
              {[
                { label: "User ID", value: userId.slice(0, 14) + "..." },
                { label: "Email Verified", value: "Pending", badge: "bg-yellow-500/20 text-yellow-400" },
                { label: "Account Status", value: "Active", badge: "bg-green-500/20 text-green-400" },
                { label: "Account Type", value: "Writer" },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between py-3 border-b border-gold/5 last:border-0">
                  <span className="text-gray-400 text-sm">{d.label}</span>
                  {d.badge
                    ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${d.badge}`}>{d.value}</span>
                    : <span className="text-gray-300 text-sm">{d.value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div onClick={() => router.push("/dashboard/writer/books")} className="bg-navy-light border border-gold/10 hover:border-gold/30 rounded-2xl p-5 cursor-pointer transition-all">
              <div className="flex items-center justify-between">
                <div><h3 className="text-white font-semibold">My Library</h3><p className="text-gray-400 text-xs mt-1">View all your published ebooks</p></div>
                <span className="text-3xl">📚</span>
              </div>
              <span className="text-xs text-gold mt-3 inline-block">Go to Library →</span>
            </div>
            <div onClick={() => router.push("/dashboard/writer/bookmarks")} className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-5 cursor-pointer transition-all">
              <div className="flex items-center justify-between">
                <div><h3 className="text-white font-semibold">Saved Books</h3><p className="text-purple-200 text-xs mt-1">Manage your bookmarks</p></div>
                <span className="text-3xl">❤️</span>
              </div>
              <span className="text-xs text-purple-200 mt-3 inline-block">View Bookmarks →</span>
            </div>
            <div onClick={() => router.push("/dashboard/writer")} className="bg-green-600 hover:bg-green-700 rounded-2xl p-5 cursor-pointer transition-all">
              <div className="flex items-center justify-between">
                <div><h3 className="text-white font-semibold">Writer Dashboard</h3><p className="text-green-100 text-xs mt-1">Manage your ebooks and sales</p></div>
                <span className="text-3xl">✍️</span>
              </div>
              <span className="text-xs text-green-100 mt-3 inline-block">Go to Writer Dashboard →</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
