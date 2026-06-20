import { NextResponse } from 'next/server';

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: validateDatabaseConnection(),
      nextauth: validateNextAuthConfig(),
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    },
  };

  return NextResponse.json(healthStatus, { status: 200 });
}

function validateDatabaseConnection(): string {
  const hasUrl = !!process.env.DATABASE_URL;
  return hasUrl ? 'connected' : 'disconnected';
}

function validateNextAuthConfig(): string {
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  const hasUrl = !!process.env.NEXTAUTH_URL;
  return hasSecret && hasUrl ? 'configured' : 'misconfigured';
}
