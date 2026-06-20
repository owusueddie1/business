import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/dashboard', '/settings', '/report', '/api/upload', '/api/analyze', '/api/report', '/api/auth/keys'];

// Simple in-memory rate limiting store (consider Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(identifier);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const ip = request.ip || 'unknown';

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const apiLimit = pathname.startsWith('/api/auth/') ? 5 : 50;
    if (isRateLimited(`api-${ip}`, apiLimit, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  const requiresAuth = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));
  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || '' });
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths.map((path) => path + '/:path*'), '/api/:path*'],
};

