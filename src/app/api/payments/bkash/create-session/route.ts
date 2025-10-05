import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'BDT', orderId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Mock bKash payment session creation
    // In a real implementation, this would communicate with bKash API
    const mockBKashSession = {
      paymentID: `BKASH_${Date.now()}`,
      status: 'initiated',
      amount: amount,
      currency: currency,
      orderId: orderId,
      redirectURL: `https://sandbox.pgw.bkash.com/checkout/payment/execute/${Date.now()}`,
      created: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockBKashSession,
    })
  } catch (error) {
    console.error('Error creating bKash session:', error)
    return NextResponse.json(
      { error: 'Failed to create bKash session' },
      { status: 500 }
    )
  }
}
