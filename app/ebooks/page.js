"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const GENRES = ["All", "Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Adventure", "Biography", "Self-Help", "History", "Drama"];

function EbooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(searchParams.get("genre") || "All");
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre && genre !== "All") params.set("genre", genre);
    axios.get(`${API_URL}/api/ebooks?${params.toString()}`)
      .then(r => { setBooks(r.data?.ebooks || []); })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [search, genre]);

  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.writerName.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "All" || b.genre === genre;
    return matchSearch && matchGenre;
  });

  return (
    <main className="bg-navy min-h-screen pt-20 px-4 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl font-serif font-bold text-white mb-1">All Books ({filtered.length})</h1>
          <p className="text-gray-400 text-sm">Discover your next favorite read.</p>
        </div>

        {/* Search + Genre Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-3 bg-navy-light border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <select value={genre} onChange={e => setGenre(e.target.value)}
            className="px-4 py-3 bg-navy-light border border-gold/20 rounded-xl text-white focus:outline-none min-w-[160px]">
            {GENRES.map(g => <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>)}
          </select>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-navy" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gold/10 rounded w-1/3" />
                  <div className="h-4 bg-gold/10 rounded w-4/5" />
                  <div className="h-3 bg-gold/10 rounded w-2/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-white font-semibold mb-2">No books found</p>
            <p className="text-gray-400 text-sm">Try a different search or genre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <div key={book._id}
                onClick={() => router.push(`/ebooks/${book._id}`)}
                className="group cursor-pointer bg-navy-light border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1">
                <div className="h-52 overflow-hidden bg-navy">
                  <img
                    src={book.coverImage || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">{book.genre}</span>
                  <h3 className="text-white font-semibold mt-2 mb-1 line-clamp-1 text-sm">{book.title}</h3>
                  <p className="text-gray-400 text-xs mb-2">by {book.writerName}</p>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-bold text-sm">${book.price}</span>
                    {book.totalSales > 0 && <span className="text-gray-500 text-xs">Sales: {book.totalSales}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function EbooksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>}>
      <EbooksContent />
    </Suspense>
  );
}
