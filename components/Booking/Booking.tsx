"use client";
import React, { useContext } from "react";
import AutocompleteAddress from "./AutocompleteAddress";
import Cars from "./Cars";
import { SelectedCarContext } from "@/context/SelectedCarContext";
import CheckoutForm from "../payment/CheckoutForm";

function Booking() {
  const { selectedCar } = useContext(SelectedCarContext);

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Ваш универсальный агрегатор перевозок</h2>
      <div className="border-[1px] p-5 rounded-md bg-white shadow-sm">
        <AutocompleteAddress />
        <Cars />
        <hr className="my-5 border-gray-100" />
        {selectedCar?.amount ? (
          <CheckoutForm />
        ) : (
          <p className="text-center text-gray-400 text-sm mt-4">
            Выберите тип транспорта, чтобы продолжить
          </p>
        )}

      </div>
    </div>
  );
}

export default Booking;