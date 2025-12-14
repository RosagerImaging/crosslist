import { MarketplaceConnectionCard } from '@/components/marketplace/connection-card'
import { createClient } from '@/lib/supabase/server'
import { MarketplaceCredentialsService } from '@/lib/services/marketplace-credentials'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login') // Assuming login path
  }

  // Fetch initial connection status
  let status: Record<string, boolean> = { ebay: false, poshmark: false }
  try {
    status = await MarketplaceCredentialsService.getConnectionStatus(user.id)
  } catch (error) {
    console.error('Failed to fetch marketplace status:', error)
    // Non-blocking, default to false
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Marketplace Connections</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Connect your marketplace accounts to enable crosslisting features. 
            You will need to be logged in to each marketplace on this browser.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <MarketplaceConnectionCard 
              marketplace="ebay" 
              initialStatus={status.ebay} 
            />
            <MarketplaceConnectionCard 
              marketplace="poshmark" 
              initialStatus={status.poshmark} 
            />
          </div>
        </section>
      </div>
    </div>
  )
}
