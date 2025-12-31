"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert("Успех! Проверьте почту для подтверждения.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Регистрация</h1>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Придумайте пароль"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition-all">
            Зарегистрироваться
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Уже есть аккаунт? <Link href="/sign-in" className="text-yellow-600 font-bold">Войти</Link>
        </p>
      </div>
    </div>
  );
}