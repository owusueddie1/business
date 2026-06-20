'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl rounded-sm bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">An unexpected error occurred while loading this page.</p>
        <button onClick={() => reset()} className="mt-8 rounded-sm bg-aura-navy px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900">
          Try again
        </button>
      </div>
    </main>
  );
}
