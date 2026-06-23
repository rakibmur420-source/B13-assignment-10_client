"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiBook } from "react-icons/fi";
import Footer from "@/components/Footer";

const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography", "Self-Help", "History", "Other"];

export default function EbooksPage() {
  const searchParams = useSearchParams();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchEbooks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (genre) params.append("genre", genre);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);
      params.append("page", page);
      params.append("limit", 12);

      const res = await axios.get(`${API_URL}/api/ebooks?${params}`);
      setEbooks(res.data.ebooks);
      setTotal(res.data.total);
      setPages(res.data.pages);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks(1);
  }, [genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEbooks(1);
  };

  return (
    <main className="min-h-screen bg-navy pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-3">
            Browse <span className="text-gold">Ebooks</span>
          </h1>
          <p className="text-gray-400">{total} ebooks available</p>
        </motion.div>

        {/* Search & Filter */}
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or writer..."
                className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-gold/50 rounded-xl text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Genre */}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="px-4 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none focus:border-gold/50"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Price Range */}
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              className="w-24 px-3 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none focus:border-gold/50"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              className="w-24 px-3 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none focus:border-gold/50"
            />

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 bg-navy border border-gold/20 rounded-xl text-gray-300 focus:outline-none focus:border-gold/50"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <FiFilter /> Filter
            </button>
          </form>
        </div>

        {/* Ebooks Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-navy-light rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-20">
            <FiBook className="text-gold text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No ebooks found matching your filters.</p>
            <button
              onClick={() => { setSearch(""); setGenre(""); setMinPrice(""); setMaxPrice(""); setSort(""); fetchEbooks(1); }}
              className="mt-4 px-6 py-3 bg-gold text-navy font-bold rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ebooks.map((ebook, i) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Link href={`/ebooks/${ebook._id}`}>
                  <div className="bg-navy-light border border-gold/10 hover:border-gold/30 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer h-full">
                    <div className="relative">
                      <img
                        src={ebook.coverImage}
                        alt={ebook.title}
                        className="w-full h-52 object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-gold text-navy text-xs font-bold rounded-lg">
                        {ebook.genre}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold truncate">{ebook.title}</h3>
                      <p className="text-gray-400 text-sm truncate mt-1">{ebook.writerName}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gold font-bold">${ebook.price}</span>
                        <span className="text-xs text-gray-500">{ebook.totalSales} sold</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => fetchEbooks(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-navy-light border border-gold/20 text-gray-300 rounded-xl disabled:opacity-50 hover:border-gold/40 transition-all"
            >
              Previous
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchEbooks(i + 1)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  currentPage === i + 1
                    ? "bg-gold text-navy font-bold"
                    : "bg-navy-light border border-gold/20 text-gray-300 hover:border-gold/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => fetchEbooks(currentPage + 1)}
              disabled={currentPage === pages}
              className="px-4 py-2 bg-navy-light border border-gold/20 text-gray-300 rounded-xl disabled:opacity-50 hover:border-gold/40 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}