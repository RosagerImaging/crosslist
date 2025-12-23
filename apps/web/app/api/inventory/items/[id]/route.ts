import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const itemData = await request.json();

  if (itemData.sku === "") {
    itemData.sku = null;
  }

  const supabase = await createClient(); // This line should be here

  try {
    const { data, error } = await supabase
      .from("items")
      .update(itemData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating item:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error occurred";
    console.error("Exception updating item:", e);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("items")
      .update({ deleted_at: new Date().toISOString() }) // Soft delete by setting deleted_at
      .eq("id", id);

    if (error) {
      console.error("Error soft-deleting item:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Item ${id} soft-deleted successfully.`,
    });
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error occurred";
    console.error("Exception soft-deleting item:", e);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
