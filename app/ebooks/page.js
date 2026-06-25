"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const SEED_BOOKS = [
  { _id: "seed1", title: "The Last Ember of Valtheria", writerName: "Evelyn Hart", genre: "Fantasy", price: 12.99, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", description: "A botanist discovers flowers that preserve memories of the dead.", totalSales: 190, status: "published" },
  { _id: "seed2", title: "Whispers in Ash", writerName: "Noah Blake", genre: "Mystery", price: 9.99, coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop", description: "A detective hunts a killer through the fog of a dying city.", totalSales: 214, status: "published" },
  { _id: "seed3", title: "Orbit of Dreams", writerName: "Lena Carter", genre: "Sci-Fi", price: 11.50, coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", description: "Two astronauts fall in love on a mission to the edge of the solar system.", totalSales: 145, status: "published" },
  { _id: "seed4", title: "Moonlit Letters", writerName: "Emma Rivers", genre: "Romance", price: 9.99, coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop", description: "Two strangers exchange anonymous letters that slowly transform their lives.", totalSales: 312, status: "published" },
  { _id: "seed5", title: "The Garden of Forgotten Stars", writerName: "Lillian Moore", genre: "Mystery", price: 10.99, coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop", description: "A botanist discovers flowers that preserve memories of the dead.", totalSales: 190, status: "published" },
  { _id: "seed6", title: "Echoes of Tomorrow", writerName: "James Holt", genre: "Sci-Fi", price: 13.50, coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop", description: "A scientist travels back in time only to find the future has already changed.", totalSales: 98, status: "published" },
  { _id: "seed7", title: "The Clockmaker's Promise", writerName: "Sophia Reed", genre: "Fiction", price: 8.99, coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop", description: "A clockmaker discovers his creations hold the power to stop time.", totalSales: 76, status: "published" },
  { _id: "seed8", title: "Midnight Library", writerName: "Oliver Stone", genre: "Fantasy", price: 14.99, coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop", description: "Between life and death there is a library, and each book is a different life you could have lived.", totalSales: 421, status: "published" },
];

const GENRES = ["All", "Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Adventure", "Biography", "Self-Help", "History", "Drama"];

function EbooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState(SEED_BOOKS);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(searchParams.get("genre") || "All");
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre && genre !== "All") params.set("genre", genre);
    axios.get(`${API_URL}/api/ebooks?${params.toString()}`)
      .then(r => { if (r.data?.ebooks?.length > 0) setBooks(r.data.ebooks); })
      .catch(() => {})
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
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
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
                  {book.status === "published" && (
                    <span className="mt-2 inline-block px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">published</span>
                  )}
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
