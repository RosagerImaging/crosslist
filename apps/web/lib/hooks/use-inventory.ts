import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../../types/supabase";

export type Item = Database["public"]["Tables"]["items"]["Row"]; // Define Item type from Database

export type InventoryItem = Item & {
  item_images: { url: string }[];
};

interface UseInventoryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  id?: string; // Add optional id for fetching a single item
}

export function useInventory({
  page = 1,
  pageSize = 10,
  search = "",
  id,
}: UseInventoryParams = {}) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ["inventory", page, pageSize, search, id], // Add id to queryKey
    queryFn: async () => {
      let query;

      if (id) {
        // Fetch single item
        query = supabase
          .from("items")
          .select("*, item_images(url)")
          .eq("id", id)
          .single(); // Use single() for a single record
      } else {
        // Fetch list of items
        query = supabase
          .from("items")
          .select("*, item_images(url)", { count: "exact" })
          .is("deleted_at", null) // Filter out soft-deleted items
          .order("created_at", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (search) {
          query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
        }
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      if (id) {
        return { data: data as InventoryItem }; // Return single item
      }

      return {
        data: data as InventoryItem[],
        count: count || 0,
      };
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({
      id,
      itemData,
    }: {
      id: string;
      itemData: Partial<Item>;
    }) => {
      const response = await fetch(`/api/inventory/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update item");
      }

      const result = await response.json();
      return result.data;
    },
    onMutate: async (newItem: { id: string; itemData: Partial<Item> }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["inventory", page, pageSize, search],
      });

      // Snapshot the previous value
      const previousInventory = queryClient.getQueryData([
        "inventory",
        page,
        pageSize,
        search,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["inventory", page, pageSize, search],
        (old: { data: InventoryItem[]; count: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item: InventoryItem) =>
              item.id === newItem.id ? { ...item, ...newItem.itemData } : item,
            ),
          };
        },
      );

      return { previousInventory };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(
        ["inventory", page, pageSize, search],
        context?.previousInventory,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", page, pageSize, search],
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete item");
      }

      return id; // Return the ID of the deleted item
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["inventory", page, pageSize, search],
      });

      const previousInventory = queryClient.getQueryData([
        "inventory",
        page,
        pageSize,
        search,
      ]);

      queryClient.setQueryData(
        ["inventory", page, pageSize, search],
        (old: { data: InventoryItem[]; count: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item: InventoryItem) => item.id !== id),
          };
        },
      );

      return { previousInventory };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(
        ["inventory", page, pageSize, search],
        context?.previousInventory,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", page, pageSize, search],
      });
    },
  });

  return {
    ...inventoryQuery,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
  };
}
