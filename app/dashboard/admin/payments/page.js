"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";

const SAMPLE_TRANSACTIONS = [
  { _id: "t1", buyerName: "Emma Wilson", writerEmail: "Ava Stone", ebookTitle: "The Last Ember of Valtheria", amount: 300, status: "completed", createdAt: "2026-06-12" },
  { _id: "t2", buyerName: "Liam Carter", writerEmail: "Noah Anderson", ebookTitle: "Echoes of Midnight", amount: 120, status: "completed", createdAt: "2026-06-10" },
  { _id: "t3", buyerName: "Sophia Bennett", writerEmail: "Emma Wilson", ebookTitle: "The Silent Garden", amount: 450, status: "pending", createdAt: "2026-06-08" },
  { _id: "t4", buyerName: "James Thompson", writerEmail: "Ava Stone", ebookTitle: "Chronicles of the Void", amount: 250, status: "completed", createdAt: "2026-06-05" },
  { _id: "t5", buyerName: "Olivia Martinez", writerEmail: "Noah Anderson", ebookTitle: "Midnight Library", amount: 180, status: "refunded", createdAt: "2026-06-02" },
];

const statusStyle = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  refunded: "bg-red-500/20 text-red-400",
};

export default function AdminPaymentsPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }
    fetchTransactions();
  }, [user, loading]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/transactions/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.length > 0) setTransactions(res.data);
    } catch (e) {
      // use sample data
    } finally {
      setFetching(false);
    }
  };

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const completed = transactions.filter(t => t.status === "completed").length;
  const pendingRefunded = transactions.filter(t => t.status !== "completed").length;

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Payments Overview 💳
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track all transactions between readers and writers.</p>
        </div>

        {/* Table */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  {["Reader", "Writer", "Book", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="text-left text-gray-400 text-xs px-6 py-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-white text-sm font-medium">{t.buyerName || t.buyer?.name || t.buyerEmail}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{t.writerEmail}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{t.ebookTitle}</td>
                    <td className="px-6 py-4 text-white text-sm font-bold">${t.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[t.status] || "bg-gray-500/20 text-gray-400"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-white text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-green-400 text-3xl font-bold">{completed}</p>
          </div>
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Pending / Refunded</p>
            <p className="text-yellow-400 text-3xl font-bold">{pendingRefunded}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
