"use client";

import { useEffect, useState } from "react"; // Import useEffect
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/client";
import {
  insertItemSchema,
  type InsertItemValues,
} from "@/lib/schemas/inventory";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InventoryItem, useInventory } from "@/lib/hooks/use-inventory"; // Import InventoryItem and useInventory
import { useToast } from "@/lib/hooks/use-toast";

interface InventoryFormProps {
  initialData?: InventoryItem; // Add initialData prop
}

export function InventoryForm({ initialData }: InventoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // To handle existing images
  const supabase = createClient();
  const { updateItem } = useInventory(); // Get updateItem mutation

  const form = useForm({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      title: initialData?.title || "",
      price: Number(initialData?.price) || 0,
      condition: initialData?.condition || "new",
      sku: initialData?.sku || "",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        price: initialData.price,
        condition: initialData.condition,
        sku: initialData.sku || "",
        description: initialData.description,
      });
      setExistingImageUrls(
        initialData.item_images?.map((img: { url: string }) => img.url) || [],
      );
    }
  }, [initialData, form]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
      // TODO: Handle deletion of image from storage and database when implementing full delete functionality
    } else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  async function onSubmit(data: InsertItemValues) {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to create an item");
      }

      let currentItemId = initialData?.id;

      if (initialData) {
        // Update existing item
        if (!currentItemId) throw new Error("Item ID is missing for update");
        await updateItem({ id: currentItemId, itemData: data }); // Use the updateItem mutation
        // TODO: Handle image updates/deletions more robustly
      } else {
        // Create new item
        const { data: item, error: itemError } = await supabase
          .from("items")
          .insert({
            user_id: user.id,
            title: data.title,
            price: data.price,
            condition: data.condition,
            sku: data.sku || null, // Handle optional empty string as null
            description: data.description,
            status: "active", // Default to active for now
          })
          .select()
          .single();

        if (itemError) throw itemError;
        if (!item) throw new Error("Failed to create item");
        currentItemId = item.id;
      }

      // 2. Upload NEW Images & Create Image Records (only for newly selected images)
      if (selectedImages.length > 0 && currentItemId) {
        const imagePromises = selectedImages.map(async (file, index) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${currentItemId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("user-uploads")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

          return supabase.from("item_images").insert({
            item_id: currentItemId,
            url: publicUrl,
            order: existingImageUrls.length + index, // Append new images to the end
          });
        });

        await Promise.all(imagePromises);
      }

      toast({
        title: initialData ? "Item updated" : "Item created",
        description: `Your item has been ${initialData ? "updated" : "created"} successfully.`,
      });

      // Invalidate inventory cache to ensure fresh data on redirect
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });

      form.reset();
      setSelectedImages([]);
      setExistingImageUrls([]);
      router.push("/inventory");
      router.refresh();
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "InventoryForm",
          operation: initialData ? "update" : "create",
        },
        extra: {
          itemId: initialData?.id,
          formData: data,
          imageCount: selectedImages.length,
        },
      });
      console.error("Error submitting item:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} item. ${error instanceof Error ? error.message : "Please try again."}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Vintage Leather Jacket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value as number}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like_new">Like New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="for_parts">For Parts</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="A-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your item..."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Images</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {existingImageUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square bg-muted rounded-md overflow-hidden"
              >
                <Image
                  src={url}
                  alt="Existing Item Image"
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {selectedImages.map((file, index) => (
              <div
                key={`new-${index}`}
                className="relative aspect-square bg-muted rounded-md overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md hover:bg-muted/50 cursor-pointer">
              <Plus className="h-8 w-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-2">
                Add Image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
}
