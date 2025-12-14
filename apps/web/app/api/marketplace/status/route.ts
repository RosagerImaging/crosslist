import { createClient } from '@/lib/supabase/server'
import { MarketplaceCredentialsService } from '@/lib/services/marketplace-credentials'
import { NextResponse } from 'next/server'

// Force dynamic because we read cookies/auth
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = await MarketplaceCredentialsService.getConnectionStatus(user.id)

    return NextResponse.json({ success: true, status })
  } catch (error: any) {
    console.error('API Error fetching marketplace status:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
