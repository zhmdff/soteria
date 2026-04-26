import Image from "next/image";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 right-0 left-sidebar-width h-16 border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md z-30 flex justify-between items-center px-8 w-[calc(100%-sidebar-width)]">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={24} height={24} className="md:hidden" />
        <span className="font-label-sm text-outline uppercase tracking-widest text-[10px]">Canlı Telemetriya Stansiyası</span>
      </div>
      <div className="flex items-center gap-4"></div>
    </header>
  );
}
