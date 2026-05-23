"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/creator", label: "Creator" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-14 bg-black/80 backdrop-blur border-b border-white/10 flex items-center px-4 md:px-6 sticky top-0 z-30">
      <Link href="/discover" className="flex items-center gap-2 mr-8">
        <span className="text-lg">🌍</span>
        <span className="font-bold text-white text-sm tracking-wide">Sound Globe</span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              pathname.startsWith(link.href)
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
