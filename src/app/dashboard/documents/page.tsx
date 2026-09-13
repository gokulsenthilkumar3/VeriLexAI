'use client'

import { useState, useRef } from 'react'
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle, X } from 'lucide-react'

type ParsedData = Record<string, string | number>

type UploadedDoc = {
  id: string
  name: string
  size: number
  status: 'processing' | 'done' | 'error'
  data?: ParsedData
}

export default function DocumentsPage() {
  const [dragActive, setDragActive] = useState(false)
  const [docs, setDocs] = useState<UploadedDoc[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const docId = Math.random().toString(36).substring(7)
    
    // Add to list as processing
    setDocs(prev => [{
      id: docId,
      name: file.name,
      size: file.size,
      status: 'processing'
    }, ...prev])

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await res.json()

      if (res.ok) {
        setDocs(prev => prev.map(d => 
          d.id === docId 
            ? { ...d, status: 'done', data: result.extractedData }
            : d
        ))
      } else {
        throw new Error(result.error)
      }
    } catch (e) {
      setDocs(prev => prev.map(d => 
        d.id === docId ? { ...d, status: 'error' } : d
      ))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="p-6 md:p-10 fade-in h-full flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Document Intake Hub</h1>
        <p className="text-sm text-slate-400">Upload Form 16s, AIS, or Bank Statements. Our AI extracts and validates data automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            className={`card rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-600'
            }`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0])
                }
              }}
            />
            
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={28} />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">Drop documents here</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Supports PDF, Excel, and images up to 10MB.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary py-2.5 px-6 mx-auto inline-flex items-center gap-2"
            >
              <FileText size={16} /> Browse Files
            </button>
          </div>

          {/* List of uploaded documents */}
          {docs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recent Uploads</h3>
              {docs.map(doc => (
                <div key={doc.id} className="card p-4 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                      doc.status === 'done' ? 'bg-emerald-500/20 text-emerald-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {doc.status === 'processing' ? <Loader2 size={20} className="animate-spin" /> : 
                       doc.status === 'done' ? <FileText size={20} /> : 
                       <AlertCircle size={20} />}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm mb-0.5">{doc.name}</div>
                      <div className="text-xs text-slate-500">{(doc.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {doc.status === 'processing' && (
                      <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <Sparkles size={12} /> AI Parsing...
                      </span>
                    )}
                    {doc.status === 'done' && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Extracted
                      </span>
                    )}
                    <button className="text-slate-600 hover:text-red-400 transition-colors p-1" onClick={() => setDocs(docs.filter(d => d.id !== doc.id))}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Extraction Preview */}
        <div className="lg:col-span-1">
          <div className="card rounded-2xl p-6 h-full border-indigo-500/20 sticky top-24" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.05), transparent)' }}>
            <div className="flex items-center gap-2 text-indigo-400 mb-6">
              <Sparkles size={20} />
              <h3 className="font-bold text-white">AI Data Viewer</h3>
            </div>
            
            {docs.filter(d => d.status === 'done').length > 0 ? (
              <div className="space-y-6">
                {docs.filter(d => d.status === 'done').slice(0, 1).map(doc => (
                  <div key={`data-${doc.id}`} className="space-y-4 fade-in">
                    <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
                      Extracted from: <span className="text-white font-medium">{doc.name}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(doc.data || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-end">
                          <span className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-medium text-white font-mono text-right">
                            {typeof val === 'number' && key.toLowerCase().includes('income') || key.toLowerCase().includes('salary') || key.toLowerCase().includes('tax') || key.toLowerCase().includes('deduct') ? `₹${val.toLocaleString('en-IN')}` : val}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full mt-4 py-2 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                      Send to Tax Engine
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center mb-3 text-slate-600">
                  <FileText size={20} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Upload a document to see AI-extracted intelligence here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
