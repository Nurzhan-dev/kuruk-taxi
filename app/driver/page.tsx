"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DriverDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('realtime-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((prev) => [payload.new, ...prev]);
      })
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

  const acceptOrder = async (orderId: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("orders")
    .update({ 
      status: "accepted",
      driver_id: user?.id
    })
    .eq("id", orderId);

  if (error) {
    console.error(error);
    alert("Ошибка: " + error.message);
  } else {
    setOrders(orders.filter(order => order.id !== orderId));
    alert("Заказ принят! Позвоните клиенту");
  }
};

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-black uppercase italic mb-6">Заказы Kuruk Go</h1>
      
      {loading ? <p>Загрузка...</p> : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-md border-l-8 border-yellow-400">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {order.car_type || 'Легковой'}
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded">НОВЫЙ</span>
                <span className="font-bold text-lg text-green-600">{order.price} ₸</span>
              </div>
              
              <div className="space-y-1 mb-4">
                <p className="text-sm"><span className="text-gray-400">ОТКУДА:</span> <b>{order.from_address}</b></p>
                <p className="text-sm"><span className="text-gray-400">КУДА:</span> <b>{order.to_address}</b></p>
                <p className="text-sm"><span className="text-gray-400">ТЕЛ:</span> <a href={`tel:${order.passenger_phone}`} className="text-blue-600 underline">{order.passenger_phone}</a></p>
              </div>

              <button 
                onClick={() => acceptOrder(order.id)}
                className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase hover:bg-gray-800 transition-all"
              >
                Принять заказ
              </button>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-gray-500">Заказов пока нет...</p>}
        </div>
      )}
    </div>
  );
}