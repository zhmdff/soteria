"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function SideNavBar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUI();

  const navItems = [
    { name: "Ana Səhifə", href: "/", icon: "dashboard", id: "home" },
    { name: "Fermer Portalı", href: "/farmers", icon: "agriculture", id: "farmers" },
    { name: "Xəzər Dənizi", href: "/caspian", icon: "waves", id: "caspian" },
    { name: "Hava Keyfiyyəti", href: "/air", icon: "air", id: "air" },
    { name: "İqlim Trendləri", href: "/climate", icon: "thermostat", id: "climate" },
    { name: "Təbii Hadisələr", href: "/events", icon: "emergency_home", id: "events" },
    { name: "Enerji Potensialı", href: "/energy", icon: "bolt", id: "energy" },
    { name: "Canlı Peyk", href: "/map", icon: "satellite_alt", id: "map" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[2050] lg:hidden backdrop-blur-sm transition-opacity" onClick={closeSidebar} />}

      <nav className={`fixed left-0 top-0 h-screen w-sidebar-width border-r border-outline-variant bg-surface-container-lowest z-[2100] flex flex-col py-6 px-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="mb-8 pr-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group" onClick={closeSidebar}>
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden shrink-0">
              <Image src="/logo_new.png" alt="Soteria Logo" width={48} height={48} className="object-contain p-1" />
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Soteria</h1>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={closeSidebar} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href) ? "bg-surface-container text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container"}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Bottom footer/info if needed */}
        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-on-surface-variant/60">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>v0.1.0 Beta</span>
          </div>
        </div>
      </nav>
    </>
  );
}
