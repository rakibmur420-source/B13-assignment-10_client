"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiBook, FiUsers, FiStar } from "react-icons/fi";
import Footer from "@/components/Footer";

const genres = [
  { name: "Fiction", emoji: "📖" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Romance", emoji: "💕" },
  { name: "Sci-Fi", emoji: "🚀" },
  { name: "Fantasy", emoji: "🧙" },
  { name: "Horror", emoji: "👻" },
  { name: "Biography", emoji: "👤" },
  { name: "Self-Help", emoji: "💡" },
  { name: "History", emoji: "🏛️" },
  { name: "Other", emoji: "📚" },
];

export default function Home() {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ebooksRes, writersRes] = await Promise.all([
          axios.get(`${API_URL}/api/ebooks/featured`),
          axios.get(`${API_URL}/api/ebooks/top-writers`),
        ]);
        setFeaturedEbooks(ebooksRes.data);
        setTopWriters(writersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-navy dark:bg-navy">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, #800020 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-6">
              ✨ The World's Best Ebook Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Discover & Read
              <span className="text-gold block">Original Ebooks</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Connect with talented writers, explore thousands of original ebooks,
              and dive into stories that move you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ebooks"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl text-lg transition-all duration-200 hover:scale-105"
              >
                Browse Ebooks <FiArrowRight />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 border border-gold/30 hover:border-gold text-gold rounded-xl text-lg transition-all duration-200 hover:bg-gold/10"
              >
                Become a Writer
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20"
          >
            {[
              { icon: <FiBook />, label: "Ebooks", value: "500+" },
              { icon: <FiUsers />, label: "Writers", value: "200+" },
              { icon: <FiStar />, label: "Readers", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-gold text-2xl mb-1 flex justify-center">{stat.icon}</div>
                <div className="text-white text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Ebooks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Featured <span className="text-gold">Ebooks</span>
          </h2>
          <p className="text-gray-400">Handpicked stories just for you</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-navy-light rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : featuredEbooks.length === 0 ? (
          <div className="text-center py-20">
            <FiBook className="text-gold text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No ebooks yet. Be the first to publish!</p>
            <Link href="/register" className="inline-block mt-4 px-6 py-3 bg-gold text-navy font-bold rounded-xl">
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredEbooks.map((ebook, i) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/ebooks/${ebook._id}`}>
                  <div className="bg-navy-light rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-200 cursor-pointer">
                    <img
                      src={ebook.coverImage}
                      alt={ebook.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-white text-sm font-semibold truncate">{ebook.title}</h3>
                      <p className="text-gray-400 text-xs truncate">{ebook.writerName}</p>
                      <p className="text-gold text-sm font-bold mt-1">${ebook.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/ebooks"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 hover:border-gold text-gold rounded-xl transition-all duration-200 hover:bg-gold/10"
          >
            View All Ebooks <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Top Writers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Top <span className="text-gold">Writers</span>
          </h2>
          <p className="text-gray-400">Meet our most celebrated authors</p>
        </motion.div>

        {topWriters.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No writers yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {topWriters.map((writer, i) => (
              <motion.div
                key={writer._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-navy-light border border-gold/10 hover:border-gold/30 rounded-xl p-6 text-center transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold text-2xl font-bold">
                    {writer.writerName?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-white font-semibold">{writer.writerName}</h3>
                <p className="text-gold text-sm mt-1">{writer.totalSales} sales</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Genres */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Explore <span className="text-gold">Genres</span>
          </h2>
          <p className="text-gray-400">Find your perfect read by genre</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {genres.map((genre, i) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={`/ebooks?genre=${genre.name}`}
                className="block bg-navy-light border border-gold/10 hover:border-gold/40 hover:bg-gold/5 rounded-xl p-4 text-center transition-all duration-200"
              >
                <span className="text-3xl mb-2 block">{genre.emoji}</span>
                <span className="text-gray-300 text-sm font-medium">{genre.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}