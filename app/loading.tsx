export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl rounded-sm bg-white p-10 shadow-soft">
        <div className="h-4 w-48 animate-pulse rounded-sm bg-slate-200" />
        <div className="mt-6 space-y-4">
          <div className="h-4 w-full animate-pulse rounded-sm bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded-sm bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
