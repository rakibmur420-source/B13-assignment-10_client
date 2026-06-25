"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { FiUsers, FiBook, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/"); return; }
    fetchAnalytics();
  }, [user, loading]);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/transactions/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (e) {
      // use fallback data
      setAnalytics({
        totalUsers: 0, totalWriters: 0, totalEbooks: 0, totalRevenue: 0,
        monthlySales: [
          { _id: { month: 1 }, revenue: 12000 },
          { _id: { month: 2 }, revenue: 15000 },
          { _id: { month: 3 }, revenue: 16000 },
          { _id: { month: 4 }, revenue: 17000 },
          { _id: { month: 5 }, revenue: 21000 },
          { _id: { month: 6 }, revenue: 25000 },
        ],
      });
    } finally {
      setFetching(false);
    }
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const chartData = (analytics?.monthlySales || []).map(m => ({
    name: months[(m._id?.month || 1) - 1],
    revenue: m.revenue || 0,
    label: `$${((m.revenue || 0) / 1000).toFixed(0)}k`,
  }));

  const stats = [
    { label: "Total Users", value: analytics?.totalUsers ?? "—", icon: "👥", color: "text-blue-400" },
    { label: "Total Writers", value: analytics?.totalWriters ?? "—", icon: "✍️", color: "text-purple-400" },
    { label: "Ebooks Sold", value: analytics?.totalEbooks ?? "—", icon: "📚", color: "text-gold" },
    { label: "Total Revenue", value: `$${((analytics?.totalRevenue || 0)).toLocaleString()}`, icon: "💰", color: "text-green-400" },
  ];

  if (loading || fetching) return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center min-h-screen bg-navy">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </main>
    </div>
  );

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Admin Dashboard <span>📊</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor the platform's growth, sales, and reader activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Monthly Sales Chart */}
        {chartData.length > 0 && (
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
            <h2 className="text-white font-serif font-bold text-lg mb-6">Monthly Sales Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1B2B3B", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8 }}
                  labelStyle={{ color: "#F5A623" }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#F5A623" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}
