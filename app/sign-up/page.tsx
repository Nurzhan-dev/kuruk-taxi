"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DriverSignUp() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fakeEmail = `${phone.replace(/\D/g, "")}@kuryk.taxi`;

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
        options: { data: { full_name: name, role: 'driver' } }
      });

      if (signUpError) throw signUpError;
      router.push("/"); 
    } catch (err: any) {
      setError("Ошибка регистрации. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-400 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl">
        <h1 className="text-2xl font-black italic uppercase text-center mb-6">Регистрация водителя</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="text" placeholder="Имя" className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none" onChange={(e) => setName(e.target.value)} required />
          <input type="tel" placeholder="77071234567" className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none" onChange={(e) => setPhone(e.target.value)} required />
          <input type="password" placeholder="Пароль" className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none" onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">
            {loading ? "Загрузка..." : "Создать аккаунт"}
          </button>
        </form>
        {/* Вот зачем нам нужен Link: */}
        <p className="mt-6 text-center text-sm font-bold text-gray-600">
          Уже есть аккаунт? <Link href="/sign-in" className="underline text-black">Войти</Link>
        </p>
      </div>
    </div>
  );
}