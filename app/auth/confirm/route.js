import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';

  // Supabase's default magic-link flow uses PKCE and appends `?code=...`
  // to the redirect URL after it verifies the link server-side.
  const code = searchParams.get('code');
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback: older/custom email templates that pass token_hash + type directly.
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Verification failed or params missing — send back to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=1`);
}