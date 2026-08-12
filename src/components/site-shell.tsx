"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Plans" },
  { href: "/quote", label: "Get a Quote" },
  { href: "/admin", label: "CRM Login" },
];

export function SiteShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.16),_transparent_30%),linear-gradient(180deg,#07111f_0%,#0b1728_28%,#f8fafc_28%,#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              SecureLife Insurance
            </p>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 font-semibold whitespace-nowrap transition ${
                    active
                      ? "border-cyan-300 bg-cyan-400 text-slate-950"
                      : "border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              {subtitle}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
