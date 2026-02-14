"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

function NavBar() {
  const [user, setUser] = useState<any>(null);
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
    }
  );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in"); // Перенаправляем на страницу входа
  };

  return (
    <div className="flex justify-between p-3 px-10 border-b-[1px] shadow-sm bg-white items-center">
      <div className="flex gap-10 items-center">
        <div className="font-extrabold text-2xl text-yellow-500 cursor-pointer" onClick={() => router.push("/")}>
          KURUK DRIVE
        </div>
        
        <div className="hidden md:flex gap-6">
          <h2 className="hover:text-yellow-600 p-2 cursor-pointer transition-all font-medium">Home</h2>
          <h2 className="hover:text-yellow-600 p-2 cursor-pointer transition-all font-medium">History</h2>
          <h2 className="hover:text-yellow-600 p-2 cursor-pointer transition-all font-medium">Help</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block text-gray-600">{user.email}</span>
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Войти
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;