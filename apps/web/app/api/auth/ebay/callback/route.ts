import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Handles the OAuth callback from eBay
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("eBay OAuth error:", error);
    const returnUrl = state || "/settings";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=ebay_auth_failed`,
    );
  }

  if (!code) {
    console.error("No authorization code received from eBay");
    const returnUrl = state || "/settings";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=no_code`,
    );
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  const redirectUri = process.env.EBAY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Missing eBay OAuth configuration");
    const returnUrl = state || "/settings";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=config_missing`,
    );
  }

  try {
    // Exchange authorization code for access token
    // Use https://api.sandbox.ebay.com/identity/v1/oauth2/token for sandbox
    const tokenResponse = await fetch(
      "https://api.ebay.com/identity/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Failed to exchange code for token:", errorData);
      const returnUrl = state || "/settings";
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=token_exchange_failed`,
      );
    }

    const tokenData = await tokenResponse.json();

    // Get the current user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No authenticated user found");
      const returnUrl = state || "/settings";
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=not_authenticated`,
      );
    }

    // Store eBay tokens in the database
    const { error: dbError } = await supabase
      .from("marketplace_connections")
      .upsert(
        {
          user_id: user.id,
          marketplace: "ebay",
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(
            Date.now() + tokenData.expires_in * 1000,
          ).toISOString(),
          token_type: tokenData.token_type,
          is_active: true,
        },
        {
          onConflict: "user_id,marketplace",
        },
      );

    if (dbError) {
      console.error("Failed to store eBay tokens:", dbError);
      const returnUrl = state || "/settings";
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=db_error`,
      );
    }

    console.log("Successfully stored eBay OAuth tokens for user:", user.id);

    // Redirect back to the return URL
    const returnUrl = state || "/settings";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?success=ebay_connected`,
    );
  } catch (error) {
    console.error("Error during eBay OAuth callback:", error);
    const returnUrl = state || "/settings";
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=unexpected`,
    );
  }
}
