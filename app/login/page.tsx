'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { loginSchema } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);

    if (result?.ok) {
      router.push('/dashboard');
      return;
    }

    setError('Invalid email or password');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-md space-y-6 rounded-sm bg-white p-10 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">Sign in</p>
          <h1 className="mt-4 text-3xl font-semibold">Access AURA</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-sm bg-aura-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-slate-600">
          New to AURA? <Link href="/register" className="font-semibold text-aura-navy">Create an account</Link>.
        </p>
      </div>
    </main>
  );
}
