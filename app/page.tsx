"use client";

import Booking from "@/components/Booking/Booking";
import { SourceTextContext } from "@/context/SourceTextContext";
import { DestTextContext } from "@/context/DestTextContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { UserLocationContext } from "@/context/UserLocationContext";
import { selectedCarAmountContext } from "@/context/SelectedCarAmount";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Динамически загружаем новую карту
const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] md:h-screen w-full bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500 font-medium">Загрузка карты Курыка...</p>
    </div>
  ),
});

export default function Home() {
  // 1. Сразу ставим центр Курыка, чтобы карта не была пустой
  const [userLocation, setUserLocation] = useState<any>({ lat: 43.175, lng: 51.650 });
  const [soruceCordinates, setSourceCordinates] = useState<any>(null);
  const [destinationCordinates, setDestinationCordinates] = useState<any>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [destText, setDestText] = useState<string>("");
  const [directionData, setDirectionData] = useState<any>([]);
  const [carAmount, setCarAmount] = useState<any>();

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.log("Геолокация отклонена, используем Курык по умолчанию");
        }
      );
    }
  };

  return (
    <div className="">
      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
        <SourceCordiContext.Provider value={{ soruceCordinates, setSourceCordinates }}>
          <DestinationCordiContext.Provider value={{ destinationCordinates, setDestinationCordinates }}>
            <SourceTextContext.Provider value={{ sourceText, setSourceText }}>
              <DestTextContext.Provider value={{ destText, setDestText }}>
                <DirectionDataContext.Provider value={{ directionData, setDirectionData }}>
                  <selectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
                
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-4 overflow-y-auto h-screen">
                    <Booking />
                  </div>
                  <div className="col-span-2 order-first md:order-last border-l-[1px]">
                    {/* ТЕПЕРЬ КАРТА ВЫЗЫВАЕТСЯ ЗДЕСЬ */}
                    <LeafletMap />
                  </div>
                </div>

               </selectedCarAmountContext.Provider>
              </DirectionDataContext.Provider>
             </DestTextContext.Provider>
            </SourceTextContext.Provider>
          </DestinationCordiContext.Provider>
        </SourceCordiContext.Provider>
      </UserLocationContext.Provider>
    </div>
  );
}