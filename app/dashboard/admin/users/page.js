"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") { router.push("/"); return; }
    fetchUsers();
  }, [user, loading]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (e) { toast.error("Failed to load users"); }
    finally { setFetching(false); }
  };

  const handleBan = async (id, isBanned) => {
    try {
      await axios.patch(`${API_URL}/api/users/${id}/ban`, { isBanned: !isBanned }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(isBanned ? "User unbanned!" : "User banned!");
      fetchUsers();
    } catch (e) { toast.error("Failed"); }
  };

  const nonAdmins = users.filter(u => u.role !== "admin");
  const active = nonAdmins.filter(u => !u.isBanned).length;
  const banned = nonAdmins.filter(u => u.isBanned).length;

  const roleBadge = { user: "bg-blue-500/20 text-blue-300", writer: "bg-purple-500/20 text-purple-300", admin: "bg-gold/20 text-gold" };

  return (
    <div className="flex bg-navy min-h-screen">
      <AdminSidebar />
      <main className="flex-1 pt-20 px-8 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage platform users and their access.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Users", value: nonAdmins.length },
            { label: "Active Users", value: active },
            { label: "Banned Users", value: banned },
          ].map(s => (
            <div key={s.label} className="bg-navy-light border border-gold/10 rounded-xl p-5">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-navy-light border border-gold/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gold/10">
            <h2 className="text-white font-semibold">All Users</h2>
          </div>
          {fetching ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">User</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Role</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Status</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Joined</th>
                    <th className="text-left text-gray-400 text-xs px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nonAdmins.map((u) => (
                    <tr key={u._id} className="border-b border-gold/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                            {u.photoURL ? <img src={u.photoURL} className="w-9 h-9 rounded-full object-cover" /> :
                              <span className="text-gold text-sm font-bold">{u.name?.charAt(0)}</span>}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{u.name}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleBadge[u.role] || ""}`}>
                          {u.role === "user" ? "Reader" : u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isBanned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {u.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleBan(u._id, u.isBanned)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            u.isBanned
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
