import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Try anon key first, then service role
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('=== Home Data API ===')
  console.log('URL:', supabaseUrl ? 'present' : 'missing')
  console.log('Key:', supabaseKey ? 'present' : 'missing')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing config')
    return NextResponse.json(
      { error: 'Missing Supabase configuration' },
      { status: 500 }
    )
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Fetch newest services first
    const { data: services } = await supabase
      .from('services')
      .select('*, profiles:provider_id (full_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(4)
    
    // Fetch newest open jobs first
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3)
    
    // Fetch positive reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, profiles:reviewee_id (full_name)')
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(3)
    
    console.log('Results - Services:', services?.length, 'Jobs:', jobs?.length, 'Reviews:', reviews?.length)
    
    return NextResponse.json({
      services: services || [],
      jobs: jobs || [],
      reviews: reviews || [],
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}