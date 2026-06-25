"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [ebookTitle, setEbookTitle] = useState("");

  const sessionId = searchParams.get("session_id");
  const ebookId = searchParams.get("ebook_id");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!sessionId || !ebookId || !token) return;
    verifyPayment();
  }, [sessionId, ebookId, token]);

  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/transactions/verify-payment`,
        { sessionId, ebookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEbookTitle(res.data?.transaction?.ebookTitle || "your ebook");
      setStatus("success");
    } catch (err) {
      // If already purchased, still show success
      if (err.response?.data?.message === "Already purchased") {
        setStatus("success");
      } else {
        setStatus("error");
      }
    }
  };

  if (status === "verifying") {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white text-lg font-medium">Verifying your payment...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-white text-2xl font-serif font-bold mb-3">Payment Verification Failed</h1>
          <p className="text-gray-400 mb-8">We couldn't verify your payment. If you were charged, please contact support.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/ebooks" className="px-6 py-3 bg-gold text-navy font-bold rounded-xl">Browse Books</Link>
            <Link href="/dashboard" className="px-6 py-3 border border-gold/30 text-gold rounded-xl">My Dashboard</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success animation */}
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500/40">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="text-white text-3xl font-serif font-bold mb-3">Payment Successful!</h1>
        <p className="text-gray-400 mb-2">
          {ebookTitle ? (
            <>You now have access to <span className="text-gold font-medium">"{ebookTitle}"</span></>
          ) : (
            "Your purchase was completed successfully."
          )}
        </p>
        <p className="text-gray-500 text-sm mb-10">
          The ebook has been added to your library.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/dashboard/reader/purchased")}
            className="px-6 py-3 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl transition-all"
          >
            Go to My Library
          </button>
          <Link href="/ebooks" className="px-6 py-3 border border-gold/30 hover:border-gold text-gold rounded-xl transition-all">
            Browse More Books
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
