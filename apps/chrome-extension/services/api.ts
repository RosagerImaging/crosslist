import { decrypt } from './encryption';
import { Session } from '@supabase/supabase-js';

export async function getAuthSession(): Promise<Session | null> {
  try {
    const data = await chrome.storage.local.get(['supabase_session_encrypted']);
    const encrypted = data.supabase_session_encrypted;
    
    if (!encrypted) return null;
    
    const decrypted = await decrypt(encrypted);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted) as Session;
  } catch (error) {
    console.error('Failed to retrieve auth session:', error);
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const session = await getAuthSession();
  
  const headers = new Headers(options.headers);
  
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  
  const config = {
    ...options,
    headers
  };
  
  return fetch(url, config);
}
