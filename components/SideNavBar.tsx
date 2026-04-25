import Link from "next/link";

interface SideNavBarProps {
  activeTab: "home" | "caspian" | "air" | "climate";
}

export default function SideNavBar({ activeTab }: SideNavBarProps) {
  return (
    <nav className="fixed left-0 top-0 h-screen w-sidebar-width border-r border-outline-variant bg-surface-container-lowest z-40 flex flex-col py-6 px-4">
      {/* Brand */}
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              waves
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Xəzər Monitor
          </h1>
        </div>
        <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
          Scientific Hub
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "home"
              ? "bg-surface-container text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-sm text-label-sm">Ana Səhifə</span>
        </Link>

        <Link
          href="/caspian"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "caspian"
              ? "bg-surface-container text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined">waves</span>
          <span className="font-label-sm text-label-sm">Xəzər Dənizi</span>
        </Link>

        <Link
          href="/air"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "air"
              ? "bg-surface-container text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined">air</span>
          <span className="font-label-sm text-label-sm">Hava Keyfiyyəti</span>
        </Link>

        <Link
          href="/climate"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "climate"
              ? "bg-surface-container text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined">thermostat</span>
          <span className="font-label-sm text-label-sm">İqlim Trendləri</span>
        </Link>
      </div>

      {/* Footer Tab */}
      <div className="pt-4 border-t border-outline-variant mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg cursor-pointer">
          <span className="material-symbols-outlined">sensors</span>
          <span className="font-label-sm text-label-sm">Connection Status</span>
          <div className="w-2 h-2 rounded-full bg-primary-container ml-auto"></div>
        </div>
      </div>
    </nav>
  );
}
