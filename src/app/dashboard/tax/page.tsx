'use client'

import { useState } from 'react'
import { Calculator, ArrowRight, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react'

export default function TaxEnginePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    grossSalary: 1800000,
    otherDeductions80C: 150000,
    medical80D: 25000,
    hraExemption: 120000,
    homeLoanInterest24b: 200000,
  })

  const handleCompute = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/tax/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto fade-in h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">AI Tax Engine</h1>
        <p className="text-sm text-slate-400">Compute liabilities across Old and New regimes for AY 2025-26 instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card rounded-2xl p-8 border-t-2 border-emerald-500">
          <form onSubmit={handleCompute} className="space-y-6">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calculator size={16} /> Income & Deductions
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Gross Salary Income</label>
                <div className="relative">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="number" 
                    className="input w-full pl-9 bg-slate-900/50 border-slate-800 text-white focus:border-emerald-500 font-mono"
                    value={formData.grossSalary}
                    onChange={e => setFormData({...formData, grossSalary: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">80C Investments</label>
                  <input 
                    type="number" 
                    className="input w-full bg-slate-900/50 border-slate-800 text-white font-mono"
                    value={formData.otherDeductions80C}
                    onChange={e => setFormData({...formData, otherDeductions80C: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">80D Medical</label>
                  <input 
                    type="number" 
                    className="input w-full bg-slate-900/50 border-slate-800 text-white font-mono"
                    value={formData.medical80D}
                    onChange={e => setFormData({...formData, medical80D: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">HRA Exemption</label>
                  <input 
                    type="number" 
                    className="input w-full bg-slate-900/50 border-slate-800 text-white font-mono"
                    value={formData.hraExemption}
                    onChange={e => setFormData({...formData, hraExemption: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Home Loan Int. (24b)</label>
                  <input 
                    type="number" 
                    className="input w-full bg-slate-900/50 border-slate-800 text-white font-mono"
                    value={formData.homeLoanInterest24b}
                    onChange={e => setFormData({...formData, homeLoanInterest24b: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-4"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
            >
              {loading ? 'Computing...' : 'Run Tax Optimizer'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              <div className="card rounded-2xl p-6 bg-slate-900/80 border border-slate-800 relative overflow-hidden fade-in">
                {/* Winner Badge */}
                <div className="absolute -right-12 top-6 bg-emerald-500 text-white text-[10px] font-bold px-12 py-1 rotate-45 shadow-lg">
                  RECOMMENDED
                </div>

                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" /> Optimization Result
                </h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 mb-6">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Opt for</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {result.recommended} Regime
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Tax Savings</div>
                    <div className="text-xl font-bold text-white font-mono">
                      ₹{result.savings.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Old Regime Card */}
                  <div className={`p-4 rounded-xl border ${result.recommended === 'OLD' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
                    <div className="text-xs font-semibold text-slate-400 mb-4 flex items-center justify-between">
                      OLD REGIME
                      {result.recommended === 'OLD' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500">Taxable Income</div>
                        <div className="text-sm font-medium text-white font-mono">₹{result.oldRegime.taxableIncome.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Total Tax liability</div>
                        <div className="text-lg font-bold text-white font-mono">₹{result.oldRegime.tax.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>

                  {/* New Regime Card */}
                  <div className={`p-4 rounded-xl border ${result.recommended === 'NEW' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
                    <div className="text-xs font-semibold text-slate-400 mb-4 flex items-center justify-between">
                      NEW REGIME
                      {result.recommended === 'NEW' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500">Taxable Income</div>
                        <div className="text-sm font-medium text-white font-mono">₹{result.newRegime.taxableIncome.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Total Tax liability</div>
                        <div className="text-lg font-bold text-white font-mono">₹{result.newRegime.tax.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card rounded-2xl h-full min-h-[300px] flex items-center justify-center p-8 border-dashed border-slate-700 bg-slate-900/20">
              <div className="text-center text-slate-500">
                <Calculator size={32} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Enter client income and deductions on the left to compute the optimal tax regime.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
