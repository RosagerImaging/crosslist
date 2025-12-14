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
   * Disconnects a marketplace by checking connection status to false (soft disconnect)
   * OR deleting the row. AC says "deletes credentials", so we should probably Delete
   * OR clear the credential_data and set is_connected=false.
   * The AC-2.3.9 says "deletes credentials from database". So we will DELETE.
   */
  static async disconnectCredential(
    userId: string,
    marketplace: MarketplaceType,
  ) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("marketplace_credentials")
      .delete()
      .match({ user_id: userId, marketplace_type: marketplace });

    if (error) {
      console.error("Error disconnecting marketplace credential:", error);
      throw new Error(`Failed to disconnect ${marketplace}: ${error.message}`);
    }
  }

  /**
   * Returns validation status for marketplaces.
   * DOES NOT return the actual credential data for security.
   */
  static async getConnectionStatus(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("marketplace_credentials")
      .select("marketplace_type, is_connected")
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
      statusMap[row.marketplace_type] = row.is_connected;
    });

    return statusMap;
  }
}
