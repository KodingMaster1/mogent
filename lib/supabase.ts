import { createClient } from '@supabase/supabase-js'

// Supabase configuration with your credentials
const supabaseUrl = 'https://xuodlnombdgnzwtclxam.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b2Rsbm9tYmRnbnp3dGNseGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODE5MjAsImV4cCI6MjA3MTg1NzkyMH0.fgnnYB0AMlF-CW54oamCi28jM2iFuXgrrT4LokWssQ0'

// Check if environment variables are set (fallback to hardcoded values)
const finalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
const finalSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey

if (!finalSupabaseUrl || !finalSupabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Database features will be disabled.')
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = finalSupabaseUrl && finalSupabaseAnonKey 
  ? createClient(finalSupabaseUrl, finalSupabaseAnonKey)
  : null

export interface Invoice {
  id?: string
  customer_name: string
  customer_address: string
  customer_country: string
  invoice_date: string
  proforma_no: string
  tin_no: string
  items: InvoiceItem[]
  subtotal: number
  vat: number
  total: number
  remarks: string
  account_name: string
  account_no: string
  created_at?: string
}

export interface InvoiceItem {
  id?: string
  invoice_id?: string
  sn: number
  particulars: string
  qty: number
  unit: string
  price_per_unit: number
  total: number
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Mock data for when Supabase is not configured
export const mockData = {
  clients: [
    {
      id: '1',
      name: 'Hesu Investment Limited',
      email: 'info@hesu.co.tz',
      phone: '+255 123 456 789',
      address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      tin_number: '125-911-374',
      contact_person: 'John Doe',
      created_at: new Date().toISOString()
    }
  ],
  vendors: [
    {
      id: '1',
      name: 'Tech Supplies Ltd',
      email: 'info@techsupplies.co.tz',
      phone: '+255 987 654 321',
      address: '123 Business Street, Industrial Area',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      tin_number: '456-789-123',
      contact_person: 'Jane Smith',
      business_type: 'Technology Supplies',
      created_at: new Date().toISOString()
    }
  ],
  items: [
    {
      id: '1',
      name: 'Toner - 106A',
      description: 'HP LaserJet 106A Compatible Toner Cartridge',
      sku: 'TON-106A-001',
      category: 'Office Supplies',
      cost: 120000,
      price: 150000,
      stock_quantity: 50,
      min_stock_level: 10,
      vendor_id: '1',
      vendor_name: 'Tech Supplies Ltd',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Toner - 151A',
      description: 'HP LaserJet 151A Compatible Toner Cartridge',
      sku: 'TON-151A-001',
      category: 'Office Supplies',
      cost: 250000,
      price: 300000,
      stock_quantity: 30,
      min_stock_level: 5,
      vendor_id: '1',
      vendor_name: 'Tech Supplies Ltd',
      created_at: new Date().toISOString()
    }
  ],
  invoices: [
    {
      id: '1',
      customer_name: 'Hesu Investment Limited',
      customer_address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
      customer_country: 'Dar es Salaam, Tanzania',
      invoice_date: '2025-01-27',
      proforma_no: '152',
      tin_no: '125-911-374',
      subtotal: 840000,
      vat: 151200,
      total: 991200,
      remarks: 'Being sale of toners',
      account_name: 'MOGENT TANZANIA LIMITED',
      account_no: '0150691988500',
      created_at: new Date().toISOString(),
      items: [
        {
          id: '1',
          invoice_id: '1',
          sn: 1,
          particulars: 'Toner - 106A',
          qty: 2,
          unit: 'pcs',
          price_per_unit: 120000,
          total: 240000
        },
        {
          id: '2',
          invoice_id: '1',
          sn: 2,
          particulars: 'Toner - 151A',
          qty: 2,
          unit: 'pcs',
          price_per_unit: 300000,
          total: 600000
        }
      ]
    }
  ]
} 