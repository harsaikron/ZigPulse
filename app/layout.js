import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ZigPulse — ComfortDelGro Intelligence Portal",
  description: "Real-time taxi demand intelligence for ComfortDelGro Singapore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
