"use client";

import { useState } from "react";
import { InventoryItem, useInventory } from "@/lib/hooks/use-inventory";
import { columns } from "@/components/inventory/columns";
import { DataTable } from "@/components/inventory/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  // Debounce could be added here, but for now binding directly
  const { data, isLoading, isError } = useInventory({ search });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex items-center space-x-2">
          <Link href="/inventory/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter items..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border p-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : isError ? (
          <div className="text-destructive">Failed to load inventory</div>
        ) : (
          <DataTable
            columns={columns}
            data={(data?.data as InventoryItem[]) || []}
          />
        )}
      </div>
    </div>
  );
}
