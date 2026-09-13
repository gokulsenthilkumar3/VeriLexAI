'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Bot, CheckCircle2, FileText, Loader2, Scale, ShieldCheck, Sparkles, Calculator, ExternalLink } from 'lucide-react'

type Area = 'audit' | 'tax' | 'law'
type Message = { role: 'user' | 'assistant'; content: string }

const areas: { id: Area; label: string; detail: string; icon: typeof ShieldCheck; color: string }[] = [
  { id: 'audit', label: 'Audit', detail: 'Controls, evidence & exceptions', icon: ShieldCheck, color: '#60a5fa' },
  { id: 'tax', label: 'Tax', detail: 'ITR, regimes & reconciliations', icon: Calculator, color: '#34d399' },
  { id: 'law', label: 'Law', detail: 'Compliance research & legal context', icon: Scale, color: '#c4b5fd' },
]

const starters: Record<Area, string[]> = {
  audit: ['Create an audit plan for vendor payments', 'What evidence should I retain for an exception?'],
  tax: ['Help me compare tax regimes', 'What should I reconcile before filing an ITR?'],
  law: ['Summarise the compliance issues in a vendor agreement', 'What facts should I collect before legal research?'],
}

export default function IntelligencePage() {
  const [area, setArea] = useState<Area>('audit')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const selected = areas.find(item => item.id === area)!

  async function send(text = input) {
    if (!text.trim() || loading) return
    setMessages(previous => [...previous, { role: 'user', content: text.trim() }])
    setInput(''); setLoading(true)
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, area }) })
      const body = await response.json() as { answer?: string; error?: string }
      setMessages(previous => [...previous, { role: 'assistant', content: body.answer || body.error || 'Please try again.' }])
    } catch {
      setMessages(previous => [...previous, { role: 'assistant', content: 'Connection issue. Please try again.' }])
    } finally { setLoading(false) }
  }
  function submit(event: FormEvent) { event.preventDefault(); send() }

  return <div className="p-5 sm:p-7 lg:p-9 max-w-7xl mx-auto fade-in">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
      <div><div className="badge-violet mb-3"><Sparkles size={12}/> Unified intelligence</div><h1 className="text-2xl font-bold text-white tracking-tight">AI Workspace</h1><p className="text-sm mt-1" style={{ color: '#94a3b8' }}>One secure place to move from evidence to tax action and compliance research.</p></div>
      <div className="flex gap-2"><Link href="/dashboard/documents" className="btn-ghost text-xs"><FileText size={14}/> Add evidence</Link><Link href="/dashboard/tax" className="btn-primary text-xs"><Calculator size={14}/> Open tax engine</Link></div>
    </div>
    <div className="grid xl:grid-cols-[270px_1fr] gap-5">
      <aside className="card p-3 h-fit">
        <p className="text-[10px] tracking-widest font-bold uppercase px-2 mb-2" style={{ color: '#64748b' }}>Choose a lens</p>
        <div className="space-y-1">{areas.map(item => { const Icon = item.icon; const active = item.id === area; return <button key={item.id} onClick={() => setArea(item.id)} className="w-full flex gap-3 text-left p-3 rounded-xl transition-colors" style={{ background: active ? 'rgba(99,102,241,.14)' : 'transparent', border: active ? '1px solid rgba(129,140,248,.25)' : '1px solid transparent' }}><span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: item.color, background: `${item.color}18` }}><Icon size={17}/></span><span><b className="text-sm text-white block">{item.label}</b><span className="text-[11px]" style={{ color: '#94a3b8' }}>{item.detail}</span></span></button> })}</div>
        <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.16)' }}><div className="flex gap-2 text-xs font-semibold text-emerald-300"><CheckCircle2 size={14}/> Privacy-first workflow</div><p className="text-[11px] leading-relaxed mt-1" style={{ color: '#94a3b8' }}>Keep evidence, reasoning and hand-offs together for review.</p></div>
      </aside>
      <section className="card overflow-hidden min-h-[560px] flex flex-col" style={{ background: 'linear-gradient(145deg, #0d1025, #0a0c1e)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,.07)' }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selected.color}1a`, color: selected.color }}><Bot size={20}/></div><div><h2 className="font-semibold text-white">{selected.label} copilot</h2><p className="text-xs" style={{ color: '#94a3b8' }}>Context-aware guidance with clear hand-offs</p></div><span className="ml-auto text-[10px] px-2 py-1 rounded-full" style={{ color: '#34d399', background: 'rgba(16,185,129,.1)' }}>Ready</span></div></div>
        <div className="flex-1 p-5 space-y-4 overflow-auto">
          {!messages.length && <div className="h-full flex flex-col items-center justify-center text-center py-12"><div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${selected.color}16`, color: selected.color }}><selected.icon size={25}/></div><h3 className="font-semibold text-white">What are you working on?</h3><p className="text-sm max-w-md mt-2" style={{ color: '#94a3b8' }}>Ask a focused question or start from one of these safe, reviewable prompts.</p><div className="mt-5 grid sm:grid-cols-2 gap-2 max-w-xl w-full">{starters[area].map(prompt => <button key={prompt} onClick={() => send(prompt)} className="btn-ghost text-left text-xs whitespace-normal leading-relaxed">{prompt}<ExternalLink size={12}/></button>)}</div></div>}
          {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className="max-w-[85%] rounded-2xl p-4 text-sm leading-6 whitespace-pre-wrap" style={{ background: message.role === 'user' ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,.045)', color: message.role === 'user' ? '#fff' : '#cbd5e1', border: message.role === 'assistant' ? '1px solid rgba(255,255,255,.08)' : 'none' }}>{message.content}</div></div>)}
          {loading && <div className="flex gap-2 items-center text-xs" style={{ color: '#a5b4fc' }}><Loader2 size={14} className="animate-spin"/> Reviewing your question…</div>}
        </div>
        <form onSubmit={submit} className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}><div className="flex gap-3 items-end rounded-xl p-2" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)' }}><textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Ask the ${selected.label.toLowerCase()} copilot…`} rows={2} className="flex-1 bg-transparent resize-none outline-none text-sm px-2 py-1" style={{ color: '#e2e8f0' }}/><button disabled={loading || !input.trim()} className="btn-primary p-3" aria-label="Send question"><ArrowUp size={16}/></button></div><p className="text-[10px] mt-2 text-center" style={{ color: '#64748b' }}>{area === 'law' ? 'Legal information for research and compliance, not legal advice.' : 'Verify final conclusions against source documents and applicable requirements.'}</p></form>
      </section>
    </div>
  </div>
}
