import "./globals.css";
import { Outfit } from "next/font/google";
import NavBar from "@/components/NavBar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Kuruk Drive",
  description: "Taxi Booking App",
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