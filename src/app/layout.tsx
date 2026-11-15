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
  title: "National Computer Allahabad | Web Development, Custom Software & Complete IT Solutions",
  description: "National Computer Allahabad is a premier IT studio & service hub in Prayagraj offering custom web development, enterprise software engineering, public-use repair & inventory SaaS tools, and chip-level hardware diagnostics.",
  keywords: [
    "National Computer Allahabad",
    "Web Development Prayagraj",
    "Custom Software Development Allahabad",
    "Repair Shop SaaS Software",
    "Computer Repair Prayagraj",
    "Refurhub",
    "Laptop Motherboard Repair Allahabad"
  ],
  metadataBase: new URL("https://www.nationalcomputerallahabad.com"),
  alternates: {
    canonical: "https://www.nationalcomputerallahabad.com",
  },
  openGraph: {
    title: "National Computer Allahabad | Web Development, Custom Software & Complete IT Solutions",
    description: "Web development, custom software engineering, public-use repair SaaS tools, and chip-level hardware repair in Prayagraj.",
    url: "https://www.nationalcomputerallahabad.com",
    siteName: "National Computer Allahabad",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
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
            <div className="flex-1 w-full">
              {children}
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
