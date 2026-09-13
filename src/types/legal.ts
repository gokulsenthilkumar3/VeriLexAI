/**
 * Shared legal-research contracts migrated from the legacy LexSense app.
 * They keep legal questions reviewable before a professional hand-off.
 */
export type LegalDomain =
  | 'criminal'
  | 'consumer'
  | 'property'
  | 'family'
  | 'labour'
  | 'constitutional'
  | 'cyber'
  | 'corporate'
  | 'other'

export type LegalResearchMode = 'citizen' | 'professional'

export interface LegalResearchRequest {
  rawInput: string
  mode: LegalResearchMode
  consentGiven: boolean
  attachments?: string[]
}

export interface LegalResearchBrief {
  id: string
  domains: LegalDomain[]
  factsToVerify: string[]
  jurisdictionHints: string[]
  questionsForCounsel: string[]
  disclaimer: string
  aiGenerated: true
  generatedAt: string
}

export const LEGAL_RESEARCH_DISCLAIMER =
  'VeriLex AI provides general legal information for education and compliance research only. It is not legal advice or a substitute for a licensed advocate.'
