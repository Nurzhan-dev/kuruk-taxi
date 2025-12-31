import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NavBar from "@/components/NavBar";
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kuruk Drive",
  description: "Taxi Booking App with Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <NavBar />
        {/* Здесь можно добавить Supabase Auth Context, если он у вас создан */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}