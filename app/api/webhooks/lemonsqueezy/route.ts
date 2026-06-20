import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const userId = payload.data?.userId as string;
    const plan = payload.data?.plan as string;
    const status = payload.data?.status as string;
    const currentPeriodEnd = new Date(payload.data?.currentPeriodEnd || Date.now()).toISOString();

    if (!userId || !plan) {
      return NextResponse.json({ error: 'Missing webhook data' }, { status: 400 });
    }

    await query(
      `INSERT INTO subscriptions (userid, plan, status, currentperiodend, createdat, updatedat)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (userid)
       DO UPDATE SET plan = EXCLUDED.plan, status = EXCLUDED.status, currentperiodend = EXCLUDED.currentperiodend, updatedat = NOW()`,
      [userId, plan, status, currentPeriodEnd]
    );

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
