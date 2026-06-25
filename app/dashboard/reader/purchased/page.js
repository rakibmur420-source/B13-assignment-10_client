"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReaderSidebar from "@/components/ReaderSidebar";
import axios from "axios";

export default function PurchasedBooksPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    axios.get(`${API_URL}/api/transactions/my-purchases`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setPurchases(r.data)).catch(() => {}).finally(() => setFetching(false));
  }, [user, loading]);

  return (
    <div className="flex bg-navy min-h-screen">
      <ReaderSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white">Purchased Books</h1>
          <p className="text-gray-400 text-sm mt-1">All ebooks you have bought.</p>
        </div>
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-16 text-center">
            <p className="text-4xl mb-4">📖</p>
            <p className="text-white font-semibold mb-2">No purchases yet</p>
            <p className="text-gray-400 text-sm mb-6">Browse our collection and buy your first ebook!</p>
            <button onClick={() => router.push("/ebooks")} className="px-6 py-2 bg-gold text-navy font-bold rounded-xl text-sm">Browse Books</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {purchases.map((t) => (
              <div key={t._id} className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden cursor-pointer hover:border-gold/30 transition-all"
                onClick={() => router.push(`/ebooks/${t.ebook?._id}`)}>
                <div className="h-44 bg-navy flex items-center justify-center overflow-hidden">
                  {t.ebook?.coverImage
                    ? <img src={t.ebook.coverImage} alt={t.ebookTitle} className="w-full h-full object-cover" />
                    : <span className="text-5xl">📖</span>}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{t.ebookTitle}</h3>
                  <p className="text-gray-400 text-xs mb-2">{t.ebook?.writerName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold text-sm font-medium">${t.amount}</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Purchased</span>
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
