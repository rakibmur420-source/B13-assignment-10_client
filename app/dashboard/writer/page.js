"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";

export default function WriterDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ books: 0, sales: 0, revenue: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "writer") { router.push("/"); return; }
    fetchStats();
  }, [user, loading]);

  const fetchStats = async () => {
    const userId = user.id || user._id;
    try {
      const [booksRes, salesRes] = await Promise.all([
        axios.get(`${API_URL}/api/ebooks/writer/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/transactions/my-sales`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const books = booksRes.data || [];
      const sales = salesRes.data || [];
      setStats({
        books: books.filter(b => b.status === "published").length,
        sales: sales.length,
        revenue: sales.reduce((s, t) => s + (t.amount || 0), 0),
      });
      setRecentSales(sales.slice(0, 5));
    } catch (e) {}
  };

  const statCards = [
    { label: "Published Books", value: stats.books, icon: "📖" },
    { label: "Total Sales", value: stats.sales, icon: "💰" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: "📈" },
  ];

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-4 md:px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white">Welcome back, {user?.name?.split(" ")[0]} ✍️</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your stories, track your growth, and connect with your readers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Sales */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No sales yet. Keep publishing!</p>
          ) : (
            <div className="space-y-0">
              {recentSales.map((sale) => (
                <div key={sale._id} className="py-3 border-b border-gold/5 last:border-0 flex justify-between items-center">
                  <p className="text-gray-300 text-sm">{sale.ebookTitle}</p>
                  <span className="text-green-400 text-sm font-bold">${sale.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => router.push("/dashboard/writer/add")} className="py-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-xl text-sm font-medium transition-all">+ Add New Book</button>
            <button onClick={() => router.push("/dashboard/writer/sales")} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm font-medium transition-all">View Sales</button>
          </div>
        </div>
      </main>
    </div>
  );
}
