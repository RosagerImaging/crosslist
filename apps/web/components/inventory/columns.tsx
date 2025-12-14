"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; // Note: might need to install badge
import { InventoryItem } from "@/lib/hooks/use-inventory";

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "item_images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.original.item_images;
      const imageUrl = images?.[0]?.url;

      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={row.getValue("title")}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.getValue("sku") || <span className="text-muted-foreground">-</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
 
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
        )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit item</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
