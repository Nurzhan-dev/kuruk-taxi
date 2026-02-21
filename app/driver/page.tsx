"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DriverDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Состояния для выбора авто и звука
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Используем Ref, чтобы Realtime-слушатель всегда видел актуальные настройки без перезагрузки
  const vehicleRef = useRef<string | null>(null);
  const soundRef = useRef(false);

  useEffect(() => {
    vehicleRef.current = selectedVehicle;
    soundRef.current = isSoundEnabled;
  }, [selectedVehicle, isSoundEnabled]);

  // Функция озвучки
  const speakOrder = (order: any) => {
    if (soundRef.current && order.car_type === vehicleRef.current && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Прерываем старую речь
      const text = `Новый заказ. ${order.from_address}. Цена ${order.price} тенге.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchHistory();

    const channel = supabase
      .channel('realtime-orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev]);
            // Озвучиваем, если подходит
            speakOrder(payload.new);
          } else if (payload.eventType === 'UPDATE') {
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
    const { data, error } = await supabase.from("orders").select("*").eq("driver_id", user.id).eq("status", "accepted").order("created_at", { ascending: false });
    if (!error) setHistory(data);
  };

  const acceptOrder = async (orderId: string, phone: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("orders").update({ status: "accepted", driver_id: user.id }).eq("id", orderId);
    if (!error) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      fetchHistory();
      window.location.href = `tel:${phone}`;
    }
  };

  // ФУНКЦИЯ ОТМЕНЫ ЗАКАЗА
  const cancelOrder = async (orderId: string) => {
    const confirmCancel = confirm("Вы уверены, что хотите отменить заказ? Он снова станет доступен другим водителям.");
    
    if (confirmCancel) {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "pending",
          driver_id: null 
        })
        .eq("id", orderId);

      if (error) {
        alert("Ошибка при отмене: " + error.message);
      } else {
        // 1. Убираем заказ из локальной истории
        setHistory(prev => prev.filter(item => item.id !== orderId));
        
        // 2. Добавляем его обратно в список доступных заказов (визуально)
        // Хотя Realtime и так его подтянет, это сделает интерфейс мгновенным
        fetchOrders(); 
      }
    }
  };

  // --- ЭКРАН 1: ВЫБОР ТРАНСПОРТА ---
  if (!selectedVehicle) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-black uppercase italic mb-8 text-center leading-tight">
          На каком транспорте <br /> вы сегодня <span className="text-yellow-500">работаете?</span>
        </h1>
        <div className="grid gap-4 w-full max-w-sm">
       {["Легковой", "Газель", "Водовоз", "Спецтехника"].map((v) => (
       <button
       key={v}
       onClick={() => setSelectedVehicle(v)}
       className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-4 group"
      > 
      <span className="text-4xl group-active:scale-90 transition-transform">
        {v === "Легковой" && "🚕"}
        {v === "Газель" && "🚚"}
        {v === "Водовоз" && "💧"}
        {v === "Спецтехника" && "🚜"}
      </span>
      <div className="text-left">
        <span className="font-black uppercase text-lg block leading-none">{v}</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Выбрать</span>
      </div>
      </button>
      ))}
      </div>
      </div>
    );
  }

  // Фильтруем заказы для UI
  const filteredOrders = orders.filter(o => o.car_type === selectedVehicle);

  // --- ЭКРАН 2: РАБОЧИЙ КАБИНЕТ ---
  return (
    <div className="p-4 bg-gray-100 min-h-screen pb-20">
      {/* Шапка с настройками */}
      <div className="max-w-lg mx-auto mb-6 bg-white p-4 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Режим работы</p>
          <h2 className="font-black uppercase italic text-lg">{selectedVehicle}</h2>
          <button onClick={() => setSelectedVehicle(null)} className="text-[9px] font-bold text-blue-500 uppercase underline">Сменить авто</button>
        </div>
        <button 
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase transition-all ${
            isSoundEnabled ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isSoundEnabled ? '🔊 Голос ВКЛ' : '🔇 Без звука'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10 font-bold text-gray-400 animate-pulse uppercase text-xs">Синхронизация...</div>
      ) : (
        <div className="grid gap-4 max-w-lg mx-auto mb-10">
          <h2 className="text-xs font-bold text-gray-400 uppercase ml-2">Доступно для вас ({filteredOrders.length})</h2>
          
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-3xl shadow-lg border-l-[12px] border-yellow-400">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                  order.payment_method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {order.payment_method === 'cash' ? '💵 Наличка' : '🔴 Kaspi'}
                </span>
                <span className="font-black text-2xl text-green-600 tracking-tighter">{order.price} ₸</span>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-sm leading-tight"><span className="text-gray-400 font-bold text-[10px] uppercase block">Откуда:</span> <b>{order.from_address}</b></p>
                <p className="text-sm leading-tight"><span className="text-gray-400 font-bold text-[10px] uppercase block">Куда:</span> <b>{order.to_address}</b></p>
              </div>

              <button 
                onClick={() => acceptOrder(order.id, order.passenger_phone)}
                className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase shadow-md active:scale-95 transition-all"
              >
                Принять и Позвонить
              </button>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
              <p className="text-gray-400 text-xs font-bold uppercase italic">Для {selectedVehicle} пока <br/> нет новых заказов</p>
            </div>
          )}
        </div>
      )}

      {/* История */}
      <div className="max-w-lg mx-auto opacity-80">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 ml-2">Ваша история</h2>
        <div className="grid gap-2">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-300 uppercase">{item.car_type}</span>
                <span className="font-bold text-sm truncate max-w-[140px]">{item.to_address}</span>
              </div>
              <p className="font-black text-green-600 text-sm">{item.price} ₸</p>
              <button 
            onClick={() => cancelOrder(item.id)}
            className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-xl active:scale-90 transition-all uppercase"
          >
            Отменить
          </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}