"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false); // Для мгновенного отклика
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
        if (event === 'SIGNED_IN') {
          router.push("/driver");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // УСКОРЕНИЕ: Предварительная загрузка страницы кабинета
  useEffect(() => {
    if (user) {
      router.prefetch('/driver');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const goToDriver = () => {
    setIsNavigating(true); // Показываем "Загрузка...", чтобы пользователь видел реакцию на клик
    router.push("/driver");
  };

  return (
    <div className="flex justify-between p-3 px-4 md:px-10 border-b-[1px] shadow-sm bg-white items-center">
      <div className="flex gap-4 md:gap-10 items-center">
        <div 
          className="font-extrabold text-xl md:text-2xl text-yellow-500 cursor-pointer uppercase italic" 
          onClick={() => router.push("/")}
        >
          <span className="text-black">KURYK</span>
          <span className="text-yellow-500 ml-1">GO</span>
        </div>
        
        {/* КНОПКА ВОДИТЕЛЯ: Теперь видна и на мобильных (убрали hidden) */}
        {user && (
          <button 
            disabled={isNavigating}
            className="text-white bg-black hover:bg-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-xl cursor-pointer transition-all font-bold text-[10px] md:text-sm shadow-md active:scale-95" 
            onClick={goToDriver}
          >
            {isNavigating ? "Ждите..." : "Кабинет Водителя"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Скрываем email на совсем маленьких экранах для экономии места */}
            <span className="text-xs hidden sm:block text-gray-500 font-medium">{user.email?.split('@')[0]}</span>
            <button 
              onClick={handleSignOut}
              className="bg-gray-100 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Выход
            </button>
          </div>
        ) : (
          <button 
            onClick={() => router.push("/sign-in")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all"
          >
            Войти
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;