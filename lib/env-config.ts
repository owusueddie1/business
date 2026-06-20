/**
 * Environment configuration validation
 * Runs at build time to ensure all required variables are set
 */

const requiredEnvVars = {
  runtime: [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ],
  optional: [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GEMINI_API_KEY',
    'GROQ_API_KEY',
    'ANTHROPIC_API_KEY',
    'SENTRY_DSN',
  ],
};

export function validateEnvironment(): void {
  const missing: string[] = [];

  requiredEnvVars.runtime.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
}

export function getEnvStatus(): Record<string, boolean> {
  const status: Record<string, boolean> = {};

  requiredEnvVars.runtime.forEach((envVar) => {
    status[envVar] = !!process.env[envVar];
  });

  requiredEnvVars.optional.forEach((envVar) => {
    status[envVar] = !!process.env[envVar];
  });

  return status;
}
