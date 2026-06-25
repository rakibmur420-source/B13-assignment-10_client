"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";
import toast from "react-hot-toast";

export default function WriterBooksPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "writer") { router.push("/"); return; }
    fetchBooks();
  }, [user, loading]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ebooks/writer/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data);
    } catch (e) { toast.error("Failed to load books"); }
    finally { setFetching(false); }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/ebooks/${id}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated!"); fetchBooks();
    } catch (e) { toast.error("Failed"); }
  };

  const deleteBook = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/api/ebooks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted!"); fetchBooks();
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">My Books</h1>
            <p className="text-gray-400 text-sm mt-1">Manage all your published and draft ebooks.</p>
          </div>
          <button onClick={() => router.push("/dashboard/writer/add")}
            className="px-4 py-2 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl text-sm transition-all">
            + Add New Book
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="bg-navy-light border border-gold/10 rounded-2xl p-16 text-center">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-white font-semibold mb-2">No books yet</p>
            <p className="text-gray-400 text-sm mb-6">Start publishing your first ebook today.</p>
            <button onClick={() => router.push("/dashboard/writer/add")}
              className="px-6 py-2 bg-gold text-navy font-bold rounded-xl text-sm">
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((b) => (
              <div key={b._id} className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
                <div className="h-44 bg-navy flex items-center justify-center overflow-hidden">
                  {b.coverImage ? (
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📖</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 truncate">{b.title}</h3>
                  <p className="text-gray-400 text-xs mb-3">{b.genre} · ${b.price}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {b.status}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(b._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          b.status === "published"
                            ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        }`}>
                        {b.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => deleteBook(b._id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        Delete
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
