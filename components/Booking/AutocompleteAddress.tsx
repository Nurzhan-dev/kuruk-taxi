"use client";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import React, { useContext, useEffect, useState } from "react";

function AutocompleteAddress() {
  const [source, setSource] = useState<any>("");
  const [destination, setDestination] = useState<any>("");
  const [addressList, setAddressList] = useState<any>([]);
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const [isDestLoading, setIsDestLoading] = useState(false);

  const { setSourceCordinates } = useContext(SourceCordiContext);
  const { setDestinationCordinates } = useContext(DestinationCordiContext);

  // 1. Координаты границ Курыка (Bounding Box)
  // Формат: minLon, minLat, maxLon, maxLat
  const KURYK_BBOX = "51.60,43.15,51.72,43.21";

  const getAddressList = async (query: string) => {
    if (!query || query.length < 2) return;

    try {
      // 2. Добавляем "Kuryk" в запрос и bbox в параметры
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${query} Kuryk&limit=5&bbox=${KURYK_BBOX}`
      );
      const result = await res.json();
      
      // Дополнительная фильтрация: оставляем только те результаты, 
      // где в названии города/села есть Курык или область Мангистауская
      const filtered = result.features.filter((item: any) => {
        const props = item.properties;
        return (
          props.city?.toLowerCase().includes("курык") || 
          props.name?.toLowerCase().includes("курык") ||
          props.state?.toLowerCase().includes("мангистау")
        );
      });

      setAddressList(filtered);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isSourceLoading && source.length >= 2) getAddressList(source);
    }, 500);
    return () => clearTimeout(delay);
  }, [source]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (isDestLoading && destination.length >= 2) getAddressList(destination);
    }, 500);
    return () => clearTimeout(delay);
  }, [destination]);

  const onAddressClick = (item: any, type: "source" | "dest") => {
    const coords = {
      lat: item.geometry.coordinates[1],
      lng: item.geometry.coordinates[0],
    };

    // Очищаем название от лишних слов типа "Kazakhstan" для красоты в инпуте
    const addressLabel = item.properties.name || item.properties.street || "Курык";

    if (type === "source") {
      setSource(addressLabel);
      setSourceCordinates(coords);
      setIsSourceLoading(false);
    } else {
      setDestination(addressLabel);
      setDestinationCordinates(coords);
      setIsDestLoading(false);
    }
    setAddressList([]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Поле ОТКУДА */}
      <div className="relative">
        <label className="text-gray-400 text-[13px]">Откуда (Курык...)</label>
        <input
          type="text"
          placeholder="Введите улицу..."
          className="bg-white p-2 border-[1px] w-full text-black rounded-md outline-none focus:border-yellow-300 text-[14px]"
          value={source}
          onChange={(e) => { setSource(e.target.value); setIsSourceLoading(true); setIsDestLoading(false); }}
        />
        {addressList.length > 0 && isSourceLoading && (
          <ul className="absolute shadow-lg w-full bg-white z-50 rounded-b-md max-h-60 overflow-y-auto border border-t-0">
            {addressList.map((item: any, index: number) => (
              <li key={index} className="p-3 hover:bg-gray-100 cursor-pointer text-black border-b text-[13px] flex flex-col"
                onClick={() => onAddressClick(item, "source")}>
                <span className="font-bold">{item.properties.name}</span>
                <span className="text-[11px] text-gray-500">
                  {item.properties.street || ""} {item.properties.district || "Курык"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поле КУДА */}
      <div className="relative">
        <label className="text-gray-400 text-[13px]">Куда</label>
        <input
          type="text"
          placeholder="Куда едем?"
          className="bg-white p-2 border-[1px] w-full text-black rounded-md outline-none focus:border-yellow-300 text-[14px]"
          value={destination}
          onChange={(e) => { setDestination(e.target.value); setIsDestLoading(true); setIsSourceLoading(false); }}
        />
        {addressList.length > 0 && isDestLoading && (
          <ul className="absolute shadow-lg w-full bg-white z-50 rounded-b-md max-h-60 overflow-y-auto border border-t-0">
            {addressList.map((item: any, index: number) => (
              <li key={index} className="p-3 hover:bg-gray-100 cursor-pointer text-black border-b text-[13px] flex flex-col"
                onClick={() => onAddressClick(item, "dest")}>
                <span className="font-bold">{item.properties.name}</span>
                <span className="text-[11px] text-gray-500">
                  {item.properties.street || ""} {item.properties.district || "Курык"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AutocompleteAddress;