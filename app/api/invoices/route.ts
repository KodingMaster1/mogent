import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Invoice } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        message: 'Demo mode: Invoice would be created'
      })
    }

    const invoice: Invoice = await request.json()

    // Insert invoice into database
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        customer_name: invoice.customer_name,
        customer_address: invoice.customer_address,
        customer_country: invoice.customer_country,
        invoice_date: invoice.invoice_date,
        proforma_no: invoice.proforma_no,
        tin_no: invoice.tin_no,
        subtotal: invoice.subtotal,
        vat: invoice.vat,
        total: invoice.total,
        remarks: invoice.remarks,
        account_name: invoice.account_name,
        account_no: invoice.account_no,
      })
      .select()
      .single()

    if (invoiceError) {
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    // Insert invoice items
    const itemsToInsert = invoice.items.map(item => ({
      invoice_id: invoiceData.id,
      sn: item.sn,
      particulars: item.particulars,
      qty: item.qty,
      unit: item.unit,
      price_per_unit: item.price_per_unit,
      total: item.total,
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      invoice: { ...invoice, id: invoiceData.id } 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        invoices: [],
        message: 'Demo mode: No database connection'
      })
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ invoices })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 