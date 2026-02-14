"use client";
import React, { useContext } from "react";
import AutocompleteAddress from "./AutocompleteAddress";
import Cars from "./Cars";
// import Cards from "./Cards"; <--- Убираем это
import { selectedCarAmountContext } from "@/context/SelectedCarAmount";
import CheckoutForm from "../payment/CheckoutForm"; // Проверь правильность пути к файлу

function Booking() {
  const { carAmount } = useContext(selectedCarAmountContext);

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Заказ такси</h2>
      <div className="border-[1px] p-5 rounded-md bg-white shadow-sm">
        
        {/* Поиск адресов (уже работает) */}
        <AutocompleteAddress />

        {/* Выбор машины (уже работает) */}
        <Cars />

        {/* Разделительная линия для красоты */}
        <hr className="my-5 border-gray-100" />

        {/* Наша новая форма оплаты и кнопка вызова.
           Она появится только если выбрана машина (есть цена).
        */}
        {carAmount ? (
          <CheckoutForm />
        ) : (
          <p className="text-center text-gray-400 text-sm mt-4">
            Выберите тип автомобиля, чтобы продолжить
          </p>
        )}

      </div>
    </div>
  );
}

export default Booking;