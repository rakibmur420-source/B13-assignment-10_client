"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiBook, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="relative mb-8">
          <div className="text-[150px] font-serif font-bold text-gold/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiBook className="text-gold text-6xl" />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl transition-all duration-200 hover:scale-105"
        >
          <FiArrowLeft /> Go Back Home
        </Link>
      </motion.div>
    </main>
  );
}