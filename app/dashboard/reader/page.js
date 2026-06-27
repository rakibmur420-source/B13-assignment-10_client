"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReaderSidebar from "@/components/ReaderSidebar";
import axios from "axios";
import toast from "react-hot-toast";

export default function ReaderDashboard() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    fetchPurchases();
  }, [user, loading]);

  const fetchPurchases = () => {
    axios.get(`${API_URL}/api/transactions/my-purchases`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setPurchases(r.data || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  };

  const handleRemove = async (ebookId, e) => {
    e.stopPropagation();
    if (!confirm("Remove this book from your purchases?")) return;
    const userId = user.id || user._id;
    setPurchases(prev => prev.filter(t => t.ebook?._id !== ebookId));
    try {
      await axios.delete(`${API_URL}/api/transactions/my-purchases/${ebookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Removed from purchases");
    } catch {
      toast.error("Failed to remove");
      fetchPurchases();
    }
  };

  const totalSpent = purchases.reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="flex bg-navy min-h-screen">
      <ReaderSidebar />
      <main className="flex-1 pt-20 px-4 md:px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-white">Welcome back, {user?.name?.split(" ")[0]} 📖</h1>
          <p className="text-gray-400 text-sm mt-1">Your reading library and purchase history.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-navy-light border border-gold/10 rounded-xl p-5">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-2xl font-bold text-white">{purchases.length}</div>
            <div className="text-gray-400 text-sm mt-1">Books Purchased</div>
          </div>
          <div className="bg-navy-light border border-gold/10 rounded-xl p-5">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-2xl font-bold text-green-400">${totalSpent.toFixed(2)}</div>
            <div className="text-gray-400 text-sm mt-1">Total Spent</div>
          </div>
        </div>

        {/* Purchased Books */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">My Books</h2>
          <button onClick={() => router.push("/ebooks")} className="text-gold text-sm hover:underline">Browse more →</button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-16 text-center">
            <p className="text-4xl mb-4">📖</p>
            <p className="text-white font-semibold mb-2">No purchases yet</p>
            <p className="text-gray-400 text-sm mb-6">Browse and buy your first ebook!</p>
            <button onClick={() => router.push("/ebooks")} className="px-6 py-2 bg-gold text-navy font-bold rounded-xl text-sm">Browse Books</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchases.map((t) => (
              <div key={t._id}
                className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all">
                <div className="h-44 bg-navy flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/ebooks/${t.ebook?._id}`)}>
                  {t.ebook?.coverImage
                    ? <img src={t.ebook.coverImage} alt={t.ebookTitle} className="w-full h-full object-cover" />
                    : <span className="text-5xl">📖</span>}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 cursor-pointer hover:text-gold"
                    onClick={() => router.push(`/ebooks/${t.ebook?._id}`)}>{t.ebookTitle}</h3>
                  <p className="text-gray-400 text-xs mb-3">{t.ebook?.writerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold text-sm font-bold">${t.amount}</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Purchased</span>
                      <button
                        onClick={(e) => handleRemove(t.ebook?._id, e)}
                        className="px-2 py-0.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full text-xs transition-all">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
