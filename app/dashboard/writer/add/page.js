"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import WriterSidebar from "@/components/WriterSidebar";
import axios from "axios";
import toast from "react-hot-toast";

const GENRES = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Adventure", "Biography", "Self-Help", "History", "Drama"];

export default function AddBookPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", content: "", price: "", genre: "Fiction" });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: formData });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.content) return toast.error("Please fill all required fields");
    setLoading(true);
    try {
      let coverImage = "";
      if (coverFile) coverImage = await uploadImage(coverFile);
      await axios.post(`${API_URL}/api/ebooks`, { ...form, price: Number(form.price), coverImage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book published successfully! 🎉");
      router.push("/dashboard/writer/books");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to publish");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex bg-navy min-h-screen">
      <WriterSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white">Add a New Book</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details and publish your ebook to the platform.</p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cover Image */}
            <div className="bg-navy-light border border-gold/10 rounded-2xl p-5">
              <label className="text-gray-400 text-sm mb-3 block font-medium">Cover Image</label>
              <div className="flex items-start gap-5">
                <div className="w-28 h-36 bg-navy rounded-xl border-2 border-dashed border-gold/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {preview ? <img src={preview} className="w-full h-full object-cover rounded-xl" /> : <span className="text-3xl">📖</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="cover-upload" />
                  <label htmlFor="cover-upload" className="cursor-pointer px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold rounded-xl text-sm font-medium transition-all inline-block">
                    Upload Cover
                  </label>
                  <p className="text-gray-500 text-xs mt-2">JPG, PNG, WebP — Recommended 400×600px</p>
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="bg-navy-light border border-gold/10 rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required
                  placeholder="Enter book title" className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                  <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}
                    className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white focus:outline-none">
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Price (USD) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required
                    placeholder="9.99" className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  placeholder="A short description of your book..." className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Content *</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} required
                  placeholder="Write your ebook content here..." className="w-full px-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none resize-none" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition-all disabled:opacity-50">
              {loading ? "Publishing..." : "Publish Book 🚀"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
