"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBook, FiPlus, FiEdit, FiTrash2, FiBookmark, FiDollarSign, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function WriterDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", content: "", price: "", genre: "", coverImage: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "Self-Help", "History", "Other"];

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role === "user") { router.push("/dashboard/user"); return; }
    if (user.role === "admin") { router.push("/dashboard/admin"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [ebooksRes, salesRes, bookmarksRes] = await Promise.all([
        axios.get(`${API_URL}/api/ebooks/writer/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/transactions/my-sales`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/users/${user.id}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setEbooks(ebooksRes.data);
      setSales(salesRes.data);
      setBookmarks(bookmarksRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, data);
      setFormData({ ...formData, coverImage: res.data.data.url });
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEbook) {
        await axios.put(`${API_URL}/api/ebooks/${editingEbook._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Ebook updated!");
      } else {
        await axios.post(`${API_URL}/api/ebooks`, { ...formData, writerName: user.name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Ebook added!");
      }
      setShowAddForm(false);
      setEditingEbook(null);
      setFormData({ title: "", description: "", content: "", price: "", genre: "", coverImage: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed to save ebook");
    }
  };

  const handleEdit = (ebook) => {
    setEditingEbook(ebook);
    setFormData({
      title: ebook.title,
      description: ebook.description,
      content: ebook.content,
      price: ebook.price,
      genre: ebook.genre,
      coverImage: ebook.coverImage,
    });
    setShowAddForm(true);
    setActiveTab("books");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;
    try {
      await axios.delete(`${API_URL}/api/ebooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ebook deleted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/ebooks/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Status updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const totalRevenue = sales.reduce((a, b) => a + b.amount, 0);

  const tabs = [
    { id: "books", label: "My Ebooks", icon: <FiBook /> },
    { id: "sales", label: "Sales History", icon: <FiDollarSign /> },
    { id: "bookmarks", label: "Bookmarks", icon: <FiBookmark /> },
  ];

  return (
    <main className="min-h-screen bg-navy pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">
              Writer <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-1">Welcome, {user?.name}!</p>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setEditingEbook(null); setFormData({ title: "", description: "", content: "", price: "", genre: "", coverImage: "" }); }}
            className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200"
          >
            <FiPlus /> Add Ebook
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Ebooks", value: ebooks.length, icon: <FiBook />, color: "text-gold" },
            { label: "Published", value: ebooks.filter(e => e.status === "published").length, icon: <FiEye />, color: "text-green-400" },
            { label: "Total Sales", value: sales.length, icon: <FiDollarSign />, color: "text-blue-400" },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <FiDollarSign />, color: "text-gold" },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className={`${stat.color} text-2xl mb-2`}>{stat.icon}</div>
              <div className="text-white text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-light border border-gold/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-white text-xl font-serif font-bold mb-6">
              {editingEbook ? "Edit Ebook" : "Add New Ebook"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ebook title"
                  className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none focus:border-gold/50"
                >
                  <option value="">Select genre</option>
                  {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  placeholder="9.99"
                  className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gold file:text-navy file:font-bold"
                />
                {uploading && <p className="text-gold text-xs mt-1">Uploading...</p>}
                {formData.coverImage && <p className="text-green-400 text-xs mt-1">✓ Image ready</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">Description (Preview)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Brief description of your ebook..."
                  className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">Full Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                  placeholder="Full ebook content..."
                  className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200"
                >
                  {editingEbook ? "Update Ebook" : "Publish Ebook"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingEbook(null); }}
                  className="px-6 py-3 border border-gold/20 text-gray-400 rounded-xl hover:border-gold/40 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gold text-navy font-bold"
                  : "bg-navy-light border border-gold/20 text-gray-400 hover:border-gold/40"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-48 bg-navy-light rounded-xl animate-pulse" />
        ) : (
          <>
            {/* My Ebooks */}
            {activeTab === "books" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Title</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Genre</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Price</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Sales</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ebooks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-400 py-10">
                          No ebooks yet. Click "Add Ebook" to get started!
                        </td>
                      </tr>
                    ) : (
                      ebooks.map((ebook) => (
                        <tr key={ebook._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={ebook.coverImage} alt={ebook.title} className="w-10 h-12 object-cover rounded-lg" />
                              <span className="text-white text-sm font-medium">{ebook.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{ebook.genre}</td>
                          <td className="px-6 py-4 text-gold font-bold">${ebook.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              ebook.status === "published" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                              {ebook.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{ebook.totalSales}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(ebook._id)}
                                className="p-2 text-gray-400 hover:text-gold transition-colors"
                                title={ebook.status === "published" ? "Unpublish" : "Publish"}
                              >
                                {ebook.status === "published" ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                              <button
                                onClick={() => handleEdit(ebook)}
                                className="p-2 text-gray-400 hover:text-gold transition-colors"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(ebook._id)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sales History */}
            {activeTab === "sales" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Ebook</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Buyer</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Amount</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-400 py-10">No sales yet.</td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr key={sale._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4 text-white text-sm">{sale.ebookTitle}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{sale.buyerEmail}</td>
                          <td className="px-6 py-4 text-gold font-bold">${sale.amount}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{new Date(sale.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bookmarks */}
            {activeTab === "bookmarks" && (
              <div>
                {bookmarks.length === 0 ? (
                  <div className="text-center py-16">
                    <FiBookmark className="text-gold text-5xl mx-auto mb-4" />
                    <p className="text-gray-400">No bookmarks yet.</p>
                    <Link href="/ebooks" className="inline-block mt-4 px-6 py-3 bg-gold text-navy font-bold rounded-xl">
                      Browse Ebooks
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bookmarks.map((ebook) => (
                      <motion.div key={ebook._id} whileHover={{ scale: 1.03 }}>
                        <Link href={`/ebooks/${ebook._id}`}>
                          <div className="bg-navy-light border border-gold/10 hover:border-gold/30 rounded-xl overflow-hidden transition-all duration-200">
                            <img src={ebook.coverImage} alt={ebook.title} className="w-full h-48 object-cover" />
                            <div className="p-3">
                              <h3 className="text-white text-sm font-semibold truncate">{ebook.title}</h3>
                              <p className="text-gold text-xs mt-1">${ebook.price}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}