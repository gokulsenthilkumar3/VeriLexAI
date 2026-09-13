# VeriLex AI – Architecture

## Overview

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         Next.js 14 + TypeScript              │
│         Tailwind CSS + shadcn/ui             │
└───────────────────┬─────────────────────────┘
                    │ API Routes / REST
┌───────────────────▼─────────────────────────┐
│               Backend (API)                  │
│         Next.js API Routes / Express         │
│  Audit Engine | Tax Engine | Legal Research  │
└────────┬──────────────────────┬─────────────┘
         │                      │
┌────────▼──────┐    ┌──────────▼──────────────┐
│  PostgreSQL    │    │   External APIs          │
│  (Supabase)    │    │  - Claude AI             │
│  Prisma ORM    │    │  - Google Vision OCR      │
└───────────────┘    │  - Zerodha Kite API       │
                      │  - CoinGecko (Crypto)     │
┌─────────────────┐   │  - Alpha Vantage (Stocks) │
│ Supabase Storage│   └──────────────────────────┘
│  (Documents)    │
└─────────────────┘
```

## Data Flow: Document Processing

1. User uploads file → Supabase Storage
2. API Route receives file
3. Parser selected by MIME type (pdf-parse / xlsx / mammoth / tesseract)
4. Raw text sent to Claude API with CA prompt
5. Structured JSON returned → saved to `Document` table
6. CA reviews AI extraction and confirms

## Tax Computation Flow

1. Client data aggregated (salary, investments, documents)
2. Tax engine runs Old & New regime comparison
3. Capital gains computed per asset class
4. Deductions validated against limits (80C ≤ 1.5L, etc.)
5. Final liability with TDS offset = balance payable / refund

## Unified intelligence flow

1. A user selects an Audit, Tax, or Law lens in the AI Workspace.
2. The assistant receives the question plus the selected professional context.
3. The response is displayed as a reviewable draft; it is never treated as an automatic filing, audit conclusion, or legal opinion.
4. Users move into the relevant evidence, tax, report, or legal hand-off workflow.

## Migrated legal contracts

The legal-research scenario contracts from the former LexSense project now live in `src/types/legal.ts`. They provide a common structure for legal domains, consent-aware research requests, fact verification, and counsel questions inside the same application.

## Security

- All documents stored with user-scoped paths in Supabase
- Row Level Security (RLS) enforced at DB level
- CA can only access their assigned clients
- Audit logs for all CA actions
