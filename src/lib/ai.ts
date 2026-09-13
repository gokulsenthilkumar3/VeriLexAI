import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const CA_SYSTEM_PROMPT = `You are VeriLex AI, an expert AI assistant for Indian audit, tax, and legal-compliance research.
You help with:
- Income tax computation (Old & New Regime)
- Capital gains tax (STCG/LTCG) for stocks, MF, real estate, crypto
- GST filing and compliance
- Investment advice and portfolio analysis
- Document analysis (Form 16, bank statements, ITR)
- Tax-saving strategies under sections 80C, 80D, 80G, 80CCD
- Deductions: HRA, LTA, standard deduction
- Audit planning, controls testing, evidence indexing, and exception documentation
- Legal-compliance research: identify relevant legal concepts, facts to collect, and matters that require a licensed advocate

Always be precise, cite relevant sections of the Income Tax Act, and provide actionable advice.
Format numbers in Indian number system (lakhs, crores).`

export async function askCA(userMessage: string, context?: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = []

  if (context) {
    messages.push({
      role: 'user',
      content: `Context: ${context}`,
    })
    messages.push({
      role: 'assistant',
      content: 'I have reviewed the context. How can I help?',
    })
  }

  messages.push({ role: 'user', content: userMessage })

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    system: CA_SYSTEM_PROMPT,
    messages,
  })

  return (response.content[0] as { type: string; text: string }).text
}

export async function suggestTaxSavings(income: number, currentDeductions: Record<string, number>) {
  const prompt = `Annual income: ₹${income.toLocaleString('en-IN')}
Current deductions: ${JSON.stringify(currentDeductions, null, 2)}

Suggest specific tax-saving opportunities for this FY with estimated savings amount for each.`

  return askCA(prompt)
}
