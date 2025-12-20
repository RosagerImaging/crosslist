import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function GET(request: NextRequest) {
  console.log("Received eBay notification challenge request");

  const { searchParams } = new URL(request.url);
  const challengeCode = searchParams.get("challenge_code");

  if (!challengeCode) {
    console.error("eBay challenge request missing challenge_code");
    return NextResponse.json(
      { error: "challenge_code query parameter is required" },
      { status: 400 },
    );
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  const endpoint = process.env.EBAY_ENDPOINT_URL;

  if (!verificationToken || !endpoint) {
    console.error(
      "Missing EBAY_VERIFICATION_TOKEN or EBAY_ENDPOINT_URL environment variables",
    );
    return NextResponse.json(
      { error: "Server configuration missing for eBay notifications" },
      { status: 500 },
    );
  }

  try {
    // Hash the values in the required order: challengeCode + verificationToken + endpoint
    const hash = createHash("sha256");
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpoint);
    const responseHash = hash.digest("hex");

    console.log("Successfully generated challenge response hash");

    // Respond to eBay with the hash in the specified JSON format
    const challengeResponse = {
      challengeResponse: responseHash,
    };

    return new NextResponse(JSON.stringify(challengeResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating SHA256 hash:", error);
    return NextResponse.json(
      { error: "Failed to compute challenge response" },
      { status: 500 },
    );
  }
}
