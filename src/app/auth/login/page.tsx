import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 sm:px-6 py-16">
      <h1 className="font-display glow-text text-2xl text-[#f4f0ff] mb-1">Вход</h1>
      <p className="shimmer-text-soft text-sm mb-6">
        Нет аккаунта?{" "}
        <Link href="/auth/register" className="text-[#9382ff] hover:underline">
          Зарегистрироваться
        </Link>
      </p>
      <AuthForm action={signIn} mode="login" />
    </div>
  );
}
