"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Типы для оплаты
type PaymentMethod = "cash" | "kaspi" | "halyk";

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Здесь должны быть реальные данные из твоего стейта (например, из контекста или пропсов)
    // Пока ставим тестовые, чтобы проверить работу базы
    const orderData = {
      from_address: "Центр, 5 мкр", 
      to_address: "Курык, порт",
      price: 1500,
      payment_method: paymentMethod, // Отправляем способ оплаты
      status: "pending",
      passenger_phone: "+7 707 000 00 00" // Тут должен быть ввод номера пассажира
    };

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData]);

      if (error) throw error;

      alert("Заказ успешно создан! Водитель скоро свяжется с вами.");
      // Здесь можно сделать редирект на страницу "Ожидание"
    } catch (error: any) {
      console.error("Ошибка:", error.message);
      alert("Ошибка при создании заказа. Проверьте интернет.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100">
      <h2 className="text-xl font-black uppercase italic mb-4 text-center">Оплата</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Выбор способа оплаты */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("cash")}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              paymentMethod === "cash" ? "border-yellow-500 bg-yellow-50" : "border-gray-100"
            }`}
          >
            <span className="text-2xl">💵</span>
            <span className="text-[10px] font-bold uppercase">Наличка</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("kaspi")}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              paymentMethod === "kaspi" ? "border-red-500 bg-red-50" : "border-gray-100"
            }`}
          >
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold">K</div>
            <span className="text-[10px] font-bold uppercase">Kaspi</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("halyk")}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              paymentMethod === "halyk" ? "border-green-600 bg-green-50" : "border-gray-100"
            }`}
          >
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-[10px] font-bold">H</div>
            <span className="text-[10px] font-bold uppercase">Halyk</span>
          </button>
        </div>

        {/* Кнопка заказа */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 ${
            loading ? "bg-gray-300" : "bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-200"
          }`}
        >
          {loading ? "Отправка..." : "Вызвать такси"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;