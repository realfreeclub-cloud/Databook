import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import PublicHeader from "@/components/PublicHeader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Digital Register",
  description: "Secure Digital Register for Laptop & PC Repair Centers",
};

export const viewport: Viewport = {
  themeColor: "#0a0d18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafd] text-foreground min-h-screen`}
        suppressHydrationWarning
      >
        <div className="min-h-screen md:flex md:flex-row">
          <Sidebar />
          <div className="flex-1 min-h-screen relative pb-24 md:pb-0 md:bg-muted/5 md:overflow-y-auto md:h-screen flex flex-col">
            <PublicHeader />
            <div className="flex-1 max-w-md mx-auto md:max-w-none md:p-6 lg:p-8">
              {children}
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
