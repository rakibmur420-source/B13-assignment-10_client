"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FiAlertTriangle className="text-gold text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold text-white mb-4">
          Something Went Wrong
        </h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gold/20 hover:border-gold/40 text-gray-300 rounded-xl transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}