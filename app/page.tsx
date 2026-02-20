"use client";

import Booking from "@/components/Booking/Booking";
import { SourceTextContext } from "@/context/SourceTextContext";
import { DestTextContext } from "@/context/DestTextContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { UserLocationContext } from "@/context/UserLocationContext";
import { SelectedCarContext } from "@/context/SelectedCarContext";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [userLocation, setUserLocation] = useState<any>({ lat: 43.175, lng: 51.650 });
  const [soruceCordinates, setSourceCordinates] = useState<any>(null);
  const [destinationCordinates, setDestinationCordinates] = useState<any>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [destText, setDestText] = useState<string>("");
  const [directionData, setDirectionData] = useState<any>([]);
  const [selectedCar, setSelectedCar] = useState<any>();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  getUser();
  }, []);

  useEffect(() => {
  if (user?.publicMetadata?.role === 'driver') {
    router.push('/driver');
  }
  }, [user]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
        <SourceCordiContext.Provider value={{ soruceCordinates, setSourceCordinates }}>
          <DestinationCordiContext.Provider value={{ destinationCordinates, setDestinationCordinates }}>
            <SourceTextContext.Provider value={{ sourceText, setSourceText }}>
              <DestTextContext.Provider value={{ destText, setDestText }}>
                <DirectionDataContext.Provider value={{ directionData, setDirectionData }}>
                <div className="flex justify-center p-4 md:p-10">
                  <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <div className="p-4">
                       <h1 className="text-2xl font-black text-center mb-6 uppercase italic">Заказать транспорт</h1>
                       <Booking />
                    </div>
                  </div>
                </div>
                </DirectionDataContext.Provider>
              </DestTextContext.Provider>
            </SourceTextContext.Provider>
          </DestinationCordiContext.Provider>
        </SourceCordiContext.Provider>
      </UserLocationContext.Provider>
    </div>
  );
}