import { GoogleGenerativeAI } from '@google/generative-ai'

// In a real production app, the key shouldn't be exposed directly in frontend
// or should use a secure backend proxy. For this prototype, we'll use an env var.
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

export interface AIParseResult {
  type: 'invoice' | 'quotation'
  customer?: {
    name?: string
    email?: string
    phone?: string
    company?: string
    address?: string
  }
  sender?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    country?: string
    website?: string
    taxId?: string
  }
  bank?: {
    accountName?: string
    accountNumber?: string
    iban?: string
    bankName?: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  taxRate?: number
  discount?: number
}

const SYSTEM_PROMPT = `You are a helpful AI assistant that extracts invoice and quotation details from natural language.
You must ALWAYS respond with valid JSON matching the following schema exactly. Do not wrap the JSON in markdown code blocks or add any other text.
Schema:
{
  "type": "invoice" | "quotation",
  "customer": {
    "name": "string (optional)",
    "company": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "address": "string (optional)"
  },
  "sender": {
    "name": "string (optional, company/sender name)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "address": "string (optional)",
    "country": "string (optional)",
    "website": "string (optional)",
    "taxId": "string (optional)"
  },
  "bank": {
    "accountName": "string (optional)",
    "accountNumber": "string (optional)",
    "iban": "string (optional)",
    "bankName": "string (optional)"
  },
  "items": [
    {
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "taxRate": "number (optional, defaults to 0 if not mentioned)",
  "discount": "number (optional, fixed amount discount)"
}
`

export const parseInvoicePrompt = async (prompt: string): Promise<AIParseResult> => {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Extract details from this request: "${prompt}"` }
    ])
    
    const responseText = result.response.text()
    // Clean up potential markdown formatting if the model disobeys instructions
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    return JSON.parse(cleanJson) as AIParseResult
  } catch (error) {
    console.error('Error parsing prompt with Gemini:', error)
    throw new Error('Failed to parse the request using AI. Please try again or fill manually.')
  }
}
