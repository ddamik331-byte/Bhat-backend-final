import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../db";
import { TRPCError } from "@trpc/server";

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const categoriesRouter = router({
  /**
   * Get all categories
   */
  list: publicProcedure.query(async () => {
    return getCategories();
  }),

  /**
   * Get a single category
   */
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const category = await getCategoryById(input.id);
    if (!category) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
    }
    return category;
  }),

  /**
   * Create a new category (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const slug = generateSlug(input.name);

      try {
        const result = await createCategory({
          name: input.name,
          description: input.description,
          slug,
        });
        return result;
      } catch (error: any) {
        if (error.message.includes("UNIQUE")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Category name already exists",
          });
        }
        throw error;
      }
    }),

  /**
   * Update a category (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const { id, ...data } = input;
      const updateData: any = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
        updateData.slug = generateSlug(data.name);
      }
      if (data.description !== undefined) updateData.description = data.description;

      try {
        await updateCategory(id, updateData);
        return { success: true };
      } catch (error: any) {
        if (error.message.includes("UNIQUE")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Category name already exists",
          });
        }
        throw error;
      }
    }),

  /**
   * Delete a category (admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      await deleteCategory(input.id);
      return { success: true };
    }),
});
