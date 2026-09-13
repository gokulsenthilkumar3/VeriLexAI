# VeriLex AI

> **One workspace for Indian audit, tax, document intelligence, and legal-compliance research.**

VeriLex AI brings the former audit portal and legal-research experience together in one Next.js application. Teams can intake financial documents, manage clients and portfolios, compare tax regimes, organise audit evidence, and turn compliance questions into reviewable research requests.

## GitHub description

`AI workspace for Indian audit, tax, document intelligence, and legal-compliance research.`

## What it does

- **Audit workspace** — create evidence-led workplans, track controls, and document exceptions.
- **Tax operations** — manage clients, compare tax regimes, reconcile filings, and prepare reports.
- **Document intelligence** — parse PDF, Excel, Word, and image files with OCR-assisted extraction.
- **Legal & compliance research** — structure facts, identify research questions, and prepare counsel-ready hand-offs.
- **Unified AI Workspace** — switch between Audit, Tax, and Law modes without leaving the client workflow.

## Product boundaries

VeriLex AI is a professional productivity and research tool. AI responses are drafts and must be verified against source documents and current official requirements.

- It does **not** replace an auditor's professional judgment.
- It does **not** provide legal advice, representation, or a lawyer-client relationship.
- A licensed advocate must review case-specific legal decisions or actions.

See [the legal and AI-use notice](docs/LEGAL_AND_AI_NOTICE.md) for the full position.

## Stack

| Area | Technology |
| --- | --- |
| Web app | Next.js 14, React, TypeScript, Tailwind CSS |
| Database | Prisma (SQLite locally; adaptable to PostgreSQL/Supabase) |
| AI | Anthropic SDK with safe guided fallbacks when no key is configured |
| Document parsing | pdf-parse, SheetJS, Mammoth, Tesseract.js |
| Charts & UI | Recharts, Lucide |

## Start locally

```bash
git clone https://github.com/<your-org>/verilex-ai.git
cd verilex-ai
npm install
copy .env.example .env.local
npx prisma generate
npm run dev
```

Open `http://localhost:3000`, then select **AI Workspace** from the dashboard navigation.

### Environment

Set `ANTHROPIC_API_KEY` in `.env.local` to enable model-generated responses. Without it, the AI Workspace remains usable with guided, privacy-friendly workplan prompts. Review [.env.example](.env.example) for the remaining optional integrations.

## Structure

```text
verilex-ai/
├── src/app/
│   ├── dashboard/            # Clients, documents, accounts, tax, reports, AI and legal views
│   └── api/                  # Tax, document and unified assistant endpoints
├── src/lib/                  # AI, Prisma and shared utilities
├── prisma/                   # Data model and local database
├── docs/                     # Architecture and safety documentation
└── .env.example              # Local configuration template
```

## Core flows

```text
Document / client facts
          │
          ▼
  Audit evidence & review ──► Tax computation / reporting
          │                            │
          └────────► AI Workspace ◄────┘
                          │
                          ▼
             Legal-compliance research
             and counsel-ready hand-off
```

## Roadmap

- [x] Client, document, account, portfolio, tax, and reporting workflows
- [x] Unified Audit / Tax / Law AI Workspace
- [x] Legal-compliance research boundary and review guidance
- [ ] Client-scoped AI context with explicit consent controls
- [ ] Source-linked legal research and citation verification
- [ ] Evidence export, immutable audit logs, and review sign-off
- [ ] Role-based workflows for CA, auditor, client, and legal reviewer

## Contributing

Keep changes evidence-led and safety-aware. Do not add a claim of legal or tax accuracy without source validation, and do not log sensitive document contents in browser or server output.

## License

MIT © 2026 Gokul S.
