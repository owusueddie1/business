import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const existingUser = await query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [parsed.data.email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(parsed.data.password);
    await query(
      'INSERT INTO users (name, email, password, createdat, updatedat) VALUES ($1, $2, $3, NOW(), NOW())',
      [parsed.data.name, parsed.data.email, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
