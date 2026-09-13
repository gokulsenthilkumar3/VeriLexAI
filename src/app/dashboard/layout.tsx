'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Calculator,
  TrendingUp,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Scale,
  ShieldCheck,
  ChevronRight,
  Search,
  Upload,
  FilePlus2,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { ThemeInitializer, ThemeToggle } from '@/components/theme-controls'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/dashboard',           icon: LayoutDashboard, exact: true },
      { label: 'Clients',    href: '/dashboard/clients',   icon: Users },
    ],
  },
  {
    label: 'Audit',
    items: [
      { label: 'Engagements', href: '/dashboard/audit',     icon: ShieldCheck },
      { label: 'Audit Clients', href: '/dashboard/clients?workspace=AUDIT', icon: Users },
      { label: 'Evidence', href: '/dashboard/documents',    icon: FileText },
    ],
  },
  {
    label: 'Wealth',
    items: [
      { label: 'Wealth Scenarios', href: '/dashboard/wealth', icon: Building2 },
      { label: 'Tax Engine', href: '/dashboard/tax',       icon: Calculator },
      { label: 'Reports',    href: '/dashboard/reports',   icon: BarChart3 },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Legal Research', href: '/dashboard/legal', icon: Scale },
      { label: 'Legal Clients', href: '/dashboard/clients?workspace=LEGAL', icon: Users },
      { label: 'AI Workspace', href: '/dashboard/intelligence', icon: Sparkles },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings',   href: '/dashboard/settings',  icon: Settings },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="theme-shell flex min-h-screen" style={{ background: '#07091a' }}>
      <ThemeInitializer />
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-[260px] flex-col h-full bg-[#080a1c] shadow-2xl animate-in slide-in-from-left-8 duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-50"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

/* ── Topbar ─────────────────────────────────────────────────── */
function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {

  return (
    <header
      className="theme-topbar shrink-0 flex items-center justify-between px-4 sm:px-7 py-3.5 gap-4"
      style={{
        background: 'rgba(8,10,28,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-sm relative hidden sm:block">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#475569' }}
        />
        <input
          type="search"
          placeholder="Search clients, documents…"
          className="input pl-9 py-2 text-xs h-9"
          style={{ maxWidth: '320px', fontSize: '0.8125rem' }}
          aria-label="Search clients and documents"
        />
      </div>
    </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Upload shortcut */}
        <Link
          href="/dashboard/documents"
          className="btn-ghost text-xs py-2 px-3 gap-1.5 hidden sm:flex"
          aria-label="Upload a document"
        >
          <Upload size={13} />
          Upload
        </Link>

        {/* Add client shortcut */}
        <Link
          href="/dashboard/clients/new"
          className="btn-primary text-xs py-2 px-3 gap-1.5 hidden sm:flex"
          aria-label="Add a new client"
        >
          <FilePlus2 size={13} />
          Add Client
        </Link>

        {/* Dark mode toggle */}
        <ThemeToggle compact />

        {/* Notification bell with badge */}
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          aria-label="3 unread notifications"
          title="Notifications"
        >
          <Bell size={15} style={{ color: '#94a3b8' }} />
          {/* Badge */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
            style={{
              background: '#ef4444',
              boxShadow: '0 0 0 2px #080a1c',
              animation: 'badgePulse 2.5s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            3
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* User avatar */}
        <button
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          aria-label="Open user menu"
          title="Admin User — Chartered Accountant"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            CA
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-white leading-tight">Admin User</p>
            <p className="text-[10px] leading-tight" style={{ color: '#64748b' }}>CA Portal</p>
          </div>
          <ChevronRight size={12} style={{ color: '#475569' }} className="hidden md:block" />
        </button>
      </div>
    </header>
  )
}

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className="theme-sidebar w-[260px] md:w-[220px] shrink-0 flex flex-col h-full md:h-screen sticky top-0 overflow-hidden"
      style={{
        background: '#080a1c',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="VeriLex AI Dashboard">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="6" height="8" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="10" y="2" width="6" height="4" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="10" y="8" width="6" height="8" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="2" y="12" width="6" height="4" rx="1.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight tracking-tight">VeriLex AI</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#6b7280' }}>Audit · Tax · Law</p>
          </div>
        </Link>
      </div>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="mx-4 mb-4" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

      {/* ── Nav Groups ───────────────────────────────── */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-5" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="text-[10px] font-bold tracking-widest uppercase px-2 mb-1.5"
              style={{ color: '#6b7280' }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    title={label}
                    className={`sidebar-nav-link ${active ? 'active' : ''}`}
                  >
                    <Icon
                      size={15}
                      style={{
                        color: active ? '#818cf8' : '#64748b',
                        transition: 'color 0.15s',
                        filter: active ? 'drop-shadow(0 0 6px rgba(99,102,241,0.6))' : 'none',
                      }}
                    />
                    <span className="flex-1 truncate">{label}</span>
                    {active && (
                      <ChevronRight size={11} style={{ color: '#6366f1' }} className="shrink-0" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── AI Tip Banner ─────────────────────────────── */}
      <div className="px-3 mb-3">
        <div
          className="rounded-xl p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.13), rgba(139,92,246,0.09))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={11} style={{ color: '#818cf8' }} />
            <span className="text-[11px] font-bold" style={{ color: '#a5b4fc' }}>AI Insight</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
            3 clients have advance tax due in 12 days.
          </p>
          <Link
            href="/dashboard/tax"
            className="mt-2 flex items-center gap-0.5 text-[10px] font-semibold transition-colors hover:text-indigo-300"
            style={{ color: '#6366f1' }}
          >
            Review now <ChevronRight size={9} />
          </Link>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div
        className="px-3 py-3 space-y-0.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          className="sidebar-nav-link w-full text-left"
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(239,68,68,0.1)'
            el.style.color = '#f87171'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = ''
            el.style.color = ''
          }}
          title="Sign Out"
        >
          <LogOut size={15} style={{ color: '#64748b' }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
