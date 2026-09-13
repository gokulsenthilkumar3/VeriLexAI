import { NextResponse } from 'next/server'

// Simple mock engine for AY 2025-26
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { 
      grossSalary = 0, 
      standardDeduction = 50000,
      otherDeductions80C = 0,
      medical80D = 0,
      hraExemption = 0,
      homeLoanInterest24b = 0,
    } = data

    // OLD REGIME CALCULATION
    const oldGross = grossSalary - hraExemption - standardDeduction
    const oldDeductions = Math.min(otherDeductions80C, 150000) + medical80D + Math.min(homeLoanInterest24b, 200000)
    let oldTaxable = Math.max(0, oldGross - oldDeductions)
    
    let oldTax = 0
    if (oldTaxable > 1000000) {
      oldTax = 112500 + ((oldTaxable - 1000000) * 0.3)
    } else if (oldTaxable > 500000) {
      oldTax = 12500 + ((oldTaxable - 500000) * 0.2)
    } else if (oldTaxable > 250000) {
      oldTax = (oldTaxable - 250000) * 0.05
    }
    // Rebate 87A
    if (oldTaxable <= 500000) oldTax = 0
    const oldCess = oldTax * 0.04
    const oldTotalTax = oldTax + oldCess

    // NEW REGIME CALCULATION (FY 2024-25)
    // Allows standard deduction of 50k
    const newGross = grossSalary - standardDeduction
    let newTaxable = Math.max(0, newGross)
    
    let newTax = 0
    if (newTaxable > 1500000) {
      newTax = 150000 + ((newTaxable - 1500000) * 0.3)
    } else if (newTaxable > 1200000) {
      newTax = 90000 + ((newTaxable - 1200000) * 0.2)
    } else if (newTaxable > 900000) {
      newTax = 45000 + ((newTaxable - 900000) * 0.15)
    } else if (newTaxable > 600000) {
      newTax = 15000 + ((newTaxable - 600000) * 0.1)
    } else if (newTaxable > 300000) {
      newTax = (newTaxable - 300000) * 0.05
    }
    // Rebate 87A
    if (newTaxable <= 700000) newTax = 0
    const newCess = newTax * 0.04
    const newTotalTax = newTax + newCess

    const recommended = newTotalTax <= oldTotalTax ? 'NEW' : 'OLD'
    const savings = Math.abs(oldTotalTax - newTotalTax)

    return NextResponse.json({
      success: true,
      oldRegime: {
        taxableIncome: oldTaxable,
        tax: oldTotalTax
      },
      newRegime: {
        taxableIncome: newTaxable,
        tax: newTotalTax
      },
      recommended,
      savings
    })

  } catch (error) {
    console.error('Tax engine error:', error)
    return NextResponse.json({ error: 'Failed to compute tax' }, { status: 500 })
  }
}
