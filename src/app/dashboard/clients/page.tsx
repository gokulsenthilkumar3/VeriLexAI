'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, MoreVertical, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

type Client = {
  id: string
  name: string
  email: string
  pan: string
  status: string
  docs: number
}

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const workspace = searchParams.get('workspace') === 'LEGAL' ? 'LEGAL' : 'AUDIT'
  const workspaceLabel = workspace === 'LEGAL' ? 'Legal' : 'Audit'

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`/api/clients?workspace=${workspace}`)
        if (res.ok) {
          const data = await res.json()
          setClients(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [workspace])

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.pan.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{workspaceLabel} Client Roster</h1>
          <p className="text-sm text-slate-400">Manage only the clients assigned to the {workspaceLabel.toLowerCase()} workspace.</p>
        </div>
        <Link href={`/dashboard/clients/new?workspace=${workspace}`} className="btn-primary py-2 px-4 whitespace-nowrap flex items-center gap-2">
          <Plus size={16} /> Add {workspaceLabel} Client
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or PAN..." 
            className="input w-full pl-9 bg-slate-900/50 border-slate-800 text-white focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Showing {filteredClients.length} clients
        </div>
      </div>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden border border-slate-800 flex-1 min-h-[400px]">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">PAN / Aadhaar</th>
                <th className="px-6 py-4 font-medium">Documents</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      Loading clients...
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No clients found matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors cursor-pointer">
                        {client.name}
                      </div>
                      <div className="text-xs text-slate-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300 uppercase">
                      {client.pan}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <FileText size={14} className="text-slate-500" />
                        {client.docs} files
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider
                        ${client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                        ${client.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                        ${client.status === 'Review' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : ''}
                      `}>
                        {client.status === 'Active' && <CheckCircle2 size={12} />}
                        {client.status === 'Pending' && <Clock size={12} />}
                        {client.status === 'Review' && <AlertCircle size={12} />}
                        {client.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function ClientsPageWithSuspense() {
  return <Suspense fallback={<div className="p-10 text-sm" style={{ color: '#94a3b8' }}>Loading client roster…</div>}><ClientsPage /></Suspense>
}
