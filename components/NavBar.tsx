"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

function NavBar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Получаем текущего пользователя при загрузке
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 2. Слушаем изменения авторизации
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
        
        // Если вошли — можно сразу перекинуть в кабинет
        if (event === 'SIGNED_IN') {
          router.push("/driver");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex justify-between p-3 px-10 border-b-[1px] shadow-sm bg-white items-center">
      <div className="flex gap-10 items-center">
        <div 
          className="font-extrabold text-2xl text-yellow-500 cursor-pointer uppercase italic" 
          onClick={() => router.push("/")}
        >
          KURUK DRIVE
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          <h2 className="hover:text-yellow-600 p-2 cursor-pointer transition-all font-medium" onClick={() => router.push("/")}>Главная</h2>
          
          {/* КНОПКА ВОДИТЕЛЯ: появляется только если user вошел */}
          {user && (
            <h2 
              className="text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-xl cursor-pointer transition-all font-bold text-sm shadow-md" 
              onClick={() => router.push("/driver")}
            >
              Кабинет Водителя
            </h2>
          )}
          
          <h2 className="hover:text-yellow-600 p-2 cursor-pointer transition-all font-medium">Помощь</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden lg:block text-gray-500 font-medium">{user.email}</span>
            <button 
              onClick={handleSignOut}
              className="bg-gray-100 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Выйти
            </button>
          </div>
        ) : (
          <button 
            onClick={() => router.push("/sign-in")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-yellow-100 transition-all"
          >
            Войти
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;