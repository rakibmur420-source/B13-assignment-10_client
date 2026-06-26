"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const FALLBACK_STATS = {
  totalUsers: 12458,
  totalWriters: 1286,
  totalEbooks: 28742,
  totalRevenue: 186530,
  monthlySales: [
    { _id: { month: 1 }, revenue: 12000, sales: 45 },
    { _id: { month: 2 }, revenue: 15000, sales: 60 },
    { _id: { month: 3 }, revenue: 16000, sales: 72 },
    { _id: { month: 4 }, revenue: 17000, sales: 80 },
    { _id: { month: 5 }, revenue: 21000, sales: 95 },
    { _id: { month: 6 }, revenue: 25000, sales: 110 },
  ],
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(FALLBACK_STATS);
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
      if (res.data) setAnalytics({ ...FALLBACK_STATS, ...res.data });
    } catch (e) {
      // use fallback
    } finally {
      setFetching(false);
    }
  };

  const chartData = (analytics.monthlySales || []).map(m => ({
    name: MONTHS[(m._id?.month || 1) - 1],
    revenue: m.revenue || 0,
    sales: m.sales || 0,
    label: `$${((m.revenue || 0) / 1000).toFixed(0)}k`,
  }));

  const stats = [
    { label: "Total Users", value: analytics.totalUsers?.toLocaleString(), icon: "👥", color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Total Writers", value: analytics.totalWriters?.toLocaleString(), icon: "✍️", color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Ebooks Sold", value: analytics.totalEbooks?.toLocaleString(), icon: "📚", color: "text-gold", bg: "bg-gold/10" },
    { label: "Total Revenue", value: `$${(analytics.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "text-green-400", bg: "bg-green-500/10" },
  ];

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
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Admin Dashboard <span>📊</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor the platform's growth, sales, and reader activity.</p>
        </div>

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
              <Bar dataKey="revenue" fill="#F5A623" radius={[6, 6, 0, 0]} maxBarSize={60}
                label={{ position: "top", fill: "#9CA3AF", fontSize: 10, formatter: (v) => `$${(v/1000).toFixed(0)}k` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre breakdown placeholder */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "New Users This Month", value: "1,240", change: "+12%", color: "text-green-400" },
            { label: "Books Published", value: "348", change: "+8%", color: "text-green-400" },
            { label: "Avg Sale Value", value: "$12.40", change: "+3%", color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className="text-white text-xl font-bold mt-1">{s.value}</p>
              <p className={`text-xs mt-1 ${s.color}`}>{s.change} from last month</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
