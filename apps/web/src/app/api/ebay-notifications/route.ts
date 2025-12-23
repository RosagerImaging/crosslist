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

export async function POST(request: NextRequest) {
  console.log("Received eBay marketplace account deletion notification");

  try {
    // Get the signature header for verification
    const signature = request.headers.get("x-ebay-signature");

    if (!signature) {
      console.warn(
        "eBay notification received without x-ebay-signature header",
      );
    }

    // Parse the notification payload
    const notification = await request.json();

    // Log notification details
    console.log("Notification ID:", notification.notification?.notificationId);
    console.log("Event Date:", notification.notification?.eventDate);
    console.log("User ID:", notification.notification?.data?.userId);
    console.log("Username:", notification.notification?.data?.username);
    console.log("EIAS Token:", notification.notification?.data?.eiasToken);

    // TODO: Verify signature using eBay's public key
    // See: https://developer.ebay.com/api-docs/commerce/notification/overview.html

    // TODO: Delete user data from database
    // const userId = notification.notification?.data?.userId;
    // await deleteUserData(userId);

    // Immediately acknowledge receipt per eBay requirements
    // Acceptable status codes: 200, 201, 202, 204
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error processing eBay notification:", error);

    // Still return 200 OK to acknowledge receipt even if processing fails
    // This prevents eBay from resending the notification
    // Log the error for manual review/retry
    return new NextResponse(null, { status: 200 });
  }
}
