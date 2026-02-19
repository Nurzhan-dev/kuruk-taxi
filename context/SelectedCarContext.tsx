"use client";
import { createContext, useState, ReactNode } from "react";
export const SelectedCarContext = createContext<any>(null);

export const SelectedCarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCar, setSelectedCar] = useState<any>(null);

  return (
    <SelectedCarContext.Provider value={{ selectedCar, setSelectedCar }}>
      {children}
    </SelectedCarContext.Provider>
  );
};