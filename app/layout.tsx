import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLAYZONE Dashboard | Official Cricket Gear Admin",
  description: "Official Admin & Operations Control Center for PLAYZONE Cricket Equipment Store Bangladesh.",
  icons: {
    icon: "/images/playzone-logo-transparent-white.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 antialiased selection:bg-[#84cc16] selection:text-black">
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
