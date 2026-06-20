'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ReportSummary {
  id: string;
  healthScore: number;
  createdAt: string;
}

interface ClientDashboardProps {
  userName?: string | null;
  reports: ReportSummary[];
}

const performanceData = [
  { month: 'Jan', revenue: 280, profit: 76 },
  { month: 'Feb', revenue: 320, profit: 92 },
  { month: 'Mar', revenue: 350, profit: 110 },
  { month: 'Apr', revenue: 390, profit: 125 },
  { month: 'May', revenue: 420, profit: 138 },
  { month: 'Jun', revenue: 455, profit: 150 },
];

const forecastData = [
  { month: 'Jul', forecast: 470 },
  { month: 'Aug', forecast: 485 },
  { month: 'Sep', forecast: 510 },
  { month: 'Oct', forecast: 540 },
  { month: 'Nov', forecast: 560 },
  { month: 'Dec', forecast: 590 },
];

const revenueByProduct = [
  { name: 'Services', value: 45 },
  { name: 'Software', value: 30 },
  { name: 'Consulting', value: 25 },
];

export default function ClientDashboard({ userName, reports }: ClientDashboardProps) {
  const [status, setStatus] = useState('Ready for analysis');
  const [uploadMessage, setUploadMessage] = useState('Upload a CSV, XLSX, or PDF to begin.');
  const [analysisMessage, setAnalysisMessage] = useState('Select an upload and initiate AURA analysis.');
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [competitorName, setCompetitorName] = useState('');
  const [competitorWebsite, setCompetitorWebsite] = useState('');
  const [loanScore, setLoanScore] = useState<number | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loanReadinessRecommendation = useMemo(() => {
    if (loanScore === null) return 'Complete the loan readiness assessment to see your score.';
    if (loanScore >= 80) return 'Strong finance position. Prepare documents for fast approval.';
    if (loanScore >= 60) return 'Solid foundation with some improvement required for lenders.';
    return 'Focus on cash flow and missing documents to strengthen your application.';
  }, [loanScore]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setSelectedUploadId(result.upload.id);
      setUploadMessage(`Uploaded ${result.upload.filename}. Ready for analysis.`);
    } else {
      setUploadMessage(result.error || 'Upload failed.');
    }
  };

  const runAnalysis = async () => {
    if (!selectedUploadId) {
      setAnalysisMessage('Please upload a file before generating analysis.');
      return;
    }
    setLoading(true);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: selectedUploadId }),
    });
    const result = await response.json();
    setLoading(false);
    if (response.ok) {
      setAnalysisMessage('Analysis saved. Review your executive report once complete.');
    } else {
      setAnalysisMessage(result.error || 'Analysis failed.');
    }
  };

  const runCompetitorAnalysis = async () => {
    if (!selectedUploadId || !competitorName || !competitorWebsite) {
      setAnalysisMessage('Provide competitor name and website to compare performance.');
      return;
    }
    setLoading(true);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: selectedUploadId, analysisType: 'competitor', competitorName, competitorWebsite }),
    });
    const result = await response.json();
    setLoading(false);
    if (response.ok) {
      setAnalysisMessage('Competitor intelligence delivered to your report history.');
    } else {
      setAnalysisMessage(result.error || 'Competitor analysis failed.');
    }
  };

  const generatePromo = async () => {
    if (!selectedUploadId) {
      setAnalysisMessage('Upload your data before generating campaign copy.');
      return;
    }
    setLoading(true);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: selectedUploadId, analysisType: 'promo' }),
    });
    const result = await response.json();
    setLoading(false);
    if (response.ok) {
      setAnalysisMessage('Promo copy delivered. Review report history for details.');
    } else {
      setAnalysisMessage(result.error || 'Promo generation failed.');
    }
  };

  const runLoanAssessment = () => {
    const score = Math.min(100, Math.max(35, Math.round(Math.random() * 55 + 45)));
    setLoanScore(score);
    setDocuments(['Financial statements', 'Cash flow forecast', 'Customer contracts', 'Collateral schedule']);
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          <div className="rounded-sm bg-aura-navy p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Revenue</p>
            <p className="mt-4 text-4xl font-semibold text-aura-gold">$4.2M</p>
          </div>
          <div className="rounded-sm bg-aura-navy p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Profit Margin</p>
            <p className="mt-4 text-4xl font-semibold text-aura-gold">22.4%</p>
          </div>
          <div className="rounded-sm bg-aura-navy p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Cash Flow</p>
            <p className="mt-4 text-4xl font-semibold text-aura-gold">$820K</p>
          </div>
          <div className="rounded-sm bg-aura-navy p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">AURA Health Score</p>
            <p className="mt-4 text-4xl font-semibold text-aura-gold">{reports[0]?.healthScore ?? 78}</p>
          </div>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Welcome back{userName ? `, ${userName}` : ''}. Review today&apos;s operational signals and keep your executive strategy aligned with cash, risk, and growth.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="rounded-sm bg-slate-50 p-4 text-sm text-slate-700">Latest report: {reports[0]?.createdAt.slice(0, 10) ?? 'No results yet'}</div>
            <div className="rounded-sm bg-slate-50 p-4 text-sm text-slate-700">Uploaded files: {reports.length > 0 ? reports.length : '0'}</div>
            <div className="rounded-sm bg-slate-50 p-4 text-sm text-slate-700">Status: {status}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Monthly Performance</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0A2540" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">12-Month Forecast</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="forecast" stroke="#D4AF37" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Revenue by Product</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByProduct} dataKey="value" nameKey="name" innerRadius={48} outerRadius={84}>
                  {revenueByProduct.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? '#0A2540' : index === 1 ? '#64748b' : '#D4AF37'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Upload zone</p>
              <p className="mt-2 text-sm text-slate-600">Drag your spreadsheet, CSV, or PDF to update AURA with fresh business data.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-sm bg-aura-gold px-4 py-3 text-sm font-semibold text-aura-navy transition hover:bg-[#b7912b]">
              Select file
              <input type="file" accept=".csv,.xlsx,.xls,.pdf" className="sr-only" onChange={handleUpload} />
            </label>
          </div>
          <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">{uploadMessage}</div>
          <button
            type="button"
            onClick={runAnalysis}
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-aura-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Generate AURA Analysis'}
          </button>
          <p className="mt-4 text-sm text-slate-600">{analysisMessage}</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Competitor Intelligence</p>
            <input
              value={competitorName}
              onChange={(event) => setCompetitorName(event.target.value)}
              placeholder="Competitor name"
              className="mt-4 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none"
            />
            <input
              value={competitorWebsite}
              onChange={(event) => setCompetitorWebsite(event.target.value)}
              placeholder="Competitor website"
              className="mt-4 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-aura-navy outline-none"
            />
            <button
              type="button"
              onClick={runCompetitorAnalysis}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-aura-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              disabled={loading}
            >
              Run competitor analysis
            </button>
          </div>
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Promo generator</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">Create a WhatsApp / Facebook copy and schedule for your weakest product line.</p>
            <button
              type="button"
              onClick={generatePromo}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-aura-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              disabled={loading}
            >
              Generate campaign copy
            </button>
          </div>
          <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Loan readiness</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">Evaluate your organization for bank financing and track required documentation.</p>
            <button
              type="button"
              onClick={runLoanAssessment}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-aura-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Assess loan readiness
            </button>
            {loanScore !== null && (
              <div className="mt-4 rounded-sm bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-aura-navy">Score: {loanScore}/100</p>
                <p className="mt-2">{loanReadinessRecommendation}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Missing documents</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {documents.map((doc) => (<li key={doc}>{doc}</li>))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
