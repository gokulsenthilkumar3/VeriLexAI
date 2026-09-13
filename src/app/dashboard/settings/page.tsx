'use client'

import { useEffect, useState } from 'react'
import { Bell, Globe2, ShieldCheck, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-controls'

const preferences = [
  { key: 'deadline', title: 'Deadline reminders', desc: 'Receive alerts for tax, audit and legal review dates.', icon: Bell },
  { key: 'ai', title: 'AI review notices', desc: 'Show a reminder when AI output needs professional validation.', icon: Sparkles },
  { key: 'region', title: 'Regional context', desc: 'Keep India, US and Europe context available in new scenarios.', icon: Globe2 },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, boolean>>({ deadline: true, ai: true, region: true })
  useEffect(() => { const saved = localStorage.getItem('verilex-preferences'); if (saved) setValues(JSON.parse(saved)) }, [])
  const update = (key: string) => setValues(previous => { const next = { ...previous, [key]: !previous[key] }; localStorage.setItem('verilex-preferences', JSON.stringify(next)); return next })
  return <div className="p-6 sm:p-9 max-w-4xl mx-auto fade-in"><div className="badge-violet mb-3"><ShieldCheck size={12}/> Workspace preferences</div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-sm mt-1 mb-7" style={{ color: '#94a3b8' }}>Personalize your VeriLex AI workspace. Preferences are saved on this device.</p><section className="card p-5 mb-4"><h2 className="font-semibold text-white">Appearance</h2><p className="text-xs mt-1 mb-4" style={{ color: '#94a3b8' }}>Choose the interface theme.</p><ThemeToggle /></section><section className="card overflow-hidden">{preferences.map(({ key, title, desc, icon: Icon }, index) => <div key={key} className="p-5 flex gap-3 items-center" style={{ borderTop: index ? '1px solid rgba(255,255,255,.07)' : undefined }}><span className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-300"><Icon size={17}/></span><span className="flex-1"><b className="text-sm text-white block">{title}</b><span className="text-xs" style={{ color: '#94a3b8' }}>{desc}</span></span><button onClick={() => update(key)} className="w-11 h-6 rounded-full p-0.5 transition-colors" style={{ background: values[key] ? '#6366f1' : '#334155' }} aria-pressed={values[key]}><span className="block w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: values[key] ? 'translateX(20px)' : 'translateX(0)' }}/></button></div>)}</section></div>
}
