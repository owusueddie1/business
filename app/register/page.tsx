'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { registerSchema } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || 'Unable to register');
      setLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);

    if (signInResult?.ok) {
      router.push('/settings?onboard=true');
      return;
    }

    setError('Registration succeeded, but sign-in failed. Please sign in manually.');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-md space-y-6 rounded-sm bg-white p-10 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">Create account</p>
          <h1 className="mt-4 text-3xl font-semibold">Start with AURA</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-aura-navy">Sign in</Link>.
        </p>
      </div>
    </main>
  );
}
