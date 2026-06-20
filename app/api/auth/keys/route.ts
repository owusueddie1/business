import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { apiKeysSchema } from '@/lib/validation';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET || '' });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = apiKeysSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    await query(
      'UPDATE users SET apikeygemini = $1, apikeygroq = $2, apikeyanthropic = $3, updatedat = NOW() WHERE id = $4',
      [parsed.data.apiKeyGemini, parsed.data.apiKeyGroq, parsed.data.apiKeyAnthropic, token.sub]
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
