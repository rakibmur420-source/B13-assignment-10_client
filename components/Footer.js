"use client";

import Link from "next/link";
import { FiBook, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-navy dark:bg-navy border-t border-gold/20 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FiBook className="text-gold text-2xl" />
              <span className="text-gold font-serif text-2xl font-bold">Fable</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover, read, and share original ebooks from talented writers around the world.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors duration-200">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors duration-200">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors duration-200">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors duration-200">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-4 font-serif">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/ebooks", label: "Browse Ebooks" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/register", label: "Become a Writer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gold font-semibold mb-4 font-serif">Company</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gold font-semibold mb-4 font-serif">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest ebooks and updates.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-navy-light border border-gold/20 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gold/50"
              />
              <button className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-lg text-sm transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fable. All rights reserved. Made with ❤️ for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}