import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

export type InventoryItem = Database["public"]["Tables"]["items"]["Row"] & {
  item_images: { url: string }[];
};

interface UseInventoryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useInventory({ page = 1, pageSize = 10, search = "" }: UseInventoryParams = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["inventory", page, pageSize, search],
    queryFn: async () => {
      let query = supabase
        .from("items")
        .select("*, item_images(url)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (search) {
        query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data as InventoryItem[],
        count: count || 0,
      };
    },
  });
}
