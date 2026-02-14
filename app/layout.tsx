"use client";
import "./globals.css";
import { Outfit } from "next/font/google";
import { useState } from "react";

// Импортируем все контексты
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { SourceTextContext } from "@/context/SourceTextContext";
import { DestTextContext } from "@/context/DestTextContext";
import { selectedCarAmountContext } from "@/context/SelectedCarAmount";

import NavBar from "@/components/NavBar";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Инициализируем состояния для контекстов
  const [sourceCordinates, setSourceCordinates] = useState<any>(null);
  const [destinationCordinates, setDestinationCordinates] = useState<any>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [destText, setDestText] = useState<string>("");
  const [carAmount, setCarAmount] = useState<any>(null);

  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Оборачиваем всё приложение в провайдеры */}
        <SourceCordiContext.Provider value={{ sourceCordinates, setSourceCordinates }}>
          <DestinationCordiContext.Provider value={{ destinationCordinates, setDestinationCordinates }}>
            <SourceTextContext.Provider value={{ sourceText, setSourceText }}>
              <DestTextContext.Provider value={{ destText, setDestText }}>
                <selectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
                  
                  <NavBar />
                  <main>{children}</main>
                  
                </selectedCarAmountContext.Provider>
              </DestTextContext.Provider>
            </SourceTextContext.Provider>
          </DestinationCordiContext.Provider>
        </SourceCordiContext.Provider>
      </body>
    </html>
  );
}