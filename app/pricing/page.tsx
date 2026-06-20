import Link from 'next/link';

const tiers = [
  {
    name: 'FREE',
    price: '$0',
    description: 'Core dashboards, upload limit, watermark on exports.',
    features: ['5 uploads per month', 'Basic AI insights', 'Watermarked reports'],
  },
  {
    name: 'PRO',
    price: '$29',
    description: 'Unlimited uploads, exports without watermark, faster analysis.',
    features: ['Unlimited uploads', 'PDF/PPT export', 'No watermark', 'WhatsApp delivery'],
  },
  {
    name: 'BUSINESS',
    price: '$99',
    description: 'Team seats, API access, custom branding, priority support.',
    features: ['3 team seats', 'API access', 'Custom branding', 'Priority support'],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">Pricing</p>
          <h1 className="mt-4 text-4xl font-semibold">Simple plans for modern business intelligence.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">Choose the plan that matches your data velocity, export requirements, and team size.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-500">{tier.name}</div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-5xl font-semibold text-aura-navy">{tier.price}</span>
                <span className="text-sm text-slate-500">/month</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{tier.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-aura-navy" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-aura-gold px-4 py-3 text-sm font-semibold text-aura-navy transition hover:bg-[#b7912b]">
                Start {tier.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
