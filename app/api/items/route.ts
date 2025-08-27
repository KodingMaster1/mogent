import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        items: [],
        message: 'Demo mode: No database connection'
      })
    }

    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        vendors(name)
      `)
      .order('name', { ascending: true })

    if (error) throw error

    // Transform data to include vendor name
    const transformedData = data?.map(item => ({
      ...item,
      vendor_name: item.vendors?.name
    })) || []

    return NextResponse.json({ items: transformedData })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        message: 'Demo mode: Item would be created'
      })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('items')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
} 