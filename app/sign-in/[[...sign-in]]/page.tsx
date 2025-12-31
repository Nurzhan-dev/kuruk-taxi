"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="logo" width={80} height={80} className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Вход в Kuruk Drive</h1>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
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
            placeholder="Пароль"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-yellow-500 text-white p-3 rounded-xl font-bold hover:bg-yellow-600 transition-all">
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Нет аккаунта? <Link href="/sign-up" className="text-yellow-600 font-bold">Создать</Link>
        </p>
      </div>
    </div>
  );
}