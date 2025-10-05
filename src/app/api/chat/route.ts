import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Return mock response when OpenAI is not configured
      return NextResponse.json({
        success: true,
        data: {
          message: getMockResponse(message),
          conversationId: conversationId || `conv_${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Real OpenAI integration would go here
    // For now, we'll use the mock response
    const response = await getOpenAIResponse(message, openaiApiKey)

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Product search responses
  if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('buy')) {
    return "I'd be happy to help you find products! You can browse our catalog at /catalog or search for specific items like 'Drop Shoulder hoodies' or 'Wintery jackets'. What are you looking for?"
  }

  // Size guide responses
  if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
    return "For sizing information, please check our size guide at /size-guide. Our Drop Shoulder collection typically runs oversized, while our Wintery collection has a regular fit. If you need specific measurements, feel free to ask!"
  }

  // Shipping responses
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship')) {
    return "We offer free shipping on orders over ৳500! Standard delivery takes 3-5 business days within Bangladesh. For more details, check our shipping information at /shipping."
  }

  // Returns responses
  if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
    return "We have a 30-day return policy! Items must be in original condition with tags attached. For returns and exchanges, please visit /returns or contact our customer service."
  }

  // Payment responses
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('bkash')) {
    return "We accept both credit/debit cards and bKash payments. All payments are processed securely. You can choose your preferred payment method at checkout."
  }

  // General greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to La Valecia! I'm here to help you with any questions about our premium apparel, sizing, shipping, or anything else. How can I assist you today?"
  }

  // Help responses
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! I can assist you with product information, sizing, shipping, returns, and general questions about La Valecia. What would you like to know?"
  }

  // Default response
  return "Thanks for your message! I'm a customer service assistant for La Valecia. I can help you with product information, sizing, shipping, returns, and general questions. How can I assist you today?"
}

async function getOpenAIResponse(message: string, apiKey: string): Promise<string> {
  try {
    // This is where you would integrate with OpenAI API
    // For now, we'll return the mock response
    return getMockResponse(message)
    
    // Example OpenAI integration (commented out):
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful customer service assistant for La Valecia, a premium apparel brand. Help customers with product information, sizing, shipping, returns, and general questions. Be friendly and professional.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
    */
  } catch (error) {
    console.error('OpenAI API error:', error)
    return getMockResponse(message)
  }
}

// Product search function for future use
async function searchProducts(query: string) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(5)

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
