"use client";
import React, { useState, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
// Импортируем контексты, которые мы создали и прописали в page.tsx
import { SourceTextContext } from "@/context/SourceTextContext";
import { DestTextContext } from "@/context/DestTextContext";
import { selectedCarAmountContext } from "@/context/SelectedCarAmount";

type PaymentMethod = "cash" | "kaspi" | "halyk";

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [phone, setPhone] = useState("");

  // Достаем живые данные из контекста
  const { sourceText } = useContext(SourceTextContext);
  const { destText } = useContext(DestTextContext);
  const { carAmount } = useContext(selectedCarAmountContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!sourceText || !destText) {
      alert("Сначала выберите адреса на карте!");
      return;
    }

    if (!phone || phone.length < 10) {
      alert("Введите корректный номер телефона!");
      return;
    }

    setLoading(true);

    const orderData = {
      from_address: sourceText, 
      to_address: destText,
      price: carAmount || 0,
      payment_method: paymentMethod,
      status: "pending",
      passenger_phone: phone 
    };

    try {
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      alert("Заказ принят! Ждите звонка водителя.");
    } catch (error: any) {
      console.error("Ошибка Supabase:", error.message);
      alert("Ошибка при отправке: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] shadow-xl border border-gray-100">
      <h2 className="text-xl font-black uppercase italic mb-4 text-center text-black">Оплата</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Поле ввода телефона */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Ваш телефон</label>
          <input 
            type="tel"
            placeholder="+7 707 000 0000"
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-black outline-none focus:border-yellow-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

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
            <span className="text-[10px] font-bold uppercase text-black">Наличка</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("kaspi")}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              paymentMethod === "kaspi" ? "border-red-500 bg-red-50" : "border-gray-100"
            }`}
          >
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold">K</div>
            <span className="text-[10px] font-bold uppercase text-black">Kaspi</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("halyk")}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              paymentMethod === "halyk" ? "border-green-600 bg-green-50" : "border-gray-100"
            }`}
          >
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-[10px] font-bold">H</div>
            <span className="text-[10px] font-bold uppercase text-black">Halyk</span>
          </button>
        </div>

        {/* Кнопка заказа */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 ${
            loading ? "bg-gray-300" : "bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-200 text-black"
          }`}
        >
          {loading ? "Отправка..." : "Вызвать такси"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;