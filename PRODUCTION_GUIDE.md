# AURA Business Intelligence - Production Deployment Guide

## Overview

This is a production-ready Next.js 14 SaaS application with Supabase PostgreSQL backend, NextAuth.js authentication, and AI-powered business analysis features.

**Tech Stack:**
- Next.js 14.2.5 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- NextAuth.js 4.x
- Tailwind CSS
- Zod validation

---

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project**
   - Create account at https://supabase.com
   - Create new project and note:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (from Settings > API)

2. **Netlify Account**
   - Sign up at https://netlify.com
   - Connect your GitHub repository

3. **API Keys** (Optional but recommended)
   - Google OAuth: https://console.cloud.google.com
   - Gemini API: https://ai.google.dev
   - Groq API: https://console.groq.com
   - Anthropic Claude: https://console.anthropic.com

---

## Step 1: Prepare Supabase Database

### Create Tables

Run these SQL commands in Supabase SQL Editor (query all):

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255),
  apiKeyGemini TEXT,
  apiKeyGroq TEXT,
  apiKeyAnthropic TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  data JSONB,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploadId UUID NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
  aiResponse JSONB,
  healthScore INT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50),
  plan VARCHAR(50),
  currentPeriodEnd TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for client-side RLS)
CREATE POLICY \"Users can read own data\" ON users FOR SELECT
  USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX idx_uploads_userId ON uploads(userId);
CREATE INDEX idx_reports_userId ON reports(userId);
CREATE INDEX idx_reports_createdAt ON reports(createdAt DESC);
CREATE INDEX idx_subscriptions_userId ON subscriptions(userId);
```

---

## Step 2: Environment Configuration

### Local Development (.env)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR-ANON-KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR-SERVICE-KEY"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="YOUR-GOOGLE-CLIENT-ID"
GOOGLE_CLIENT_SECRET="YOUR-GOOGLE-CLIENT-SECRET"

# AI APIs
GEMINI_API_KEY="YOUR-GEMINI-KEY"
GROQ_API_KEY="YOUR-GROQ-KEY"
ANTHROPIC_API_KEY="YOUR-ANTHROPIC-KEY"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production Environment (Netlify)

Set these in Netlify Site Settings > Environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-KEY
NEXTAUTH_SECRET=YOUR-GENERATED-SECRET
NEXTAUTH_URL=https://your-app-name.netlify.app
GOOGLE_CLIENT_ID=YOUR-ID
GOOGLE_CLIENT_SECRET=YOUR-SECRET
GEMINI_API_KEY=YOUR-KEY
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Step 3: Deploy to Netlify

### Option A: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "New site from Git"
4. Select your repository
5. Netlify auto-detects Next.js settings
6. Add environment variables in Site Settings > Environment
7. Deploy!

### Option B: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --build
```

---

## Step 4: Post-Deployment Checklist

- [ ] Test health endpoint: `https://your-app.netlify.app/api/health`
- [ ] Test login/register flow
- [ ] Test file upload and analysis
- [ ] Verify Supabase connection in Netlify logs
- [ ] Enable automatic deployments in GitHub
- [ ] Set up custom domain (if needed)
- [ ] Enable HTTPS (automatic on Netlify)
- [ ] Configure email notifications

---

## Performance Optimizations

### Already Implemented:
- ✅ Rate limiting (5 req/min for auth, 50 req/min for API)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Response caching headers
- ✅ Static file optimization
- ✅ Database indexes on frequently queried fields

### Additional Recommendations:

1. **Enable Supabase Caching**
   ```sql
   -- Supabase > Settings > Database > Cache
   -- Enable query caching for frequently accessed data
   ```

2. **Set up CDN**
   - Netlify Edge Functions (built-in)
   - CloudFlare (optional)

3. **Monitoring & Analytics**
   - Add Sentry: https://sentry.io
   - Add PostHog analytics: https://posthog.com

4. **Database Backups**
   - Supabase auto-backups (daily, 7-day retention)
   - Enable point-in-time recovery

---

## Security Best Practices

### Implemented:
✅ NextAuth.js with JWT + cookies  
✅ API rate limiting  
✅ CORS headers  
✅ CSP (Content Security Policy)  
✅ Environment variable validation  

### Recommended Additional:
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Regular security audits
- [ ] Two-factor authentication
- [ ] API key rotation policy

---

## Troubleshooting

### Build Fails on Deploy

```bash
# Check logs
netlify logs

# Common issues:
# 1. Missing env vars - add to Netlify
# 2. Supabase connection - verify credentials
# 3. Next.js build errors - test locally first
```

### Database Connection Issues

```bash
# Test Supabase connection:
curl https://YOUR-PROJECT.supabase.co/rest/v1/users?select=count \
  -H "Authorization: Bearer YOUR-ANON-KEY"

# Should return a count result
```

### NextAuth Errors

```bash
# Verify:
# 1. NEXTAUTH_URL matches deployment URL
# 2. NEXTAUTH_SECRET is set
# 3. OAuth providers configured correctly
```

---

## Monitoring & Maintenance

### Health Checks

API health endpoint available at: `/api/health`

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-06-20T10:30:00Z",
  "checks": {
    "supabase": "connected",
    "nextauth": "configured",
    "memory": { "used": "512MB", "total": "1024MB" }
  }
}
```

### Regular Tasks

- **Weekly**: Review error logs in Netlify & Supabase
- **Monthly**: Analyze performance metrics
- **Quarterly**: Security audit & dependency updates
- **Annually**: Disaster recovery drill

---

## Scaling for Growth

### Database
- Upgrade Supabase plan as needed
- Add read replicas for high traffic
- Implement caching layer (Redis)

### Frontend
- Enable Netlify Analytics
- Use Netlify Functions for serverless backend
- Consider dedicated server if needed

### AI Processing
- Queue long-running analyses (Bull/BullMQ)
- Add background job processing

---

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- NextAuth.js: https://next-auth.js.org
- Netlify Docs: https://docs.netlify.com

---

## License

This project is ready for production use. Customize as needed for your business.
