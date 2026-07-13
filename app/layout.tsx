import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CAB SAFARS — Vendor & Driver Transport Marketplace",
  description:
    "Connect verified vendors and drivers. Post trips, find reliable drivers, discover smart route matches. India's premium transport network.",
  keywords: ["cab safars", "transport", "driver", "vendor", "marketplace", "trip matching", "India logistics"],
  openGraph: {
    title: "CAB SAFARS — Transport Marketplace",
    description: "Connect vendors and drivers. Post trips. Earn more.",
    type: "website",
    siteName: "Cab Safars",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAB SAFARS",
    description: "India's premium vendor-driver transport marketplace",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cab Safars",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5A623",
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full antialiased bg-[#0D1117] text-[#F0F6FC]">
        {children}
      </body>
    </html>
  );
}
