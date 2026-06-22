"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiBook, FiShoppingBag, FiBookmark, FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("purchased");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "writer") router.push("/dashboard/writer");
    if (user.role === "admin") router.push("/dashboard/admin");
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [purchasesRes, bookmarksRes] = await Promise.all([
        axios.get(`${API_URL}/api/transactions/my-purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/users/${user.id}/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPurchases(purchasesRes.data);
      setBookmarks(bookmarksRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "purchased", label: "Purchased Ebooks", icon: <FiBook /> },
    { id: "history", label: "Purchase History", icon: <FiShoppingBag /> },
    { id: "bookmarks", label: "Bookmarks", icon: <FiBookmark /> },
    { id: "profile", label: "Profile", icon: <FiUser /> },
  ];

  return (
    <main className="min-h-screen bg-navy pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-white">
            My <span className="text-gold">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}!</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Purchased", value: purchases.length, icon: <FiBook />, color: "text-gold" },
            { label: "Bookmarks", value: bookmarks.length, icon: <FiBookmark />, color: "text-burgundy" },
            { label: "Total Spent", value: `$${purchases.reduce((a, b) => a + b.amount, 0).toFixed(2)}`, icon: <FiShoppingBag />, color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className={`${stat.color} text-2xl mb-2`}>{stat.icon}</div>
              <div className="text-white text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-navy-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Purchased Ebooks */}
            {activeTab === "purchased" && (
              <div>
                {purchases.length === 0 ? (
                  <div className="text-center py-16">
                    <FiBook className="text-gold text-5xl mx-auto mb-4" />
                    <p className="text-gray-400">No purchased ebooks yet.</p>
                    <Link href="/ebooks" className="inline-block mt-4 px-6 py-3 bg-gold text-navy font-bold rounded-xl">
                      Browse Ebooks
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {purchases.map((purchase) => (
                      <motion.div
                        key={purchase._id}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Link href={`/ebooks/${purchase.ebook?._id}`}>
                          <div className="bg-navy-light border border-gold/10 hover:border-gold/30 rounded-xl overflow-hidden transition-all duration-200">
                            <img
                              src={purchase.ebook?.coverImage}
                              alt={purchase.ebookTitle}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                              <h3 className="text-white text-sm font-semibold truncate">{purchase.ebookTitle}</h3>
                              <p className="text-gold text-xs mt-1">${purchase.amount}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Purchase History */}
            {activeTab === "history" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Ebook</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Writer</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Amount</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Date</th>
                      <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-400 py-10">No purchase history</td>
                      </tr>
                    ) : (
                      purchases.map((purchase) => (
                        <tr key={purchase._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4 text-white text-sm">{purchase.ebookTitle}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{purchase.writerEmail}</td>
                          <td className="px-6 py-4 text-gold font-bold">${purchase.amount}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                              {purchase.status}
                            </span>
                          </td>
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
                            <img
                              src={ebook.coverImage}
                              alt={ebook.title}
                              className="w-full h-48 object-cover"
                            />
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

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="max-w-md">
                <div className="bg-navy-light border border-gold/20 rounded-2xl p-8">
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <span className="text-gold text-3xl font-bold">{user?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <p className="text-white font-semibold mt-1">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-semibold mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Role</label>
                      <span className="inline-block mt-1 px-3 py-1 bg-gold/20 text-gold rounded-lg text-sm font-medium capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}