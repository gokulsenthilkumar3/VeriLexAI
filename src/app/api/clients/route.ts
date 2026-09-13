import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const requested = new URL(request.url).searchParams.get('workspace')
    const workspace = requested === 'LEGAL' || requested === 'WEALTH' ? requested : 'AUDIT'
    const clients = await prisma.user.findMany({
      where: { role: 'TAXPAYER', ...(workspace === 'AUDIT' ? { auditEngagements: { some: {} } } : workspace === 'WEALTH' ? { wealthScenarios: { some: {} } } : { legalMatters: { some: {} } }) },
      orderBy: { createdAt: 'desc' },
      include: {
        documents: {
          select: { id: true, status: true, fileType: true }
        },
        taxReturns: {
          select: { id: true, taxYear: true, status: true }
        }
      }
    })
    const mappedClients = clients.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      pan: c.pan || 'N/A',
      status: 'Active', // Mocking status logic based on returns
      docs: c.documents.length
    }))
    
    return NextResponse.json(mappedClients)
  } catch (error) {
    console.error('Failed to fetch clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, pan, aadhaar, workspace = 'AUDIT' } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const clientWorkspace = workspace === 'LEGAL' || workspace === 'WEALTH' ? workspace : 'AUDIT'
    const newClient = await prisma.user.upsert({
      where: { email },
      create: {
        name,
        email,
        phone,
        pan,
        aadhaar,
        role: 'TAXPAYER',
        workspace: clientWorkspace,
        // In a real app, caId would be extracted from the authenticated user's session
      },
      update: { name, phone, pan, aadhaar }
    })

    if (clientWorkspace === 'AUDIT') {
      await prisma.auditEngagement.create({ data: { userId: newClient.id, title: `${name} — Statutory audit`, financialYear: '2025–26' } })
    } else if (clientWorkspace === 'WEALTH') {
      await prisma.wealthScenario.create({ data: { userId: newClient.id, title: `${name} — Personal wealth plan` } })
    } else {
      await prisma.legalMatter.create({ data: { userId: newClient.id, reference: `VL-${Date.now().toString().slice(-6)}`, title: `${name} — Initial legal review`, practiceArea: 'General compliance' } })
    }
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Failed to create client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
