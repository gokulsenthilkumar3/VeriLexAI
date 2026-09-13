'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, CreditCard, ShieldCheck, Loader2 } from 'lucide-react'

function NewClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedWorkspace = searchParams.get('workspace')
  const workspace = requestedWorkspace === 'LEGAL' || requestedWorkspace === 'WEALTH' ? requestedWorkspace : 'AUDIT'
  const workspaceLabel = workspace === 'LEGAL' ? 'Legal' : workspace === 'WEALTH' ? 'Wealth' : 'Audit'
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    aadhaar: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, workspace })
      })
      if (res.ok) {
        router.push(workspace === 'LEGAL' ? '/dashboard/legal' : workspace === 'WEALTH' ? '/dashboard/wealth' : '/dashboard/audit')
      } else {
        console.error('Failed to save client')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard" 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={18} className="text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Onboard {workspaceLabel} Client</h1>
          <p className="text-sm text-slate-400">This client will be visible only in the {workspaceLabel.toLowerCase()} portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="md:col-span-2 card p-8 rounded-2xl" style={{ borderTop: '2px solid #6366f1' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="input w-full bg-slate-900/50 border-slate-800 text-white focus:border-indigo-500"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      className="input w-full pl-9 bg-slate-900/50 border-slate-800 text-white focus:border-indigo-500"
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="tel" 
                      className="input w-full pl-9 bg-slate-900/50 border-slate-800 text-white focus:border-indigo-500"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-slate-800/50 my-8"></div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={16} /> Tax Identifiers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">PAN Number</label>
                  <input 
                    type="text" 
                    required
                    maxLength={10}
                    className="input w-full bg-slate-900/50 border-slate-800 text-white focus:border-emerald-500 uppercase font-mono text-sm"
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Aadhaar Number (Optional)</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    className="input w-full bg-slate-900/50 border-slate-800 text-white focus:border-emerald-500 font-mono text-sm"
                    placeholder="1234 5678 9012"
                    value={formData.aadhaar}
                    onChange={e => setFormData({...formData, aadhaar: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Creating Profile...</>
                ) : (
                  <>Add {workspaceLabel} Client</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-6 rounded-2xl bg-indigo-950/20 border-indigo-500/20">
            <ShieldCheck size={24} className="text-indigo-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Secure Onboarding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Client details are stored using AES-256 encryption. PAN data is validated format-wise, but we do not auto-sync with the income tax portal until you explicitly authorize an e-filing connection.
            </p>
          </div>
          
          <div className="card p-6 rounded-2xl bg-slate-900/40 border-slate-800/60">
            <h3 className="text-sm font-bold text-white mb-3">What happens next?</h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> A client profile is created in your workspace.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> You can instantly upload Form 16s and bank statements to their folder.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /> AI will automatically begin computing their capital gains and tax liabilities.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function NewClientPageWithSuspense() {
  return <Suspense fallback={<div className="p-10 text-sm" style={{ color: '#94a3b8' }}>Loading client onboarding…</div>}><NewClientPage /></Suspense>
}
