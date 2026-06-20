import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return notFound();
  }

  const reportResult = await query<{
    id: string;
    userid: string;
    airesponse: unknown;
    createdat: string;
  }>('SELECT id, userid, airesponse, createdat FROM reports WHERE id = $1 LIMIT 1', [params.id]);

  const report = reportResult.rows[0];
  if (!report || report.userid !== session.user.id) {
    return notFound();
  }

  const aiResponse = report.airesponse as {
    executive_summary: string;
    advantages_3: string[];
    disadvantages_3: string[];
    risks_loopholes_2: string[];
    strategic_recommendations_5: string[];
    action_plan_30_days: string[];
    motivation_statement: string;
    health_score_0_100: number;
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-aura-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-sm border border-slate-200 bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-aura-gold">AURA Business Analysis Report</p>
              <h1 className="mt-4 text-3xl font-semibold">Executive business intelligence</h1>
            </div>
            <div className="rounded-sm bg-slate-50 p-4 text-sm text-slate-600">
              {formatDate(report.createdat)}
            </div>
          </div>
          <div className="mt-8 rounded-sm bg-aura-navy p-8 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Health score</p>
            <p className="mt-3 text-5xl font-semibold text-aura-gold">{aiResponse.health_score_0_100}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-aura-navy">Executive Summary</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{aiResponse.executive_summary}</p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-lg font-semibold text-aura-navy">Key Strengths</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {aiResponse.advantages_3.map((item) => (<li key={item}>• {item}</li>))}
              </ul>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-lg font-semibold text-aura-navy">Risks & Disadvantages</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[...aiResponse.disadvantages_3, ...aiResponse.risks_loopholes_2].map((item) => (<li key={item}>• {item}</li>))}
              </ul>
            </div>
          </section>

          <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
            <h3 className="text-lg font-semibold text-aura-navy">Strategic Recommendations</h3>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600 list-decimal pl-5">
              {aiResponse.strategic_recommendations_5.map((item) => (<li key={item}>{item}</li>))}
            </ol>
          </section>

          <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
            <h3 className="text-lg font-semibold text-aura-navy">30-Day Action Plan</h3>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600 list-decimal pl-5">
              {aiResponse.action_plan_30_days.map((item) => (<li key={item}>{item}</li>))}
            </ol>
          </section>

          <section className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
            <h3 className="text-lg font-semibold text-aura-navy">Motivation & Outlook</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{aiResponse.motivation_statement}</p>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-sm bg-aura-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Download PDF</button>
            <button className="rounded-sm border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-aura-navy transition hover:bg-slate-100">Export to PowerPoint</button>
            <button className="rounded-sm border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-aura-navy transition hover:bg-slate-100">Send to WhatsApp</button>
          </div>
        </div>
      </div>
    </main>
  );
}
