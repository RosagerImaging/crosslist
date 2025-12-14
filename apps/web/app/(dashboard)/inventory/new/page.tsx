import { InventoryForm } from "@/components/inventory/inventory-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Add New Item | Crosslist",
  description: "Add a new item to your inventory",
};

export default function AddItemPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Item</h2>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Enter the details of the item you want to add to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
