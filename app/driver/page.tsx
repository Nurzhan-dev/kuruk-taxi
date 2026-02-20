"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DriverDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Загрузка данных при старте
  useEffect(() => {
    fetchOrders();
    fetchHistory();

    // Realtime подписка
    const channel = supabase
      .channel('realtime-orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Если кто-то принял заказ, убираем его из списка доступных
            if (payload.new.status !== 'pending') {
              setOrders((prev) => prev.filter(order => order.id !== payload.new.id));
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    setLoading(false);
  };

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("driver_id", user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    if (!error) setHistory(data);
  };

  const acceptOrder = async (orderId: string, phone: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("orders")
      .update({ 
        status: "accepted",
        driver_id: user.id
      })
      .eq("id", orderId);

    if (error) {
      alert("Ошибка: " + error.message);
    } else {
      // Обновляем списки локально
      setOrders(prev => prev.filter(order => order.id !== orderId));
      fetchHistory(); // Обновляем историю, чтобы новый заказ сразу появился там
      
      // Звоним
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen pb-20">
      <h1 className="text-2xl font-black uppercase italic mb-6 text-center">Заказы Kuruk Go</h1>
      
      {/* СПИСОК НОВЫХ ЗАКАЗОВ */}
      {loading ? (
        <div className="flex justify-center p-10 font-bold text-gray-400 animate-pulse">Ищем заказы...</div>
      ) : (
        <div className="grid gap-4 max-w-lg mx-auto mb-10">
          <h2 className="text-xs font-bold text-gray-400 uppercase ml-2">Доступные заказы</h2>
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-3xl shadow-lg border-l-[12px] border-yellow-400">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase self-start">
                    {order.car_type || "Транспорт"}
                  </span>
                  <div className="flex gap-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                      order.payment_method === 'cash' ? 'bg-green-100 text-green-700' : 
                      order.payment_method === 'kaspi' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.payment_method === 'cash' ? '💵 Наличка' : order.payment_method === 'kaspi' ? '🔴 Kaspi' : '🟢 Halyk'}
                    </span>
                  </div>
                </div>
                <span className="font-black text-2xl text-green-600 tracking-tighter">{order.price} ₸</span>
              </div>
              
              <div className="space-y-2 mb-6 text-sm">
                <p><span className="text-gray-400 font-bold text-[10px] uppercase">Откуда:</span> <b>{order.from_address}</b></p>
                <p><span className="text-gray-400 font-bold text-[10px] uppercase">Куда:</span> <b>{order.to_address}</b></p>
              </div>

              <button 
                onClick={() => acceptOrder(order.id, order.passenger_phone)}
                className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all"
              >
                Принять и Позвонить
              </button>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Нет новых заказов...</p>}
        </div>
      )}

      <hr className="my-8 border-gray-200" />

      {/* ПРИВАТНАЯ ИСТОРИЯ */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 ml-2">Мои принятые заказы (Приватно)</h2>
        <div className="grid gap-2">
          {history.map((item) => (
            <div key={item.id} className="bg-white/60 p-4 rounded-2xl border border-white flex justify-between items-center shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.car_type}</span>
                <span className="font-bold text-sm truncate max-w-[150px]">{item.to_address}</span>
                {/* Скрываем телефон для приватности */}
                <span className="text-[10px] text-blue-500 font-medium">Клиент: ***{item.passenger_phone?.slice(-4)}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{item.price} ₸</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">{item.payment_method}</p>
              </div>
            </div>
          ))}
          {history.length === 0 && <p className="text-center text-gray-400 text-xs italic">Вы еще не принимали заказы сегодня</p>}
        </div>
      </div>
    </div>
  );
}