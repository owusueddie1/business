# AURA Business Intelligence

> 🚀 **Production-Ready SaaS** • AI-Powered Business Analytics Platform

A premium Next.js 14 SaaS application for executive-level business intelligence, AI analysis, and competitive reporting. Fully configured for production deployment with enterprise-grade security, rate limiting, and monitoring.

**Status:** ✅ Production Ready | **Latest Deploy:** 2026-06-20

---

## ✨ Key Features

### Business Intelligence
- 📊 Executive dashboard with real-time metrics
- 📈 Competitive analysis and health scoring
- 📋 AI-powered business recommendations
- 📁 Multi-format file processing (CSV, XLSX, PDF)
- 🎯 Strategic action plans (30-day roadmaps)

### Technology
- ⚡ Next.js 14 with App Router & TypeScript
- 🔐 Enterprise-grade security (rate limiting, CORS, CSP)
- 🗄️ Supabase PostgreSQL with RLS policies
- 🔑 NextAuth.js authentication (OAuth + Credentials)
- 🎨 Premium Tailwind CSS + responsive design
- 🧠 AI integrations (Gemini, Groq, Anthropic)

### Production Features
- 📊 **Health Monitoring** - Real-time system status endpoint
- 🚨 **Rate Limiting** - 5 req/min for auth, 50 req/min for APIs
- 🔒 **Security Headers** - CSP, HSTS, X-Frame-Options
- 📝 **Structured Logging** - Production-grade error handling
- 🚀 **Netlify Ready** - Pre-configured deployment
- ⚙️ **Environment Validation** - Startup checks for config

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/owusueddie1/business
cd business
npm install
```

### 2. Configure Environment
```bash
cp env.example .env.local
# Edit .env.local with your credentials
```

### 3. Set Up Supabase Database
- Create Supabase project
- Run SQL from PRODUCTION_GUIDE.md
- Copy credentials to .env.local

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📦 What's Included

- ✅ Complete authentication system (login, register, OAuth)
- ✅ Protected dashboard with user data
- ✅ File upload & processing engine
- ✅ AI analysis integration (multi-model support)
- ✅ Dynamic report generation & viewing
- ✅ API key management interface
- ✅ Settings/profile management
- ✅ Health monitoring endpoint
- ✅ Rate limiting middleware
- ✅ Production security headers
- ✅ Structured error responses
- ✅ Environment validation

---

## 🌐 Deployment

### Deploy to Netlify (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your repository

3. **Set Environment Variables**
   - Add variables in Netlify Settings > Environment

4. **Auto-Deploy**
   - Every push to `main` automatically deploys

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup**

---

## 🔐 Security Features

- **Authentication**: NextAuth.js with JWT + secure cookies
- **Rate Limiting**: Configurable per-route limits
- **Input Validation**: Zod schema validation
- **Password Security**: bcrypt hashing (12 rounds)
- **API Security**: Standardized error responses (no stack traces)
- **Database Security**: Supabase RLS policies
- **CORS**: Pre-configured safe headers
- **HTTPS**: Automatic on Netlify

---

## 📊 Performance

```
Build Size: 87.3 kB (shared JS)
First Load: 88-198 kB (route-dependent)
Build Time: ~30 seconds
Lighthouse: Ready for Core Web Vitals
```

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Database** | Supabase PostgreSQL |
| **Auth** | NextAuth.js 4.x |
| **API** | Next.js API Routes |
| **Validation** | Zod |
| **AI** | Gemini, Groq, Anthropic |
| **Deploy** | Netlify |
| **Files** | xlsx, pdf-parse |

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment guide
- **[PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md)** - Complete production setup

---

## 🧪 Environment Variables

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key
- `NEXTAUTH_SECRET` - Generated secret
- `NEXTAUTH_URL` - App URL

**Optional:**
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- `GEMINI_API_KEY`, `GROQ_API_KEY`, `ANTHROPIC_API_KEY` - AI APIs

---

## 📁 Project Structure

```
app/
├── api/                  # API routes
│   ├── auth/            # Authentication endpoints
│   ├── analyze/         # AI analysis
│   ├── upload/          # File processing
│   ├── health/          # Health check
│   └── webhooks/        # Payment webhooks
├── dashboard/           # Protected dashboard
├── report/[id]/         # Dynamic reports
└── middleware.ts        # Rate limiting + security

lib/
├── supabase.ts          # Client SDK
├── supabase-admin.ts    # Admin SDK
├── authOptions.ts       # NextAuth config
├── api-response.ts      # Response helpers (NEW)
├── logger.ts            # Logging (NEW)
└── env-config.ts        # Validation (NEW)

components/
├── dashboard/           # Dashboard components
└── ui/                  # UI components

public/                  # Static assets
netlify.toml            # Deployment config (NEW)
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/keys` - Update API keys

### Analysis
- `POST /api/upload` - Upload file
- `POST /api/analyze` - Analyze with AI
- `GET /api/report/[id]` - Get report

### System
- `GET /api/health` - Health check with metrics

---

## 💡 Premium Features

### Built-In
- 🔐 **Enterprise Security** - CSP, HSTS, X-Frame-Options
- 🚨 **Rate Limiting** - Prevents API abuse
- 📊 **Health Monitoring** - System metrics & checks
- 📝 **Structured Logging** - Error tracking
- ✅ **Input Validation** - Zod schemas
- 🔄 **Standardized APIs** - Consistent responses

### Ready to Integrate
- 🎯 **Sentry** - Error tracking
- 📊 **PostHog** - Analytics
- 🔴 **Redis** - Session caching
- 📧 **SendGrid** - Email notifications
- 💳 **Stripe** - Payments

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Submit pull request

---

## 📄 License

MIT - Free for commercial use

---

**Built with ❤️ for enterprise-grade SaaS** • [Deployment Guide](./DEPLOYMENT.md)
