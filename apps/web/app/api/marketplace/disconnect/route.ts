import { createClient } from '@/lib/supabase/server'
import { MarketplaceCredentialsService, MarketplaceType } from '@/lib/services/marketplace-credentials'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { marketplace } = body

    if (!marketplace) {
      return NextResponse.json(
        { error: 'Missing marketplace type' },
        { status: 400 }
      )
    }

    await MarketplaceCredentialsService.disconnectCredential(
      user.id,
      marketplace as MarketplaceType
    )

    return NextResponse.json({ success: true, connected: false })
  } catch (error: any) {
    console.error('API Error disconnecting marketplace:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
