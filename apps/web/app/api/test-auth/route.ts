import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Initialize Supabase client
  // Using direct supabase-js here to explicitly verify the passed token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Verify the token
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    message: 'Authentication successful', 
    user: {
      id: user.id,
      email: user.email
    }
  });
}
