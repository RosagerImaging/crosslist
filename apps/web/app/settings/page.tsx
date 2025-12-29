import { MarketplaceConnectionCard } from "@/components/marketplace/connection-card";
import { createClient } from "@/lib/supabase/server";
import { MarketplaceCredentialsService } from "@/lib/services/marketplace-credentials";
import { redirect } from "next/navigation";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial connection status
  let status: Record<string, boolean> = { ebay: false, poshmark: false };
  try {
    status = await MarketplaceCredentialsService.getConnectionStatus(user.id);
  } catch (error) {
    console.error("Failed to fetch marketplace status:", error);
    // Non-blocking, default to false
  }

  // Get success/error messages from query parameters
  const params = await searchParams;
  const successMessage = params.success;
  const errorMessage = params.error;

  // Refetch status if we have a success parameter (OAuth redirect completed)
  if (successMessage) {
    // Wait a moment for the database write to complete, then refetch
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      status = await MarketplaceCredentialsService.getConnectionStatus(user.id);
    } catch (error) {
      console.error("Failed to refetch marketplace status:", error);
      // Non-blocking, keep existing status
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800 font-medium">
              {successMessage === "ebay_connected"
                ? "eBay account connected successfully!"
                : "Action completed successfully!"}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-red-800 font-medium">
                {errorMessage === "ebay_auth_failed"
                  ? "Failed to connect eBay account"
                  : errorMessage === "no_code"
                    ? "No authorization code received from eBay"
                    : errorMessage === "config_missing"
                      ? "eBay configuration is missing"
                      : errorMessage === "token_exchange_failed"
                        ? "Failed to exchange authorization code"
                        : errorMessage === "not_authenticated"
                          ? "You must be logged in to connect marketplaces"
                          : errorMessage === "db_error"
                            ? "Failed to save connection"
                            : "An unexpected error occurred"}
              </p>
              {errorMessage !== "ebay_auth_failed" && (
                <p className="text-red-600 text-sm mt-1">
                  Please try again or contact support if the issue persists.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Marketplace Connections
          </h2>
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
  );
}
