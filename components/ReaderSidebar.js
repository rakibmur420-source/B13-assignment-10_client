"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiBook, FiBookmark, FiUser, FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "/dashboard/reader", label: "Dashboard", icon: <FiGrid /> },
  { href: "/dashboard/reader/purchased", label: "Purchased Books", icon: <FiBook /> },
  { href: "/dashboard/reader/bookmarks", label: "Bookmarks", icon: <FiBookmark /> },
  { href: "/dashboard/reader/profile", label: "Profile", icon: <FiUser /> },
];

export default function ReaderSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 mt-12 p-2 bg-navy-light border border-gold/20 rounded-xl text-gold"
      >
        {open ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />
      )}

      <aside className={`
        fixed md:static top-0 left-0 h-full z-40
        w-56 bg-navy-light border-r border-gold/10 pt-20 flex-shrink-0
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <nav className="px-3 py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                path === l.href ? "bg-gold/15 text-gold" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              <span className="text-base">{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
