"use client";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import { SelectedCarContext } from "@/context/SelectedCarContext";
import CarsList from "@/data/CarsList";
import Image from "next/image";
import React, { useContext } from "react";

function Cars() {
  // Достаем данные из нашего нового контекста
  const { selectedCar, setSelectedCar } = useContext(SelectedCarContext);
  const { directionData } = useContext(DirectionDataContext);

  const getCost = (charges: any) => {
    if (directionData?.routes?.[0]?.distance) {
      return (
        charges *
        directionData.routes[0].distance *
        0.000621371192
      ).toFixed(0);
    }
    return charges; 
  };
  
  return (
    <div className="mt-5">
      <h2 className="font-semibold text-[16px] mb-4 text-gray-700">Выберите транспорт</h2>
      
      <div className="grid grid-cols-2 gap-4 max-w-[500px] mx-auto">
        {CarsList.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              const cost = getCost(item.charges);
              console.log("Выбрана машина:", item.name, "Цена:", cost); // Для проверки в консоли
              
              // Проверяем, что функция существует, и записываем ОБЪЕКТ
              if (setSelectedCar) {
                setSelectedCar({
                  name: item.name,
                  amount: cost       
                });
              }
            }}  
            className={`p-4 border-[1px] rounded-2xl cursor-pointer transition-all 
            ${selectedCar?.name === item.name 
             ? "border-black border-[2px] bg-yellow-500 shadow-md" 
             : "border-gray-100 bg-yellow-200"}`}
          > 
            <div className="h-[70px] flex items-center justify-center mb-3">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={60}
                className="object-contain w-full h-full"
              />
            </div>
      
            <div className="w-full">
              <h2 className="text-[12px] font-bold text-gray-500 uppercase">
                {item.name}
              </h2>
              <h2 className="text-[20px] font-black text-slate-900 my-1">
                {getCost(item.charges)} <span className="text-[14px] font-bold text-yellow-600">₸</span>
              </h2>
              <p className="text-[10px] text-gray-600 leading-snug mt-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;