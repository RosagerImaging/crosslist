import { createClient } from "@/lib/supabase/server";
import {
  MarketplaceCredentialsService,
  MarketplaceType,
} from "@/lib/services/marketplace-credentials";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { marketplace, credentials } = body;

    if (!marketplace || !credentials) {
      return NextResponse.json(
        { error: "Missing marketplace or credentials" },
        { status: 400 },
      );
    }

    // Validate marketplace type
    if (!["ebay", "poshmark"].includes(marketplace)) {
      return NextResponse.json(
        { error: "Invalid marketplace type" },
        { status: 400 },
      );
    }

    await MarketplaceCredentialsService.connectCredential(
      user.id,
      marketplace as MarketplaceType,
      credentials,
    );

    return NextResponse.json({ success: true, connected: true });
  } catch (error: unknown) {
    console.error("API Error connecting marketplace:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
