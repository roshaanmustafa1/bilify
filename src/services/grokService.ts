import axios from 'axios';

// Using Groq API with LLaMA 3 for fast JSON extraction
const API_KEY = (import.meta as any).env.VITE_GROK_API_KEY || ''

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
You must ALWAYS respond with a valid JSON object matching the following schema exactly. Do not wrap the JSON in markdown code blocks or add any other text.
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
    "website": "string (optional)"
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

export const parseInvoicePrompt = (prompt: string): Promise<AIParseResult> => {
  return axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract details from this request: "${prompt}"` }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    const data = response.data;
    const responseText = data.choices?.[0]?.message?.content || '{}';
    
    // Clean up potential markdown formatting if the model disobeys instructions
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as AIParseResult;
  })
  .catch(error => {
    console.error('Error parsing prompt with Groq via Axios:', error);
    const errorMsg = error.response?.data?.error?.message || 'Failed to fetch from Groq API';
    return Promise.reject(new Error(errorMsg));
  });
}
