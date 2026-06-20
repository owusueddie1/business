'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiKeysSchema } from '@/lib/validation';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const onboard = searchParams?.get('onboard') === 'true';
  const [apiKeyGemini, setApiKeyGemini] = useState('');
  const [apiKeyGroq, setApiKeyGroq] = useState('');
  const [apiKeyAnthropic, setApiKeyAnthropic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onboard) {
      setMessage('Please add your Gemini and Groq API keys to begin.');
    }
  }, [onboard]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const parsed = apiKeysSchema.safeParse({ apiKeyGemini, apiKeyGroq, apiKeyAnthropic });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid keys');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);

    if (res.ok) {
      setMessage('API keys saved successfully.');
      return;
    }
    const body = await res.json();
    setError(body.error || 'Unable to save API keys');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl rounded-sm bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Manage your API keys, billing, and export preferences.</p>
        {message && <div className="mt-6 rounded-sm bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
        {error && <div className="mt-6 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <label className="block text-sm font-medium text-slate-700">
            Gemini API key
            <input
              value={apiKeyGemini}
              onChange={(event) => setApiKeyGemini(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Groq API key
            <input
              value={apiKeyGroq}
              onChange={(event) => setApiKeyGroq(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Anthropic API key (optional)
            <input
              value={apiKeyAnthropic}
              onChange={(event) => setApiKeyAnthropic(event.target.value)}
              className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none transition focus:border-aura-gold"
            />
          </label>
          <button
            type="submit"
            className="rounded-sm bg-aura-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save API keys'}
          </button>
        </form>
      </div>
    </main>
  );
}
