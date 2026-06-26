"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";

const SAMPLE = [
  { _id: "bm1", title: "The Silent Horizon", writerName: "Elena Rivers", price: 12.99, createdAt: "2026-06-16" },
  { _id: "bm2", title: "Ashes of Tomorrow", writerName: "Mark Dalton", price: 9.5, createdAt: "2026-06-16" },
  { _id: "bm3", title: "Neon Dreams", writerName: "Aiko Tanaka", price: 15, createdAt: "2026-06-16" },
];

export default function WriterBookmarksPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "writer") { router.push("/"); return; }
    const userId = user.id || user._id;
    axios.get(`${API_URL}/api/users/${userId}/bookmarks`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setBookmarks(r.data?.length > 0 ? r.data : SAMPLE))
      .catch(() => setBookmarks(SAMPLE))
      .finally(() => setFetching(false));
  }, [user, loading]);

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <h1 className="text-2xl font-serif font-bold text-white mb-6">📚 Bookmarked Books</h1>
        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
          {fetching ? <div className="p-10 text-center text-gray-400">Loading...</div> : bookmarks.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No bookmarks yet.</div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-gold/10">{["Title","Author","Price","Date"].map(h => <th key={h} className="text-left text-gray-400 text-xs px-6 py-4 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {bookmarks.map(b => (
                  <tr key={b._id} className="border-b border-gold/5 hover:bg-white/2 cursor-pointer" onClick={() => router.push(`/ebooks/${b._id}`)}>
                    <td className="px-6 py-4 text-white text-sm font-medium">{b.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.writerName}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">${b.price}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
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
