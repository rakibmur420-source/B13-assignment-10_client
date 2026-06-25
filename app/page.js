"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const SEED_BOOKS = [
  { _id: "seed1", title: "The Last Ember of Valtheria", writerName: "Evelyn Hart", genre: "Fantasy", price: 12.99, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", description: "A botanist discovers flowers that preserve memories of the dead." },
  { _id: "seed2", title: "Whispers in Ash", writerName: "Noah Blake", genre: "Mystery", price: 9.99, coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop", description: "A detective hunts a killer through the fog of a dying city." },
  { _id: "seed3", title: "Orbit of Dreams", writerName: "Lena Carter", genre: "Sci-Fi", price: 11.50, coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", description: "Two astronauts fall in love on a mission to the edge of the solar system." },
  { _id: "seed4", title: "Moonlit Letters", writerName: "Emma Rivers", genre: "Romance", price: 9.99, coverImage: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop", description: "Two strangers exchange anonymous letters that slowly transform their lives." },
  { _id: "seed5", title: "The Garden of Forgotten Stars", writerName: "Lillian Moore", genre: "Mystery", price: 10.99, coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop", description: "A botanist discovers flowers that preserve memories of the dead." },
  { _id: "seed6", title: "Echoes of Tomorrow", writerName: "James Holt", genre: "Sci-Fi", price: 13.50, coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop", description: "A scientist travels back in time only to find the future has already changed." },
];

const TOP_WRITERS = [
  { name: "Evelyn Hart", sales: "12.4k Sales" },
  { name: "Noah Blake", sales: "10.1k Sales" },
  { name: "Sophia Reed", sales: "9.6k Sales" },
];

const GENRES = [
  { name: "Fiction", emoji: "📖" },
  { name: "Mystery", emoji: "🔍" },
  { name: "Romance", emoji: "❤️" },
  { name: "Sci-Fi", emoji: "🚀" },
  { name: "Fantasy", emoji: "🧙" },
  { name: "Horror", emoji: "👻" },
  { name: "Thriller", emoji: "⚡" },
  { name: "Adventure", emoji: "🗺️" },
];

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState(SEED_BOOKS);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/ebooks/featured`)
      .then(r => { if (r.data?.length > 0) setFeaturedBooks(r.data); })
      .catch(() => {});
  }, []);

  return (
    <main className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-navy-light opacity-90" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium mb-6">
            📚 Discover. Read. Create.
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Every Great Story<br />
            <span className="text-gold">Starts Here</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Explore thousands of ebooks from talented writers around the world. Buy, read, and bookmark your favorites — or publish your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ebooks" className="px-8 py-3.5 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl text-lg transition-all hover:scale-105">
              Browse Books
            </Link>
            <Link href="/register" className="px-8 py-3.5 border border-gold/30 hover:border-gold text-gold font-semibold rounded-xl text-lg transition-all">
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white">Featured Ebooks</h2>
            <p className="text-gray-400 mt-2">Hand-picked stories for every reader.</p>
          </div>
          <Link href="/ebooks" className="text-gold hover:underline text-sm font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {featuredBooks.slice(0, 6).map((book) => (
            <div key={book._id}
              onClick={() => router.push(`/ebooks/${book._id}`)}
              className="group cursor-pointer bg-navy-light border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1">
              <div className="h-52 overflow-hidden bg-navy">
                <img src={book.coverImage || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop"}
                  alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">{book.genre}</span>
                <h3 className="text-white font-semibold mt-2 mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-gray-400 text-xs mb-3">by {book.writerName}</p>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-bold">${book.price}</span>
                  <button className="px-3 py-1 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium rounded-lg transition-all">View Ebook</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Writers */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-serif font-bold text-white">Top Writers</h2>
          <p className="text-gray-400 mt-2">Celebrating authors loved by readers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_WRITERS.map((w, i) => (
            <div key={w.name} className="bg-navy-light border border-gold/10 rounded-2xl p-8 text-center hover:border-gold/30 transition-all">
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl font-bold">{w.name.charAt(0)}</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{w.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{w.sales}</p>
              {i === 0 && <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full">🏆 Top Author</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Genre */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-serif font-bold text-white">Browse by Genre</h2>
          <p className="text-gray-400 mt-2">Whatever you're in the mood for, there's a story waiting.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((g) => (
            <button key={g.name}
              onClick={() => router.push(`/ebooks?genre=${g.name}`)}
              className="bg-navy-light border border-gold/10 hover:border-gold/40 hover:bg-gold/5 rounded-2xl p-8 text-center transition-all duration-200 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{g.emoji}</div>
              <span className="text-gray-300 group-hover:text-white font-medium transition-colors">{g.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-navy-light border border-gold/20 rounded-3xl p-12">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Share Your Story?</h2>
          <p className="text-gray-400 mb-8">Join thousands of writers already publishing on Fable. It's free to start.</p>
          <Link href="/register" className="inline-block px-8 py-3.5 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl text-lg transition-all hover:scale-105">
            Become a Writer
          </Link>
        </div>
      </section>
    </main>
  );
}
