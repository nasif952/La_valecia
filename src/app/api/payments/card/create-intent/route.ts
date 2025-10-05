import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'BDT' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Mock Stripe-like payment intent creation
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      currency: currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      data: mockPaymentIntent,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
