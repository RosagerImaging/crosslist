import { vi, describe, it, expect, beforeEach } from "vitest";
import { PUT, DELETE } from "../../../../app/(dashboard)/inventory/[id]/route"; // Import DELETE
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Mock Supabase client
vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: vi.fn(),
}));

// Mock next/headers for cookies
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("PUT /api/inventory/items/[id]", () => {
  const mockSupabaseUpdate = vi.fn();
  const mockSupabaseFrom = vi.fn(() => ({
    update: mockSupabaseUpdate,
  }));
  const mockSupabaseEq = vi.fn(() => ({
    select: vi.fn(() => ({
      data: [{ id: "123", title: "Updated Item" }],
      error: null,
    })),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    (createRouteHandlerClient as vi.Mock).mockReturnValue({
      from: mockSupabaseFrom,
    });
    mockSupabaseUpdate.mockReturnValue({
      eq: mockSupabaseEq,
    });
  });

  it("should update an item successfully", async () => {
    const mockRequest = {
      json: () => Promise.resolve({ title: "Updated Item" }),
    } as Request;
    const mockParams = { params: { id: "123" } };

    const response = await PUT(mockRequest, mockParams);
    const data = await response.json();

    expect(createRouteHandlerClient).toHaveBeenCalledWith({ cookies });
    expect(mockSupabaseFrom).toHaveBeenCalledWith("items");
    expect(mockSupabaseUpdate).toHaveBeenCalledWith({ title: "Updated Item" });
    expect(mockSupabaseEq).toHaveBeenCalledWith("id", "123");
    expect(data.success).toBe(true);
    expect(data.data).toEqual([{ id: "123", title: "Updated Item" }]);
    expect(response.status).toBe(200);
  });

  it("should handle errors during item update", async () => {
    mockSupabaseEq.mockReturnValue({
      select: vi.fn(() => ({
        data: null,
        error: { message: "Database error" },
      })),
    });

    const mockRequest = {
      json: () => Promise.resolve({ title: "Updated Item" }),
    } as Request;
    const mockParams = { params: { id: "123" } };

    const response = await PUT(mockRequest, mockParams);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe("Database error");
    expect(response.status).toBe(500);
  });

  it("should handle exceptions during the process", async () => {
    mockSupabaseUpdate.mockImplementation(() => {
      throw new Error("Unexpected exception");
    });

    const mockRequest = {
      json: () => Promise.resolve({ title: "Updated Item" }),
    } as Request;
    const mockParams = { params: { id: "123" } };

    const response = await PUT(mockRequest, mockParams);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe("Unexpected exception");
    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/inventory/items/[id]", () => {
  const mockSupabaseUpdate = vi.fn();
  const mockSupabaseFrom = vi.fn(() => ({
    update: mockSupabaseUpdate,
  }));
  const mockSupabaseEq = vi.fn(() => ({
    select: vi.fn(() => ({ error: null })), // No data returned for delete
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    (createRouteHandlerClient as vi.Mock).mockReturnValue({
      from: mockSupabaseFrom,
    });
    mockSupabaseUpdate.mockReturnValue({
      eq: mockSupabaseEq,
    });
  });

  it("should soft-delete an item successfully", async () => {
    const mockRequest = {} as Request;
    const mockParams = { params: { id: "123" } };

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(createRouteHandlerClient).toHaveBeenCalledWith({ cookies });
    expect(mockSupabaseFrom).toHaveBeenCalledWith("items");
    expect(mockSupabaseUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String) }),
    );
    expect(mockSupabaseEq).toHaveBeenCalledWith("id", "123");
    expect(data.success).toBe(true);
    expect(data.message).toBe("Item 123 soft-deleted successfully.");
    expect(response.status).toBe(200);
  });

  it("should handle errors during item soft-delete", async () => {
    mockSupabaseEq.mockReturnValue({
      select: vi.fn(() => ({ error: { message: "Database delete error" } })),
    });

    const mockRequest = {} as Request;
    const mockParams = { params: { id: "123" } };

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe("Database delete error");
    expect(response.status).toBe(500);
  });

  it("should handle exceptions during the soft-delete process", async () => {
    mockSupabaseUpdate.mockImplementation(() => {
      throw new Error("Unexpected delete exception");
    });

    const mockRequest = {} as Request;
    const mockParams = { params: { id: "123" } };

    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe("Unexpected delete exception");
    expect(response.status).toBe(500);
  });
});
