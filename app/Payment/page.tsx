"use client";

import CheckoutForm from "@/components/payment/CheckoutForm";
import React from "react";

function Payment() {
  // Нам больше не нужны Stripe Promise и Options. 
  // Мы просто отображаем форму.
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="w-full max-w-md">
        <CheckoutForm />
      </div>
    </div>
  );
}

export default Payment;