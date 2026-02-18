import { DirectionDataContext } from "@/context/DirectionDataContext";
import { selectedCarAmountContext } from "@/context/SelectedCarAmount";
import CarsList from "@/data/CarsList";
import Image from "next/image";
import React, { useContext, useState } from "react";

function Cars() {
  const [selectedCar, setSelectedCar] = useState<any>();
  const { directionData } = useContext(DirectionDataContext);
  const { setCarAmount } = useContext(selectedCarAmountContext);

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
      
      {/* Сетка 2 колонки на всех экранах (grid-cols-2) */}
      <div className="grid grid-cols-2 gap-4 max-w-[500px] mx-auto">
        {CarsList.map((item, index) => (
          <div
            key={index}
            className={`p-4 border-[1px] rounded-2xl hover:border-yellow-400 cursor-pointer transition-all shadow-md
              flex flex-col items-center text-center bg-white
              ${index == selectedCar ? "border-black border-[2px] bg-yellow-500" : "border-gray-100 bg-yellow-200"}`}
            onClick={() => {
              setSelectedCar(index);
              setCarAmount(getCost(item.charges));
            }}
          >
            {/* Увеличенная область изображения */}
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
              <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                {item.name}
              </h2>
              
              {/* Крупная цена */}
              <h2 className="text-[20px] font-black text-slate-900 my-1">
                {getCost(item.charges)} <span className="text-[14px] font-bold text-yellow-600">₸</span>
              </h2>
          
              {/* Увеличенное описание (теперь 3 строки текста поместится) */}
              <p className="text-[10px] text-black-500 leading-snug mt-2 min-h-[30px]">
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