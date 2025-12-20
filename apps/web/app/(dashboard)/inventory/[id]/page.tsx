import { InventoryForm } from "@/components/inventory/inventory-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Import createClient for server-side
// import { Metadata } from "next"; // No longer needed as generateMetadata is removed

export default async function AddOrEditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isEditMode = id !== "new"; // Assuming 'new' is the indicator for adding a new item

  let initialData = undefined;
  let pageTitle = "Add New Item";
  let cardTitle = "Item Details";
  let cardDescription =
    "Enter the details of the item you want to add to your inventory.";

  if (isEditMode) {
    const supabase = await createClient();
    const { data: itemData } = await supabase
      .from("items")
      .select("*, item_images(url)")
      .eq("id", id)
      .single();

    if (!itemData) {
      notFound(); // Item not found or error fetching
    }

    initialData = itemData; // Directly assign the fetched item data
    pageTitle = `Edit Item: ${initialData?.title || ""}`;
    cardTitle = "Edit Item Details";
    cardDescription = "Edit the details of your item.";
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm initialData={initialData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
