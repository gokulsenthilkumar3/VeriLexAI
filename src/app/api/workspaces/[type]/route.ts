import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type WorkspaceType = 'audit' | 'legal'
const validType = (value: string): value is WorkspaceType => value === 'audit' || value === 'legal'

export async function GET(_request: Request, { params }: { params: { type: string } }) {
  if (!validType(params.type)) return NextResponse.json({ error: 'Unknown workspace.' }, { status: 404 })
  try {
    if (params.type === 'audit') {
      const [total, active, attention, items] = await Promise.all([
        prisma.auditEngagement.count(), prisma.auditEngagement.count({ where: { status: { not: 'COMPLETE' } } }),
        prisma.auditEngagement.count({ where: { riskLevel: 'HIGH', status: { not: 'COMPLETE' } } }),
        prisma.auditEngagement.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { updatedAt: 'desc' }, take: 50 }),
      ])
      return NextResponse.json({ total, active, attention, items })
    }
    const [total, active, attention, items] = await Promise.all([
      prisma.legalMatter.count(), prisma.legalMatter.count({ where: { status: { not: 'CLOSED' } } }),
      prisma.legalMatter.count({ where: { status: 'COUNSEL_REVIEW' } }),
      prisma.legalMatter.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { updatedAt: 'desc' }, take: 50 }),
    ])
    return NextResponse.json({ total, active, attention, items })
  } catch { return NextResponse.json({ total: 0, active: 0, attention: 0, items: [] }) }
}
