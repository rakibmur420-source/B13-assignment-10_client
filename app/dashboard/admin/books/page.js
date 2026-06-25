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
      const res = await axios.get(`${API_URL}/api/ebooks/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data);
    } catch (e) { toast.error("Failed to load books"); }
    finally { setFetching(false); }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/ebooks/${id}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated!");
      fetchBooks();
    } catch (e) { toast.error("Failed"); }
  };

  const deleteBook = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/api/ebooks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Book deleted!");
      fetchBooks();
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">Book Management 📚</h1>
          <p className="text-gray-400 text-sm mt-1">Publish, unpublish, or remove books from the platform.</p>
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
          {fetching ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Book Name</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Writer</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Price</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {b.coverImage && (
                            <img src={b.coverImage} alt={b.title} className="w-9 h-12 object-cover rounded" />
                          )}
                          <span className="text-white text-sm font-medium">{b.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{b.writerName}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">${b.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {b.status === "published" ? "Published" : "Unpublished"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(b._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              b.status === "published"
                                ? "bg-yellow-500 hover:bg-yellow-600 text-navy"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            {b.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => deleteBook(b._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white transition-all"
                          >
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
