"use client";

import Image from "next/image";
import { useUI } from "@/context/UIContext";

export default function TopNavBar() {
  const { toggleSidebar } = useUI();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-sidebar-width h-16 border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md z-30 flex justify-between items-center px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={24} height={24} className="lg:hidden" />
          <span className="font-label-sm text-outline uppercase tracking-widest text-[9px] md:text-[10px]">Canlı Telemetriya Stansiyası</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Potentially add search or notifications here */}
        <div className="hidden md:flex items-center gap-2 text-[10px] text-primary bg-primary/10 px-3 py-1.5 rounded-full font-bold">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          SİSTEM AKTİVDİR
        </div>
      </div>
    </header>
  );
}
