import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        vendors: [],
        message: 'Demo mode: No database connection'
      })
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ vendors: data || [] })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        message: 'Demo mode: Vendor would be created'
      })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('vendors')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ vendor: data })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
} 