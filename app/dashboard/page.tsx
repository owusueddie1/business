import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';
import ClientDashboard from '@/components/dashboard/ClientDashboard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect('/login');
  }

  const userResult = await query<{ id: string; name: string }>(
    'SELECT id, name FROM users WHERE id = $1 LIMIT 1',
    [session.user.id]
  );
  const user = userResult.rows[0];

  if (!user) {
    redirect('/login');
  }

  const reportsResult = await query<{
    id: string;
    healthscore: number;
    createdat: string;
  }>('SELECT id, healthscore, createdat FROM reports WHERE userid = $1 ORDER BY createdat DESC LIMIT 4', [
    session.user.id,
  ]);

  const reports = reportsResult.rows ?? [];

  const reportsForClient = reports.map((r) => ({
    ...r,
    createdAt: new Date(r.createdat).toISOString(),
    healthScore: r.healthscore,
  }));

  return (
    <main className="min-h-screen bg-slate-50 text-aura-navy px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold">Corporate BI workspace</h1>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Welcome back, {user?.name ?? 'Executive'}.</p>
            <p>
              Latest analysis:{' '}
              {reports[0]?.createdAt ? new Date(reports[0].createdAt).toISOString().slice(0, 10) : 'No reports yet'}
            </p>
          </div>
        </header>

        <ClientDashboard userName={user?.name} reports={reportsForClient} />
      </div>
    </main>
  );
}
