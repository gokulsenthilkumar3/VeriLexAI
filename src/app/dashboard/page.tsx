import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  Users,
  FileText,
  ScanLine,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Calculator,
  Building2,
  BarChart3,
  FilePlus2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Calendar,
  Upload,
  Scale,
  Globe2,
} from 'lucide-react'

async function getStats() {
  try {
    const [clientCount, docCount, returnCount] = await Promise.all([
      prisma.user.count({ where: { role: 'TAXPAYER' } }),
      prisma.document.count(),
      prisma.taxReturn.count({ where: { status: 'DRAFT' } }),
    ])
    return { clientCount, docCount, pendingReturns: returnCount }
  } catch {
    return { clientCount: 0, docCount: 0, pendingReturns: 0 }
  }
}

/* ─── Static data ────────────────────────────────────────────── */

const activityGroups = [
  {
    label: 'Today',
    items: [
      {
        icon: CheckCircle2,
        iconColor: '#10b981',
        iconBg: 'rgba(16,185,129,0.12)',
        iconBorder: 'rgba(16,185,129,0.22)',
        text: 'Form 16 parsed for Ravi Shankar',
        meta: '2 min ago',
      },
      {
        icon: Clock,
        iconColor: '#f59e0b',
        iconBg: 'rgba(245,158,11,0.12)',
        iconBorder: 'rgba(245,158,11,0.22)',
        text: 'ITR-2 review pending — Priya Nair',
        meta: '18 min ago',
      },
      {
        icon: Zap,
        iconColor: '#818cf8',
        iconBg: 'rgba(99,102,241,0.12)',
        iconBorder: 'rgba(99,102,241,0.22)',
        text: 'Capital gains computed — Arjun Mehta',
        meta: '1 hr ago',
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        icon: Upload,
        iconColor: '#60a5fa',
        iconBg: 'rgba(59,130,246,0.12)',
        iconBorder: 'rgba(59,130,246,0.22)',
        text: 'Bank statement uploaded — 3 files',
        meta: 'Jun 2, 9:14 PM',
      },
      {
        icon: CheckCircle2,
        iconColor: '#10b981',
        iconBg: 'rgba(16,185,129,0.12)',
        iconBorder: 'rgba(16,185,129,0.22)',
        text: 'AIS reconciliation done — Deepa K.',
        meta: 'Jun 2, 4:30 PM',
      },
    ],
  },
]

const deadlines = [
  { client: 'Ravi Shankar',  task: 'Advance Tax Q1',  daysLeft: 7,  type: 'ITR-2' },
  { client: 'Meena Iyer',    task: 'ITR-3 Filing',    daysLeft: 12, type: 'ITR-3' },
  { client: 'Arjun Mehta',   task: 'Advance Tax Q1',  daysLeft: 18, type: 'ITR-1' },
  { client: 'Priya Nair',    task: '26AS Reconcile',  daysLeft: 25, type: 'AIS'   },
]

const quickActions = [
  { title: 'Add Client',      desc: 'Onboard a taxpayer',       icon: FilePlus2,  href: '/dashboard/clients/new', accent: '#6366f1' },
  { title: 'Upload Doc',      desc: 'PDF, Excel, Image',        icon: FileText,   href: '/dashboard/documents',   accent: '#8b5cf6' },
  { title: 'Compute Tax',     desc: 'Run tax engine',           icon: Calculator, href: '/dashboard/tax',         accent: '#f59e0b' },
  { title: 'Portfolios',      desc: 'Stocks, MF, Crypto',       icon: TrendingUp, href: '/dashboard/portfolio',   accent: '#10b981' },
  { title: 'Accounts',        desc: 'Bank, Demat, Trading',     icon: Building2,  href: '/dashboard/accounts',    accent: '#0ea5e9' },
  { title: 'Reports',         desc: 'Export CA summary PDF',    icon: BarChart3,  href: '/dashboard/reports',     accent: '#f43f5e' },
]

/* ─── Revenue data ───────────────────────────────────────────── */
// Simulated monthly revenue in ₹ thousands
const revenueData = [18, 24, 20, 38, 30, 44, 32, 40, 27, 46, 39, 52]
const revenueLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const yTicks = [0, 15, 30, 45, 60]

/* ─── Helpers ────────────────────────────────────────────────── */
function urgencyStyle(days: number): { color: string; bg: string; border: string; label: string } {
  if (days <= 10) return { color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   label: `${days}d` }
  if (days <= 20) return { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', label: `${days}d` }
  return              { color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  label: `${days}d` }
}

/* ─── Page ───────────────────────────────────────────────────── */
export default async function DashboardPage() {
  const stats = await getStats()
  const currentMonth = new Date().getMonth()

  const kpiCards = [
    {
      label: 'Active Clients',
      value: stats.clientCount || 0,
      display: String(stats.clientCount || 0),
      sub: '+2 this week',
      icon: Users,
      accent: '#6366f1',
      accentBg: 'rgba(99,102,241,0.12)',
      delta: '+8%',
      deltaUp: true,
    },
    {
      label: 'Pending Returns',
      value: stats.pendingReturns || 0,
      display: String(stats.pendingReturns || 0),
      sub: 'Need attention',
      icon: FileText,
      accent: '#f59e0b',
      accentBg: 'rgba(245,158,11,0.12)',
      delta: '–3 filed',
      deltaUp: false,
    },
    {
      label: 'Docs Parsed',
      value: stats.docCount || 0,
      display: String(stats.docCount || 0),
      sub: 'AI processed',
      icon: ScanLine,
      accent: '#10b981',
      accentBg: 'rgba(16,185,129,0.12)',
      delta: '+24%',
      deltaUp: true,
    },
    {
      label: 'Total AUM',
      value: 0,
      display: '₹0',
      sub: 'Across all clients',
      icon: IndianRupee,
      accent: '#8b5cf6',
      accentBg: 'rgba(139,92,246,0.12)',
      delta: 'Track →',
      deltaUp: true,
    },
  ]

  return (
    <div
      className="p-6 fade-in"
      style={{ minHeight: '100vh', background: '#07091a' }}
    >
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Good evening, CA 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          Assessment Year 2025–26 &nbsp;·&nbsp;{' '}
          <span style={{ color: '#f87171' }}>3 deadlines this week</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        {[
          { title: 'Audit', desc: 'India · US · Europe engagements', href: '/dashboard/audit', icon: CheckCircle2, color: '#60a5fa' },
          { title: 'Wealth', desc: 'Multi-region personal scenarios', href: '/dashboard/wealth', icon: Globe2, color: '#34d399' },
          { title: 'Legal', desc: 'Civil, criminal, business & consumer', href: '/dashboard/legal', icon: Scale, color: '#c4b5fd' },
        ].map(({ title, desc, href, icon: Icon, color }) => (
          <Link key={title} href={href} className="card card-hover p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}><Icon size={19}/></span>
            <span><span className="font-semibold text-white block">{title}</span><span className="text-xs" style={{ color: '#94a3b8' }}>{desc}</span></span>
            <ArrowRight size={15} className="ml-auto" style={{ color }} />
          </Link>
        ))}
      </div>

      {/* ── AI Alert Banner ───────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.13) 0%, rgba(139,92,246,0.09) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
        role="alert"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
          aria-hidden="true"
        >
          <Sparkles size={17} style={{ color: '#818cf8' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: '#c7d2fe' }}>
            AI found 3 clients eligible for additional 80C deductions
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#94a3b8' }}>
            Potential savings of <span style={{ color: '#34d399', fontWeight: 600 }}>₹45,000 per client</span> before March 31st deadline. Review and apply now.
          </p>
        </div>
        <Link
          href="/dashboard/tax"
          className="btn-primary text-xs py-2 px-4 shrink-0 whitespace-nowrap"
          aria-label="Review AI tax insights"
        >
          Review <ArrowRight size={11} />
        </Link>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(({ label, display, sub, icon: Icon, accent, accentBg, delta, deltaUp }) => (
          <div
            key={label}
            className="card card-hover rounded-xl p-5 relative overflow-hidden group"
          >
            {/* top accent rule */}
            <div
              className="absolute top-0 inset-x-0 h-[2px] rounded-t-xl"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }}
              aria-hidden="true"
            />

            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: accentBg }}
              >
                <Icon size={16} style={{ color: accent }} aria-hidden="true" />
              </div>
              <span
                className="text-[11px] font-semibold flex items-center gap-0.5"
                style={{ color: deltaUp ? '#34d399' : '#fbbf24' }}
                aria-label={`Change: ${delta}`}
              >
                {deltaUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {delta}
              </span>
            </div>

            {/* Value — DM Mono, tabular-nums for stable width */}
            <div
              className="text-2xl font-bold text-white mb-0.5 tabular-nums"
              style={{
                fontFamily: "'DM Mono', 'Fira Code', monospace",
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {display}
            </div>
            <div className="text-xs font-semibold text-white mb-0.5">{label}</div>
            <div className="text-[11px]" style={{ color: '#64748b' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main 3-column grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

        {/* ── Revenue Chart (col-span-2) ──────────────────────── */}
        <div className="xl:col-span-2 card rounded-xl p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Revenue Overview</h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Monthly billing — FY 2025–26 (₹ thousands)</p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(99,102,241,0.35)' }} />
                Past
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#6366f1' }} />
                Current
              </span>
            </div>
          </div>

          {/* Chart area */}
          <div className="flex gap-3">
            {/* Y-axis labels */}
            <div
              className="flex flex-col-reverse justify-between text-right shrink-0 pb-5"
              style={{ color: '#475569', fontSize: '9px', width: '28px', height: '128px' }}
              aria-hidden="true"
            >
              {yTicks.map(t => (
                <span key={t}>{t === 0 ? '0' : `${t}k`}</span>
              ))}
            </div>

            {/* Bars + x-labels */}
            <div className="flex-1 min-w-0">
              {/* Horizontal gridlines */}
              <div className="relative" style={{ height: '128px' }}>
                {yTicks.slice(1).map(t => (
                  <div
                    key={t}
                    className="absolute inset-x-0"
                    style={{
                      bottom: `${(t / 60) * 100}%`,
                      borderTop: '1px dashed rgba(255,255,255,0.05)',
                    }}
                    aria-hidden="true"
                  />
                ))}

                {/* Bars */}
                <div className="absolute inset-0 flex items-end gap-1">
                  {revenueData.map((val, i) => {
                    const isCurrent = i === currentMonth
                    const isPast    = i < currentMonth
                    const pct       = (val / 60) * 100

                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col justify-end group/bar relative"
                        style={{ height: '100%' }}
                      >
                        {/* Hover tooltip */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
                          style={{
                            bottom: `calc(${pct}% + 6px)`,
                            background: '#1e2235',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '5px',
                            padding: '3px 6px',
                            fontSize: '9px',
                            color: '#e2e8f0',
                            whiteSpace: 'nowrap',
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          ₹{val}k
                        </div>
                        <div
                          className="w-full rounded-t-[3px] transition-all duration-200 group-hover/bar:opacity-90"
                          style={{
                            height: `${pct}%`,
                            background: isCurrent
                              ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                              : isPast
                                ? 'rgba(99,102,241,0.38)'
                                : 'rgba(99,102,241,0.12)',
                            boxShadow: isCurrent ? '0 -3px 10px rgba(99,102,241,0.5)' : 'none',
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex gap-1 mt-1.5">
                {revenueLabels.map((l, i) => (
                  <span
                    key={l}
                    className="flex-1 text-center"
                    style={{
                      fontSize: '8px',
                      fontWeight: i === currentMonth ? 700 : 400,
                      color: i === currentMonth ? '#818cf8' : '#475569',
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div
            className="flex items-center gap-6 mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { label: 'This Month',   val: `₹${revenueData[currentMonth]}k`, color: '#818cf8' },
              { label: 'YTD Total',    val: `₹${revenueData.slice(0, currentMonth + 1).reduce((a, b) => a + b, 0)}k`, color: '#34d399' },
              { label: 'Avg / Month',  val: `₹${Math.round(revenueData.reduce((a,b)=>a+b,0)/revenueData.length)}k`, color: '#94a3b8' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <p
                  className="text-base font-bold tabular-nums"
                  style={{ color, fontFamily: "'DM Mono', monospace" }}
                >
                  {val}
                </p>
                <p className="text-[10px]" style={{ color: '#64748b' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming Deadlines ────────────────────────────────── */}
        <div className="card rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Upcoming Deadlines</h2>
            <div
              className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertTriangle size={10} />
              3 urgent
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            {deadlines.map(({ client, task, daysLeft, type }) => {
              const u = urgencyStyle(daysLeft)
              return (
                <div
                  key={client + task}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    <Calendar size={13} style={{ color: '#818cf8' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{client}</p>
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: '#64748b' }}>{task}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: u.bg, color: u.color, border: `1px solid ${u.border}`, fontFamily: "'DM Mono', monospace" }}
                    >
                      {u.label}
                    </span>
                    <span className="text-[9px]" style={{ color: '#475569' }}>{type}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <Link
            href="/dashboard/clients"
            className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors hover:text-indigo-300"
            style={{ color: '#6366f1' }}
          >
            View all deadlines <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Bottom 2-column grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">

        {/* ── Quick Actions card ───────────────────────────────── */}
        <div className="card rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">Quick Actions</h2>
          <p className="text-xs mb-4" style={{ color: '#64748b' }}>Common tasks at a glance</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {quickActions.map(({ title, desc, icon: Icon, href, accent }) => (
              <Link
                key={href}
                href={href}
                className="card card-hover rounded-lg p-3 flex flex-col items-start gap-2 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `${accent}18`,
                    border:     `1px solid ${accent}28`,
                  }}
                >
                  <Icon size={14} style={{ color: accent }} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">{title}</div>
                  <div className="text-[9px] mt-0.5 leading-tight" style={{ color: '#64748b' }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Activity Feed ────────────────────────────────────── */}
        <div className="card rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Activity Feed</h2>
            <Link
              href="/dashboard/documents"
              className="text-xs font-semibold transition-colors hover:text-indigo-300"
              style={{ color: '#6366f1' }}
            >
              View all →
            </Link>
          </div>

          <div className="flex-1 space-y-4 overflow-auto">
            {activityGroups.map((group) => (
              <div key={group.label}>
                {/* Time group label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
                    {group.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>

                <div className="space-y-2">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: item.iconBg, border: `1px solid ${item.iconBorder}` }}
                      >
                        <item.icon size={13} style={{ color: item.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug" style={{ color: '#cbd5e1' }}>{item.text}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{item.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Clients ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Clients</h2>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Latest additions to your roster</p>
          </div>
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-indigo-300"
            style={{ color: '#6366f1' }}
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card rounded-xl overflow-hidden">
          {stats.clientCount === 0 ? (
            /* ── Designed empty state ── */
            <div className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Users size={24} style={{ color: '#818cf8' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">No clients yet</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748b' }}>
                  Add your first client to start managing their documents,
                  tax filings, and portfolio — all in one place.
                </p>
              </div>
              <Link href="/dashboard/clients/new" className="btn-primary text-xs py-2.5 px-5 shrink-0">
                <FilePlus2 size={13} />
                Add First Client
              </Link>
            </div>
          ) : (
            <div className="px-5 py-4 flex items-center gap-3" style={{ color: '#94a3b8' }}>
              <Users size={15} style={{ color: '#6366f1' }} />
              <span className="text-sm">
                <span className="font-bold text-white"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {stats.clientCount}
                </span>{' '}
                client{stats.clientCount > 1 ? 's' : ''} on your roster.
              </span>
              <Link href="/dashboard/clients" className="ml-auto text-xs font-semibold hover:underline" style={{ color: '#6366f1' }}>
                Manage →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
