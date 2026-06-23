"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiUsers, FiBook, FiDollarSign, FiTrendingUp,
  FiTrash2, FiEye, FiEyeOff, FiShield
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersRes, ebooksRes, transactionsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/ebooks/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/transactions/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/transactions/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(usersRes.data);
      setEbooks(ebooksRes.data);
      setTransactions(transactionsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.patch(`${API_URL}/api/users/${userId}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Role updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await axios.patch(`${API_URL}/api/users/${userId}/ban`, { isBanned: !isBanned }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(isBanned ? "User unbanned!" : "User banned!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update ban status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleToggleEbookStatus = async (ebookId) => {
    try {
      await axios.patch(`${API_URL}/api/ebooks/${ebookId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Status updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteEbook = async (ebookId) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;
    try {
      await axios.delete(`${API_URL}/api/ebooks/${ebookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ebook deleted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete ebook");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiTrendingUp /> },
    { id: "users", label: "Users", icon: <FiUsers /> },
    { id: "ebooks", label: "Ebooks", icon: <FiBook /> },
    { id: "transactions", label: "Transactions", icon: <FiDollarSign /> },
  ];

  return (
    <main className="min-h-screen bg-navy pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <FiShield className="text-gold text-3xl" />
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">
                Admin <span className="text-gold">Dashboard</span>
              </h1>
              <p className="text-gray-400 mt-1">Manage your platform</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-navy-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", value: analytics?.totalUsers || 0, icon: <FiUsers />, color: "text-blue-400" },
                    { label: "Total Writers", value: analytics?.totalWriters || 0, icon: <FiUsers />, color: "text-purple-400" },
                    { label: "Ebooks Sold", value: analytics?.totalEbooks || 0, icon: <FiBook />, color: "text-gold" },
                    { label: "Total Revenue", value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`, icon: <FiDollarSign />, color: "text-green-400" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-navy-light border border-gold/10 rounded-xl p-5"
                    >
                      <div className={`${stat.color} text-2xl mb-2`}>{stat.icon}</div>
                      <div className="text-white text-2xl font-bold">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Genre Distribution */}
                <div className="bg-navy-light border border-gold/20 rounded-2xl p-6">
                  <h3 className="text-white font-serif font-bold text-xl mb-6">Ebooks by Genre</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {analytics?.genreData?.map((genre) => (
                      <div key={genre._id} className="text-center p-4 bg-navy rounded-xl border border-gold/10">
                        <div className="text-gold text-2xl font-bold">{genre.count}</div>
                        <div className="text-gray-400 text-sm mt-1">{genre._id}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-navy-light border border-gold/20 rounded-2xl p-6">
                  <h3 className="text-white font-serif font-bold text-xl mb-6">Recent Transactions</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((t) => (
                      <div key={t._id} className="flex items-center justify-between py-3 border-b border-gold/10">
                        <div>
                          <p className="text-white text-sm font-medium">{t.ebookTitle}</p>
                          <p className="text-gray-400 text-xs">{t.buyerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-bold">${t.amount}</p>
                          <p className="text-gray-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === "users" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Name</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Email</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Role</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4 text-white text-sm">{u.name}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={u.email === "admin@fable.com"}
                              className="bg-navy border border-gold/20 text-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none disabled:opacity-50"
                            >
                              <option value="user">User</option>
                              <option value="writer">Writer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              u.isBanned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                            }`}>
                              {u.isBanned ? "Banned" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBanUser(u._id, u.isBanned)}
                                disabled={u.email === "admin@fable.com"}
                                className="px-3 py-1 text-xs border border-gold/20 text-gray-400 hover:border-gold/40 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {u.isBanned ? "Unban" : "Ban"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                disabled={u.email === "admin@fable.com"}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ebooks Management */}
            {activeTab === "ebooks" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Title</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Writer</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Price</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Sales</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ebooks.map((ebook) => (
                        <tr key={ebook._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={ebook.coverImage} alt={ebook.title} className="w-10 h-12 object-cover rounded-lg" />
                              <span className="text-white text-sm font-medium">{ebook.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{ebook.writerName}</td>
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
                                onClick={() => handleToggleEbookStatus(ebook._id)}
                                className="p-2 text-gray-400 hover:text-gold transition-colors"
                              >
                                {ebook.status === "published" ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteEbook(ebook._id)}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions */}
            {activeTab === "transactions" && (
              <div className="bg-navy-light border border-gold/20 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Ebook</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Buyer</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Amount</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Date</th>
                        <th className="text-left text-gray-400 text-sm px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-400 py-10">No transactions yet.</td>
                        </tr>
                      ) : (
                        transactions.map((t) => (
                          <tr key={t._id} className="border-b border-gold/10 hover:bg-navy/50 transition-colors">
                            <td className="px-6 py-4 text-white text-sm">{t.ebookTitle}</td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{t.buyerEmail}</td>
                            <td className="px-6 py-4 text-gold font-bold">${t.amount}</td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}