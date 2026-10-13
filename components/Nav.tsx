"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Dashboard"],
  ["/marketplace", "Idea Marketplace"],
  ["/validate", "Idea Validator"],
  ["/roadmap", "Roadmap"],
  ["/match", "Matchmaking"],
  ["/fund", "Funding & Escrow"],
  ["/accountability", "Accountability"],
  ["/settings", "Settings"],
];

export function Nav() {
  const path = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-card p-4">
      <div className="mb-6 font-mono text-lg font-bold">
        YOUNG<span className="text-crimson">FINNERS</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-sm transition-colors duration-100 ease-linear ${
              path === href ? "bg-crimson text-white" : "text-slate hover:text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
