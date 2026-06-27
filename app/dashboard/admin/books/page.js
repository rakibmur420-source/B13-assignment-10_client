"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminBooksPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }
    fetchBooks();
  }, [user, loading]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ebooks/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data || []);
    } catch (e) {
      setBooks([]);
      toast.error("Failed to load books");
    } finally {
      setFetching(false);
    }
  };

  const toggleStatus = async (id) => {
    const book = books.find(b => b._id === id);
    if (!book) return;
    setBooks(prev => prev.map(b => b._id === id ? { ...b, status: b.status === "published" ? "unpublished" : "published" } : b));
    try {
      await axios.patch(`${API_URL}/api/ebooks/${id}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated!");
    } catch (e) {
      setBooks(prev => prev.map(b => b._id === id ? book : b));
      toast.error("Failed");
    }
  };

  const deleteBook = async (id) => {
    if (!confirm("Delete this book permanently?")) return;
    setBooks(prev => prev.filter(b => b._id !== id));
    try {
      await axios.delete(`${API_URL}/api/ebooks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Book deleted!");
    } catch (e) { toast.error("Failed"); fetchBooks(); }
  };

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-4 md:px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            Book Management 📚
          </h1>
          <p className="text-gray-400 text-sm mt-1">Publish, unpublish, or remove books from the platform.</p>
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
          {fetching ? (
            <div className="p-10 text-center text-gray-400">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-3xl mb-3">📚</p>
              <p className="text-gray-400">No books on the platform yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    {["Book Name", "Writer", "Price", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left text-gray-400 text-xs px-6 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {b.coverImage && (
                            <img src={b.coverImage} alt={b.title}
                              className="w-9 h-12 object-cover rounded-lg flex-shrink-0" />
                          )}
                          <span className="text-white text-sm font-medium">{b.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{b.writerName}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm font-medium">${b.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          b.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {b.status === "published" ? "Published" : "Unpublished"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleStatus(b._id)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              b.status === "published"
                                ? "bg-yellow-500 hover:bg-yellow-600 text-navy"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}>
                            {b.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button onClick={() => deleteBook(b._id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-all">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
