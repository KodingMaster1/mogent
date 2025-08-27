import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        clients: [],
        message: 'Demo mode: No database connection'
      })
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ clients: data || [] })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        message: 'Demo mode: Client would be created'
      })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('clients')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ client: data })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
} 