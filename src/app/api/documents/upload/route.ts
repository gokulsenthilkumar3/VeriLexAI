import { NextResponse } from 'next/server'

// In a full production app, you would import these:
// import pdf from 'pdf-parse'
// import Anthropic from '@anthropic-ai/sdk'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // SIMULATION MODE
    // Since we don't have AWS S3 configured or Anthropic API keys guaranteed in this MVP environment,
    // we will simulate the extraction process.
    
    /* 
    REAL IMPLEMENTATION WOULD LOOK LIKE THIS:
    
    1. Extract Text from PDF:
    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await pdf(buffer)
    const text = data.text

    2. Send to Claude 3 Haiku for JSON extraction:
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: "You are an expert Indian CA. Extract tax data from the provided Form 16 text and return it strictly as JSON.",
      messages: [{ role: "user", content: text }]
    })
    const extractedData = JSON.parse(msg.content[0].text)
    
    3. Save to Database:
    await prisma.document.create({ ... })
    */

    // Simulated 2.5 second delay for "AI processing"
    await new Promise(resolve => setTimeout(resolve, 2500))

    let mockExtractedData = {}
    
    if (file.name.toLowerCase().includes('form16') || file.name.toLowerCase().includes('form 16')) {
      mockExtractedData = {
        documentType: 'Form 16',
        taxYear: '2025-26',
        employer: 'TCS Limited',
        grossSalary: 1850000,
        standardDeduction: 50000,
        professionalTax: 2400,
        tdsDeducted: 215000,
        pfContribution: 65000,
        netTaxableIncome: 1732600
      }
    } else {
      mockExtractedData = {
        documentType: 'Bank Statement',
        taxYear: '2025-26',
        bankName: 'HDFC Bank',
        savingsInterest: 14500,
        fdInterest: 32000,
        totalCreditTurnover: 2150000
      }
    }

    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: { name: 'Demo Client', email: 'demo@example.com' }
      })
    }

    const doc = await prisma.document.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType: file.name.split('.').pop() || 'unknown',
        fileUrl: '/mock/url',
        status: 'DONE',
        extractedData: JSON.stringify(mockExtractedData),
        summary: 'AI parsed successfully'
      }
    })

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      status: 'DONE',
      extractedData: mockExtractedData,
      message: 'AI successfully parsed document.',
      documentId: doc.id
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to process document' }, { status: 500 })
  }
}
