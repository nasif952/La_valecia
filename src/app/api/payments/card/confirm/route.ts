import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { payment_intent_id, payment_method } = await request.json()

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Mock payment confirmation
    // In a real implementation, this would communicate with Stripe
    const mockResult = {
      id: payment_intent_id,
      status: 'succeeded',
      amount_received: payment_method.amount,
      currency: 'bdt',
      created: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      data: mockResult,
    })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
