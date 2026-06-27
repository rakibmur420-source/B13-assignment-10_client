"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
      if (res.data) setAnalytics(res.data);
    } catch (e) {
      setAnalytics(null);
    } finally {
      setFetching(false);
    }
  };

  const chartData = (analytics?.monthlySales || []).map(m => ({
    name: MONTHS[(m._id?.month || 1) - 1],
    revenue: m.revenue || 0,
    sales: m.sales || 0,
  }));

  const stats = analytics ? [
    { label: "Total Users", value: analytics.totalUsers?.toLocaleString() || "0", icon: "👥", color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Writers", value: analytics.totalWriters?.toLocaleString() || "0", icon: "✍️", color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Ebooks Published", value: analytics.totalEbooks?.toLocaleString() || "0", icon: "📚", color: "text-gold", bg: "bg-gold/10" },
    { label: "Total Revenue", value: `$${(analytics.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "text-green-400", bg: "bg-green-500/10" },
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-light border border-gold/20 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-gold font-semibold mb-1">{label}</p>
          <p className="text-white text-sm">Revenue: <span className="text-green-400 font-bold">${payload[0]?.value?.toLocaleString()}</span></p>
          {payload[1] && <p className="text-white text-sm">Sales: <span className="text-gold font-bold">{payload[1]?.value}</span></p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-4 md:px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Admin Dashboard <span>📊</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor the platform's growth, sales, and reader activity.</p>
        </div>

        {fetching ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-navy-light border border-gold/10 rounded-2xl p-5 animate-pulse">
                <div className="text-2xl mb-3">⬜</div>
                <div className="h-6 bg-gold/10 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gold/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !analytics ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-400">No analytics data yet. Start getting users and sales!</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className={`${s.bg} border border-gold/10 rounded-2xl p-5`}>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            {chartData.length > 0 && (
              <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 mb-6">
                <h2 className="text-white font-serif font-bold text-lg mb-6">Monthly Sales Trend</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245,166,35,0.05)" }} />
                    <Bar dataKey="revenue" fill="#F5A623" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total Readers</p>
                <p className="text-white text-xl font-bold mt-1">{analytics.totalReaders?.toLocaleString() || "0"}</p>
              </div>
              <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-white text-xl font-bold mt-1">{(analytics.monthlySales || []).reduce((s, m) => s + (m.sales || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
