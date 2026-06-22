"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCheckCircle, FiBook } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const ebookId = searchParams.get("ebook_id");

    if (!sessionId || !ebookId || !user) {
      router.push("/");
      return;
    }

    verifyPayment(sessionId, ebookId);
  }, [user]);

  const verifyPayment = async (sessionId, ebookId) => {
    try {
      await axios.post(
        `${API_URL}/api/transactions/verify-payment`,
        { sessionId, ebookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error("Payment verification failed");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying your payment...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="bg-navy-light border border-gold/20 rounded-2xl p-10">
          <FiCheckCircle className="text-green-400 text-6xl mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-white mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-400 mb-8">
            Your ebook has been added to your library. Enjoy reading!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/user"
              className="py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiBook /> Go to My Library
            </Link>
            <Link
              href="/ebooks"
              className="py-3 border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl transition-all duration-200"
            >
              Browse More Ebooks
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}