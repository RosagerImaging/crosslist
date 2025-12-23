import { NextRequest, NextResponse } from "next/server";

/**
 * Initiates the eBay OAuth flow by redirecting the user to eBay's authorization page
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.EBAY_CLIENT_ID;
  const redirectUri = process.env.EBAY_REDIRECT_URI;
  const ruName = process.env.EBAY_RU_NAME;

  if (!clientId || !redirectUri || !ruName) {
    console.error("Missing eBay OAuth configuration");
    return NextResponse.json(
      { error: "eBay OAuth is not configured" },
      { status: 500 },
    );
  }

  // Get the URL to redirect back to after OAuth completes
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/settings";

  // eBay OAuth authorization endpoint (production)
  // Use https://auth.sandbox.ebay.com/oauth2/authorize for sandbox
  const authUrl = new URL("https://auth.ebay.com/oauth2/authorize");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set(
    "scope",
    [
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.marketing",
      "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.inventory",
      "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.account",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    ].join(" "),
  );

  // Store return URL in state parameter for callback
  authUrl.searchParams.set("state", returnUrl);

  return NextResponse.redirect(authUrl.toString());
}
