import Link from 'next/link';

export default function Nav({ transparent }: { transparent?: boolean }) {
  return (
    <nav className={`${transparent ? 'text-white' : 'text-aura-navy'} flex flex-wrap items-center justify-between gap-6 text-sm font-medium`}>
      <Link href="/" className="text-lg font-semibold tracking-[0.18em] uppercase">AURA</Link>
      <div className="flex items-center gap-6">
        <Link href="/demo">Demo</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/login" className={`${transparent ? 'text-white/80 hover:text-white' : 'text-aura-navy'}`}>Sign in</Link>
      </div>
    </nav>
  );
}
