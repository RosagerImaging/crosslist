"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { InventoryItem, useInventory } from "@/lib/hooks/use-inventory";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components
import { Loader2 } from "lucide-react"; // Import Loader2 for spinner

function InventoryActionsCell({ item }: { item: InventoryItem }) {
  const router = useRouter();
  const { deleteItem } = useInventory();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(item.id);
      // Optional: Show a toast notification
    } catch (error) {
      console.error("Failed to delete item:", error);
      // Optional: Show an error toast notification
    } finally {
      setIsDeleting(false);
    }
  };

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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(item.id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}`)}>
          Edit item
        </DropdownMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()} // Prevent DropdownMenu from closing
              className="text-destructive"
            >
              Delete item
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will soft delete your item.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
            <Image
              src={imageUrl}
              alt={row.getValue("title")}
              width={48}
              height={48}
              className="object-cover w-full h-full"
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
    cell: ({ row }) =>
      row.getValue("sku") || <span className="text-muted-foreground">-</span>,
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
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <InventoryActionsCell item={row.original} />,
  },
];
