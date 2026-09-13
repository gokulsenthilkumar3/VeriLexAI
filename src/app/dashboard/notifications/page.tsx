'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCheck, Clock3, Sparkles } from 'lucide-react'

const initial = [
  { id: 'advance-tax', title: 'Advance tax review due', detail: 'Three Audit clients have a review due in 12 days.', type: 'deadline' },
  { id: 'legal-review', title: 'Legal matter needs counsel review', detail: 'Confirm jurisdiction and source documents before hand-off.', type: 'legal' },
  { id: 'wealth-region', title: 'Cross-region wealth scenario', detail: 'A new US-region scenario needs currency and residency context.', type: 'wealth' },
]

export default function NotificationsPage() {
  const [read, setRead] = useState<string[]>([])
  useEffect(() => { setRead(JSON.parse(localStorage.getItem('verilex-read-notifications') || '[]')) }, [])
  const unread = useMemo(() => initial.filter(item => !read.includes(item.id)), [read])
  const mark = (id: string) => { const next = Array.from(new Set([...read, id])); setRead(next); localStorage.setItem('verilex-read-notifications', JSON.stringify(next)) }
  const markAll = () => { const next = initial.map(item => item.id); setRead(next); localStorage.setItem('verilex-read-notifications', JSON.stringify(next)) }
  return <div className="p-6 sm:p-9 max-w-4xl mx-auto fade-in"><div className="flex items-end justify-between gap-4 mb-7"><div><div className="badge-violet mb-3"><Bell size={12}/> Notification centre</div><h1 className="text-2xl font-bold text-white">Notifications</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{unread.length} unread item{unread.length === 1 ? '' : 's'} across Audit, Wealth and Legal.</p></div><button onClick={markAll} className="btn-ghost text-xs"><CheckCheck size={14}/> Mark all read</button></div><div className="card overflow-hidden">{initial.map(item => { const isRead = read.includes(item.id); const Icon = item.type === 'deadline' ? Clock3 : item.type === 'wealth' ? Sparkles : Bell; return <button key={item.id} onClick={() => mark(item.id)} className="w-full p-5 text-left flex gap-3 transition-colors hover:bg-white/[.03]" style={{ borderTop: item.id !== initial[0].id ? '1px solid rgba(255,255,255,.07)' : undefined, opacity: isRead ? .58 : 1 }}><span className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-300"><Icon size={17}/></span><span className="flex-1"><b className="text-sm text-white block">{item.title}</b><span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{item.detail}</span></span>{!isRead && <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2"/>}</button>})}</div></div>
}
