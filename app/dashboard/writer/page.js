"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";

const SAMPLE_ACTIVITY = [
  "The Last Ember of Valtheria was purchased by a reader.",
  "Echoes of Midnight received a new bookmark.",
  "You published The Clockmaker's Promise.",
  "A reader left a review on The Silent Garden.",
];

export default function WriterDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ books: 0, sales: 0, bookmarks: 0, revenue: 0 });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "writer") { router.push("/"); return; }
    fetchStats();
  }, [user, loading]);

  const fetchStats = async () => {
    try {
      const [booksRes, salesRes] = await Promise.all([
        axios.get(`${API_URL}/api/ebooks/writer/${user._id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/transactions/my-sales`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const books = booksRes.data || [];
      const sales = salesRes.data || [];
      setStats({
        books: books.filter(b => b.status === "published").length,
        sales: sales.length,
        bookmarks: books.reduce((s, b) => s + (b.bookmarks || 0), 0),
        revenue: sales.reduce((s, t) => s + (t.amount || 0), 0),
      });
    } catch (e) {}
  };

  const statCards = [
    { label: "Published Stories", value: stats.books, icon: "📖" },
    { label: "Total Sales", value: stats.sales, icon: "💰" },
    { label: "Bookmarks", value: stats.bookmarks, icon: "⭐" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: "📈" },
  ];

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white">Welcome back, Writer 👍</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your stories, track your growth, and connect with your readers.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-0">
            {SAMPLE_ACTIVITY.map((a, i) => (
              <div key={i} className="py-3 border-b border-gold/5 last:border-0">
                <p className="text-gray-300 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Quick Actions</h2>
            <span className="text-gray-500 text-xs">This Month</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push("/dashboard/writer/add")}
              className="py-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-xl text-sm font-medium transition-all">
              + Add New Book
            </button>
            <button onClick={() => router.push("/dashboard/writer/sales")}
              className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm font-medium transition-all">
              View Sales
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
