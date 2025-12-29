import { createClient } from "@/lib/supabase/server";

export type MarketplaceType = "ebay" | "poshmark";

export interface MarketplaceCredential {
  id: string;
  user_id: string;
  marketplace_type: MarketplaceType;
  is_connected: boolean;
  created_at: string;
  updated_at: string;
}

export class MarketplaceCredentialsService {
  /**
   * Stores encrypted credentials for a user.
   * Upserts based on (user_id, marketplace_type).
   */
  static async connectCredential(
    userId: string,
    marketplace: MarketplaceType,
    encryptedData: string,
  ) {
    const supabase = await createClient();

    // We explicitly set is_connected to true on connect
    const { error } = await supabase.from("marketplace_credentials").upsert(
      {
        user_id: userId,
        marketplace_type: marketplace,
        credential_data: encryptedData,
        is_connected: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, marketplace_type" },
    );

    if (error) {
      console.error("Error connecting marketplace credential:", error);
      throw new Error(`Failed to connect ${marketplace}: ${error.message}`);
    }
  }

  /**
   * Disconnects a marketplace by deleting OAuth tokens from marketplace_connections table.
   * For OAuth marketplaces (eBay), tokens are stored in marketplace_connections.
   * For session-based marketplaces (Poshmark), credentials are in marketplace_credentials.
   */
  static async disconnectCredential(
    userId: string,
    marketplace: MarketplaceType,
  ) {
    const supabase = await createClient();

    // eBay uses OAuth (marketplace_connections table)
    // Poshmark uses session capture (marketplace_credentials table)
    const tableName =
      marketplace === "ebay"
        ? "marketplace_connections"
        : "marketplace_credentials";

    const matchColumn =
      marketplace === "ebay"
        ? { user_id: userId, marketplace }
        : { user_id: userId, marketplace_type: marketplace };

    const { error } = await supabase
      .from(tableName)
      .delete()
      .match(matchColumn);

    if (error) {
      console.error("Error disconnecting marketplace credential:", error);
      throw new Error(`Failed to disconnect ${marketplace}: ${error.message}`);
    }
  }

  /**
   * Returns validation status for marketplaces.
   * Checks OAuth connections from marketplace_connections table.
   */
  static async getConnectionStatus(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("marketplace_connections")
      .select("marketplace, is_active")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching connection status:", error);
      throw new Error(`Failed to fetch status: ${error.message}`);
    }

    // Transform into a map or list
    const statusMap: Record<string, boolean> = {
      ebay: false,
      poshmark: false,
    };

    data?.forEach((row) => {
      statusMap[row.marketplace] = row.is_active;
    });

    return statusMap;
  }
}
