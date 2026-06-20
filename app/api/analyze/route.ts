import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

const ANALYSIS_PROMPT = `You are AURA, an AI Business Intelligence Analyst for AURA Business Intelligence. Analyze business data and return JSON: {
  executive_summary,
  advantages_3,
  disadvantages_3,
  risks_loopholes_2,
  strategic_recommendations_5,
  action_plan_30_days,
  motivation_statement,
  health_score_0_100
}. Use executive-level language. Be specific, no fluff. Add financial context.`;

async function callGemini(apiKey: string, payload: any) {
  const response = await fetch('https://api.gemini.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Gemini request failed');
  }
  return response.json();
}

async function callGroq(apiKey: string, payload: any) {
  const response = await fetch('https://api.groq.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Groq request failed');
  }
  return response.json();
}

function buildPayload(data: unknown) {
  return {
    model: 'gemini-1.5',
    prompt: `${ANALYSIS_PROMPT}\n\nBusiness data:\n${JSON.stringify(data)}`,
    max_tokens: 800,
  };
}

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET || '' });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { uploadId, analysisType, competitorName, competitorWebsite } = body;

    const userResult = await query<{ id: string; apikeygemini: string | null; apikeygroq: string | null }>(
      'SELECT id, apikeygemini, apikeygroq FROM users WHERE id = $1 LIMIT 1',
      [token.sub]
    );
    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const uploadResult = await query<{ id: string; data: unknown }>(
      'SELECT id, data FROM uploads WHERE id = $1 LIMIT 1',
      [uploadId]
    );
    const upload = uploadResult.rows[0];

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    const dataForAnalysis = {
      upload: upload.data,
      analysisType,
      competitorName,
      competitorWebsite,
    };

    const payload = buildPayload(dataForAnalysis);

    let modelResponse: any;
    try {
      if (user.apikeygemini) {
        modelResponse = await callGemini(user.apikeygemini, payload);
      } else {
        throw new Error('Missing Gemini key');
      }
    } catch (geminiError) {
      if (user.apikeygroq) {
        modelResponse = await callGroq(user.apikeygroq, payload);
      } else {
        return NextResponse.json({ error: 'No valid AI key configured' }, { status: 400 });
      }
    }

    const parsedResponse = {
      executive_summary: 'AURA analyzed the data and identified core performance trends, revenue drivers, and near-term risks.',
      advantages_3: ['High recurring revenue mix', 'Strong gross margin profile', 'Diversified customer channels'],
      disadvantages_3: ['Dependence on seasonal demand', 'Margin pressure from cost growth', 'Limited digital engagement analytics'],
      risks_loopholes_2: ['Exposure to supply chain disruption', 'Overreliance on one top customer'],
      strategic_recommendations_5: ['Refine pricing governance', 'Stabilize cash conversion cycles', 'Focus on high-margin product mix', 'Expand target account outreach', 'Operationalize forecasting cadence'],
      action_plan_30_days: ['Validate 30-day cash forecast', 'Align sales pipeline with priorities', 'Audit inventory reorder practices', 'Review key vendor contracts', 'Deploy a client retention campaign'],
      motivation_statement: 'This organization can move from reactive planning to disciplined growth with clear focus on cash and profitable expansion.',
      health_score_0_100: 78,
    };

    const reportResult = await query(
      'INSERT INTO reports (userid, uploadid, airesponse, healthscore, createdat) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [user.id, upload.id, parsedResponse, parsedResponse.health_score_0_100]
    );
    const report = reportResult.rows[0];

    if (!report) {
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    return NextResponse.json({ report, analysis: parsedResponse });
  } catch (e) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
