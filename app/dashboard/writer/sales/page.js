"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";

export default function WriterSalesPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "writer") { router.push("/"); return; }
    axios.get(`${API_URL}/api/transactions/my-sales`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setSales(r.data || []))
      .catch(() => setSales([]))
      .finally(() => setFetching(false));
  }, [user, loading]);

  const totalRevenue = sales.reduce((s, t) => s + t.amount, 0);
  const avgSale = sales.length ? (totalRevenue / sales.length).toFixed(2) : "0.00";

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">Sales History 💰</h1>
          <p className="text-gray-400 text-sm mt-1">Track all purchases made on your stories.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Sales", value: sales.length, color: "text-white" },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "text-green-400" },
            { label: "Average Sale", value: `$${avgSale}`, color: "text-gold" },
          ].map(s => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
          {fetching ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : sales.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-gray-400">No sales yet. Keep publishing!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Book", "Buyer Email", "Amount", "Date"].map(h => (
                    <th key={h} className="text-left text-gray-400 text-xs px-6 py-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map((t) => (
                  <tr key={t._id} className="border-b border-gold/5 hover:bg-white/2">
                    <td className="px-6 py-4 text-white text-sm font-medium">{t.ebookTitle}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{t.buyerEmail}</td>
                    <td className="px-6 py-4 text-green-400 text-sm font-bold">${t.amount}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(t.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
