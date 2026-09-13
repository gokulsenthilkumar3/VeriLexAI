import { NextResponse } from 'next/server'
import { askCA } from '@/lib/ai'
import { LEGAL_RESEARCH_DISCLAIMER } from '@/types/legal'

type Area = 'audit' | 'tax' | 'law'

const FALLBACKS: Record<Area, string> = {
  audit: `### Audit workplan\n\n1. Define the assertion and period under review.\n2. Preserve source documents and create an evidence index.\n3. Test the highest-risk items first and document exceptions.\n\n**Next best step:** share the document type, reporting period, and the control or transaction you want to examine.`,
  tax: `### Tax review checklist\n\n- Confirm the assessment year and taxpayer category.\n- Reconcile income and TDS against available statements.\n- Compare eligible deductions with supporting evidence before selecting a regime.\n\nThis is general information; confirm the final computation with the applicable law and filing portal.`,
  law: `### Legal-compliance research note\n\nStart by recording the facts, dates, parties, jurisdiction, and every supporting document. Identify the governing statute and any limitation period before taking action.\n\n${LEGAL_RESEARCH_DISCLAIMER}`,
}

export async function POST(request: Request) {
  try {
    const { message, area = 'audit' } = await request.json() as { message?: string; area?: Area }
    if (!message?.trim()) return NextResponse.json({ error: 'A question is required.' }, { status: 400 })
    if (!['audit', 'tax', 'law'].includes(area)) return NextResponse.json({ error: 'Unsupported workspace.' }, { status: 400 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ answer: FALLBACKS[area], source: 'guided' })
    }

    const context = area === 'law'
      ? 'You are assisting Indian audit and tax professionals with legal-compliance research. Provide general legal information only, label uncertainty, avoid fabricated citations, and add a concise licensed-advocate disclaimer.'
      : 'You are assisting an Indian chartered accountant. Be precise, show assumptions, and distinguish general guidance from a final filing or audit conclusion.'
    const answer = await askCA(`${context}\n\nWorkspace: ${area}.\nQuestion: ${message}`)
    return NextResponse.json({ answer, source: 'ai' })
  } catch {
    return NextResponse.json({ error: 'The assistant could not complete that request.' }, { status: 500 })
  }
}
