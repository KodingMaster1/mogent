import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// Mock company profile data for demo mode
const mockCompanyProfile = {
  id: '1',
  name: 'MOGENT TANZANIA LIMITED',
  address: 'Plot No. 311/3/4, Block T, Taifa Rd, P.O.Box 2465',
  city: 'Dar es Salaam',
  country: 'Tanzania',
  phone: '+255 22 286 0000',
  email: 'info@mogent.co.tz',
  website: 'www.mogent.co.tz',
  tin_number: '125-911-374',
  logo_url: '/api/placeholder/150/150',
  bank_name: 'CRDB Bank',
  bank_account: '0150691988500',
  bank_code: 'CRDBTZTZ',
  payment_terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export async function GET() {
  try {
    const supabase = createClient()
    
    if (!supabase) {
      // Demo mode - return mock data
      return NextResponse.json(mockCompanyProfile)
    }

    const { data, error } = await supabase
      .from('company_profile')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching company profile:', error)
      return NextResponse.json({ error: 'Failed to fetch company profile' }, { status: 500 })
    }

    return NextResponse.json(data || mockCompanyProfile)
  } catch (error) {
    console.error('Error in GET /api/company-profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    if (!supabase) {
      // Demo mode - simulate success
      return NextResponse.json({ 
        message: 'Company profile updated successfully (demo mode)',
        data: { ...mockCompanyProfile, ...body, updated_at: new Date().toISOString() }
      })
    }

    // Validate required fields
    const requiredFields = ['name', 'address', 'city', 'country', 'phone', 'email', 'bank_name', 'bank_account']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if company profile exists
    const { data: existingProfile } = await supabase
      .from('company_profile')
      .select('id')
      .single()

    let result
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('company_profile')
        .update({
          ...body,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating company profile:', error)
        return NextResponse.json({ error: 'Failed to update company profile' }, { status: 500 })
      }

      result = data
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('company_profile')
        .insert({
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating company profile:', error)
        return NextResponse.json({ error: 'Failed to create company profile' }, { status: 500 })
      }

      result = data
    }

    return NextResponse.json({ 
      message: 'Company profile updated successfully',
      data: result
    })
  } catch (error) {
    console.error('Error in POST /api/company-profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 