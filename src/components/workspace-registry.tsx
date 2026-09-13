'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BriefcaseBusiness, FolderOpen, Plus, Scale, ShieldCheck, Users } from 'lucide-react'

type Mode = 'audit' | 'wealth' | 'legal'
type Item = { id: string; title: string; status: string; riskLevel?: string; practiceArea?: string; legalDomain?: string; financialYear?: string; reference?: string; region?: string; currency?: string; user: { name: string; email: string } }
type WorkspaceData = { total: number; active: number; attention: number; items: Item[] }
const config = {
  audit: { name: 'Audit', icon: ShieldCheck, color: '#60a5fa', noun: 'engagement', singular: 'Engagement', attention: 'High risk' },
  wealth: { name: 'Wealth', icon: BriefcaseBusiness, color: '#34d399', noun: 'scenario', singular: 'Scenario', attention: 'Cross-region' },
  legal: { name: 'Legal', icon: Scale, color: '#c4b5fd', noun: 'matter', singular: 'Matter', attention: 'Counsel review' },
} as const

const scopes: Record<Mode, string[]> = {
  audit: ['All', 'India', 'US', 'Europe'],
  wealth: ['All', 'India', 'US', 'Europe', 'Global'],
  legal: ['All', 'Civil', 'Criminal', 'Business', 'Consumer', 'Family', 'Labour', 'Cyber'],
}

export function WorkspaceRegistry({ mode }: { mode: Mode }) {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [scope, setScope] = useState('All')
  const current = config[mode]; const Icon = current.icon
  useEffect(() => { fetch(`/api/workspaces/${mode}`).then(r => r.json()).then(setData).catch(() => setData({ total: 0, active: 0, attention: 0, items: [] })) }, [mode])
  const metrics = [
    { label: `Total ${current.noun}s`, value: data?.total ?? '—', icon: FolderOpen },
    { label: `Active ${current.noun}s`, value: data?.active ?? '—', icon: BriefcaseBusiness },
    { label: current.attention, value: data?.attention ?? '—', icon: mode === 'audit' ? ShieldCheck : Scale },
  ]
  const visibleItems = (data?.items || []).filter(item => scope === 'All' || (mode === 'legal' ? item.legalDomain === scope.toUpperCase() : item.region === scope.toUpperCase()))
  return <div className="p-6 sm:p-9 max-w-7xl mx-auto fade-in">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7"><div><div className="badge-violet mb-3"><Icon size={12}/>{current.name} workspace</div><h1 className="text-2xl font-bold text-white">{current.name} portfolio</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{mode === 'audit' ? 'India, US and Europe audit scenarios.' : mode === 'wealth' ? 'Multi-region wealth scenarios with local currency context.' : 'Civil, criminal, business, consumer and more.'}</p></div><Link href={`/dashboard/clients/new?workspace=${mode.toUpperCase()}`} className="btn-primary text-xs"><Plus size={14}/> Add {current.name} scenario</Link></div>
    <div className="grid sm:grid-cols-3 gap-4 mb-6">{metrics.map(metric => { const MetricIcon = metric.icon; return <div key={metric.label} className="card p-5"><div className="flex justify-between"><span className="text-xs" style={{ color: '#94a3b8' }}>{metric.label}</span><MetricIcon size={16} style={{ color: current.color }}/></div><p className="text-3xl font-bold text-white mt-4">{metric.value}</p><p className="text-[11px] mt-1" style={{ color: '#64748b' }}>Across your {current.name.toLowerCase()} workspace</p></div>})}</div>
    <div className="flex flex-wrap gap-2 mb-6" aria-label={`${current.name} scope filters`}>{scopes[mode].map(item => <button key={item} onClick={() => setScope(item)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ color: scope === item ? '#fff' : '#94a3b8', background: scope === item ? current.color : 'rgba(255,255,255,.045)', border: `1px solid ${scope === item ? current.color : 'rgba(255,255,255,.08)'}` }}>{item}</button>)}</div>
    <div className="card overflow-hidden"><div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,.07)' }}><div><h2 className="font-semibold text-white">{current.name} {mode === 'audit' ? 'engagements' : mode === 'wealth' ? 'scenarios' : 'matters'}</h2><p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Each record has its own client, region, owner, status and review trail.</p></div><Users size={18} style={{ color: current.color }}/></div>{!data ? <div className="p-10 text-sm" style={{ color: '#94a3b8' }}>Loading {current.noun}s…</div> : !data.items.length ? <div className="p-10 text-center"><Icon size={25} className="mx-auto mb-3" style={{ color: current.color }}/><p className="font-medium text-white">No {current.noun}s yet</p><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Add a person, then start their first {current.singular.toLowerCase()}.</p></div> : !visibleItems.length ? <div className="p-10 text-center text-sm" style={{ color: '#94a3b8' }}>No {current.noun}s in the selected {scope} scope.</div> : <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>{current.singular}</th><th>Person</th><th>Region / context</th><th>Status</th></tr></thead><tbody>{visibleItems.map(item => <tr key={item.id}><td className="font-medium text-white">{item.title}</td><td><span className="text-white">{item.user.name}</span><span className="block text-xs mt-0.5" style={{ color: '#64748b' }}>{item.user.email}</span></td><td>{mode === 'audit' ? `${item.region || 'INDIA'} · ${item.financialYear || '—'}` : mode === 'wealth' ? `${item.region || 'INDIA'} · ${item.currency || 'INR'}` : `${item.region || 'INDIA'} · ${item.practiceArea || 'General'}`}</td><td><span className="badge-slate">{item.status.replace('_', ' ')}</span></td></tr>)}</tbody></table></div>}</div>
  </div>
}
