"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiBook, FiBookmark, FiUser } from "react-icons/fi";

const links = [
  { href: "/dashboard/reader", label: "Dashboard", icon: <FiGrid /> },
  { href: "/dashboard/reader/purchased", label: "Purchased Books", icon: <FiBook /> },
  { href: "/dashboard/reader/bookmarks", label: "Bookmarked Books", icon: <FiBookmark /> },
  { href: "/dashboard/reader/profile", label: "Profile", icon: <FiUser /> },
];

export default function ReaderSidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 min-h-screen bg-navy-light border-r border-gold/10 pt-20 flex-shrink-0">
      <nav className="px-3 py-4 space-y-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              path === l.href ? "bg-gold/15 text-gold" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}>
            <span className="text-base">{l.icon}</span>{l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
