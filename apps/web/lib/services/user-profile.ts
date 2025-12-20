import { createClient } from "@/lib/supabase/client";
import { type Database } from "@/types/supabase";

export type Profile = Database["public"]["Tables"]["users"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["users"]["Update"];

export const UserProfileService = {
  async getProfile(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  },

  async updateProfile(userId: string, updates: ProfileUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};
