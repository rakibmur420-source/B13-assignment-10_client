"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ReaderDashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    router.push("/dashboard/reader/profile");
  }, [user, loading]);
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </main>
  );
}
