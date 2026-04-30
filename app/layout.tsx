import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import { MapProvider } from "@/context/MapContext";
import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soteria",
  description: "Advanced Environmental Monitoring System",
  icons: {
    icon: "/logo_new.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" precedence="default" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <UIProvider>
          <MapProvider>
            <div className="flex min-h-screen">
              <SideNavBar />
              <div className="flex flex-col flex-1 lg:ml-sidebar-width w-full transition-all duration-300">
                <TopNavBar />
                <main className="pt-16 min-h-screen">{children}</main>
              </div>
            </div>
          </MapProvider>
        </UIProvider>
      </body>
    </html>
  );
}
