"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AuthActionState } from "@/app/auth/actions";

interface AuthFormProps {
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  mode: "login" | "register";
}

export default function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(action, {
    error: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="block text-sm shimmer-text-soft mb-1" htmlFor="fullName">
            Имя
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="liquid-glass w-full rounded-[5px] px-4 py-2.5 text-[#f4f0ff] outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
          />
        </div>
      )}

      <div>
        <label className="block text-sm shimmer-text-soft mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="liquid-glass w-full rounded-[5px] px-4 py-2.5 text-[#f4f0ff] outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
        />
      </div>

      <div>
        <label className="block text-sm shimmer-text-soft mb-1" htmlFor="password">
          Пароль
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            className="liquid-glass w-full rounded-[5px] px-4 py-2.5 pr-11 text-[#f4f0ff] outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9b7ff] hover:text-[#9382ff] transition"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[5px] bg-[#5046e4] px-6 py-3 font-medium text-white hover:bg-[#10093a] transition disabled:opacity-50"
      >
        {pending ? "Подождите…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
}
