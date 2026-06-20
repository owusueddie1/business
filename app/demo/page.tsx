import Link from 'next/link';
import { Database, ShieldCheck, Zap } from 'lucide-react';

const metrics = [
  { label: 'Revenue', value: '$3.4M' },
  { label: 'Net Margin', value: '18.6%' },
  { label: 'Cash Flow', value: '$780K' },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-aura-navy">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 rounded-sm bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">Demo version</p>
              <h1 className="mt-4 text-4xl font-semibold text-aura-navy">AURA Business Intelligence Demo</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Load sample business data and explore the full dashboard experience with a secure demonstration of premium reporting.
              </p>
            </div>
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              DEMO VERSION - Create Account for Full Access
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-sm border border-slate-200 bg-aura-navy p-6 text-white shadow-soft">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold text-aura-gold">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Monthly performance</p>
              <div className="mt-6 h-48 rounded-sm bg-slate-100" />
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Forecast</p>
              <div className="mt-6 h-48 rounded-sm bg-slate-100" />
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Product mix</p>
              <div className="mt-6 h-48 rounded-sm bg-slate-100" />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-sm border border-slate-200 bg-slate-50 p-6 text-slate-600">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sample upload</p>
            <p className="text-sm leading-7">
              Included sample analysis shows how AURA converts CSV business reports into insights, a 30-day action plan, and executive recommendations.
            </p>
            <Link href="/register" className="inline-flex items-center justify-center rounded-sm bg-aura-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Create account for full access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
