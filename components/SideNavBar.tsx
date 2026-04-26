"use client";

import Link from "next/link";
import Image from "next/image";

interface SideNavBarProps {
  activeTab: "home" | "caspian" | "air" | "climate";
}

export default function SideNavBar({ activeTab }: SideNavBarProps) {
  return (
    <nav className="fixed left-0 top-0 h-screen w-sidebar-width border-r border-outline-variant bg-surface-container-lowest z-40 flex flex-col py-6 px-4 overflow-y-auto">
      {/* Brand */}
      <div className="mb-8 pr-4">
        <Link href="/" className="flex items-center gap-3 mb-2 group">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden shrink-0">
            <Image src="/logo.svg" alt="Xəzər Monitor Logo" width={48} height={48} className="object-contain p-1" />
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Xəzər Monitor</h1>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 space-y-2">
        <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "home" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-sm text-label-sm">Ana Səhifə</span>
        </Link>

        <Link href="/caspian" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "caspian" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
          <span className="material-symbols-outlined">waves</span>
          <span className="font-label-sm text-label-sm">Xəzər Dənizi</span>
        </Link>

        <Link href="/air" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "air" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
          <span className="material-symbols-outlined">air</span>
          <span className="font-label-sm text-label-sm">Hava Keyfiyyəti</span>
        </Link>

        <Link href="/climate" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "climate" ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
          <span className="material-symbols-outlined">thermostat</span>
          <span className="font-label-sm text-label-sm">İqlim Trendləri</span>
        </Link>
      </div>
    </nav>
  );
}
