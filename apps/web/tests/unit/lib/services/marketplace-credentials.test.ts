import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MarketplaceCredentialsService } from '@/lib/services/marketplace-credentials'

// Mock createClient
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  upsert: vi.fn(),
  delete: vi.fn(),
  match: vi.fn(),
  select: vi.fn(),
  eq: vi.fn()
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase))
}))

describe('MarketplaceCredentialsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('connectCredential should upsert encrypted data', async () => {
    mockSupabase.upsert.mockResolvedValue({ error: null })
    
    await MarketplaceCredentialsService.connectCredential(
      'user-123',
      'ebay',
      'encrypted-blob'
    )
    
    expect(mockSupabase.from).toHaveBeenCalledWith('marketplace_credentials')
    expect(mockSupabase.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        marketplace_type: 'ebay',
        credential_data: 'encrypted-blob',
        is_connected: true
      }),
      expect.any(Object)
    )
  })

  it('disconnectCredential should delete row', async () => {
    mockSupabase.delete.mockReturnValue(mockSupabase)
    mockSupabase.match.mockResolvedValue({ error: null })
    
    await MarketplaceCredentialsService.disconnectCredential(
      'user-123',
      'ebay'
    )
    
    expect(mockSupabase.from).toHaveBeenCalledWith('marketplace_credentials')
    expect(mockSupabase.delete).toHaveBeenCalled()
    expect(mockSupabase.match).toHaveBeenCalledWith({
      user_id: 'user-123',
      marketplace_type: 'ebay'
    })
  })
})
