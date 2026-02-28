import Link from "next/link";

type Props = {
  searchParams?: {
    error?: string;
  };
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage({ searchParams }: Props) {
  const hasError = Boolean(searchParams?.error);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <section className="w-full rounded-2xl glass glow p-6">
        <h1 className="text-2xl font-bold">Вход в админку</h1>
        <p className="mt-2 text-sm text-slate-300">Авторизация по логину и паролю администратора.</p>

        <form action="/api/auth/login" method="post" className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm">Логин</label>
            <input name="login" required autoComplete="username" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Пароль</label>
            <input name="password" type="password" required autoComplete="current-password" />
          </div>
          <button type="submit" className="primary-btn w-full font-semibold">
            Войти
          </button>
        </form>

        {hasError ? <p className="mt-3 text-sm text-rose-300">Неверные учетные данные или превышен лимит попыток.</p> : null}

        <Link href="/" className="mt-5 inline-block text-sm text-cyan-200 hover:text-cyan-100">
          ← На сайт
        </Link>
      </section>
    </main>
  );
}
