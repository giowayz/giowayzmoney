import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/app/auth/actions";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-4 sm:px-6 py-16">
      <h1 className="font-display glow-text text-2xl text-[#f4f0ff] mb-1">Регистрация</h1>
      <p className="shimmer-text-soft text-sm mb-4">
        Уже есть аккаунт?{" "}
        <Link href="/auth/login" className="text-[#9382ff] hover:underline">
          Войти
        </Link>
      </p>
      <p className="mb-6 text-sm leading-relaxed shimmer-text-soft">
        Личный кабинет нужен, чтобы прикреплять скриншоты подтверждения, видеть статус каждой
        заявки и точную дату окончания холда — без переписки в чатах.
      </p>
      <AuthForm action={signUp} mode="register" />
      <p className="mt-4 text-xs shimmer-text-soft">
        Регистрируясь, вы соглашаетесь с{" "}
        <Link href="/privacy" className="underline hover:text-[#a8a6b7]">
          политикой конфиденциальности
        </Link>
        .
      </p>
    </div>
  );
}
