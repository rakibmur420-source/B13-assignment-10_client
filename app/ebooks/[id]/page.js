"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBookmark, FiShoppingCart, FiArrowLeft, FiUser, FiTag, FiCalendar } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchEbook();
    if (user) {
      checkPurchased();
      checkBookmarked();
    }
  }, [id, user]);

  const fetchEbook = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ebooks/${id}`);
      setEbook(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchased = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${user.id}/purchased`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPurchased(res.data.some((e) => e._id === id));
    } catch (err) {
      console.error(err);
    }
  };

  const checkBookmarked = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${user.id}/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsBookmarked(res.data.some((e) => e._id === id));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase");
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/transactions/create-checkout-session`,
        { ebookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please login to bookmark");
      router.push("/login");
      return;
    }
    setBookmarking(true);
    try {
      await axios.patch(
        `${API_URL}/api/users/${user.id}/bookmark`,
        { ebookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Bookmarked!");
    } catch (err) {
      toast.error("Failed to bookmark");
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-navy-light rounded-2xl animate-pulse" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-navy-light rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!ebook) {
    return (
      <main className="min-h-screen bg-navy pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-serif mb-4">Ebook not found</h2>
          <Link href="/ebooks" className="text-gold hover:underline">
            Back to Browse
          </Link>
        </div>
      </main>
    );
  }

  const isWriter = user?.id === ebook.writer;

  return (
    <main className="min-h-screen bg-navy pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8"
        >
          <FiArrowLeft /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={ebook.coverImage}
              alt={ebook.title}
              className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl shadow-gold/10 border border-gold/20"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-sm rounded-full">
                {ebook.genre}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mt-3 mb-2">
                {ebook.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <FiUser className="text-gold" />
                <span>{ebook.writerName}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-gold text-3xl font-bold">${ebook.price}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-white text-xl font-semibold">{ebook.totalSales}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  ebook.status === "published" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {ebook.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FiCalendar className="text-gold" />
              <span>Published {new Date(ebook.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Description */}
            <div className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <h3 className="text-gold font-semibold mb-3 font-serif">About this Ebook</h3>
              <p className="text-gray-300 leading-relaxed">{ebook.description}</p>
            </div>

            {/* Preview */}
            {isPurchased && (
              <div className="bg-navy-light border border-gold/20 rounded-xl p-5">
                <h3 className="text-gold font-semibold mb-3 font-serif">Content Preview</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {ebook.content?.substring(0, 500)}...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isPurchased ? (
                <div className="flex-1 py-4 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-xl text-center">
                  ✓ Already Purchased
                </div>
              ) : isWriter ? (
                <div className="flex-1 py-4 bg-gray-500/20 border border-gray-500/30 text-gray-400 font-bold rounded-xl text-center">
                  Your own ebook
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 py-4 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  {purchasing ? "Redirecting..." : `Buy Now - $${ebook.price}`}
                </button>
              )}

              <button
                onClick={handleBookmark}
                disabled={bookmarking}
                className={`px-4 py-4 rounded-xl border transition-all duration-200 ${
                  isBookmarked
                    ? "bg-gold/20 border-gold text-gold"
                    : "border-gold/20 text-gray-400 hover:border-gold/40 hover:text-gold"
                }`}
              >
                <FiBookmark size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}