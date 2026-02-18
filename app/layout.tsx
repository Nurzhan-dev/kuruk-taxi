import "./globals.css";
import { Outfit } from "next/font/google";
import NavBar from "@/components/NavBar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Kuryk Go — Перевозки твоего поселка",
  description: "Единый агрегатор такси, грузоперевозок и спецтехники в Курыке",
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
        {children}
      </body>
    </html>
  );
}