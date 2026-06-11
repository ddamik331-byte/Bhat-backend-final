import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImage,
  getProductImages,
  updateProductImageOrder,
  deleteProductImage,
} from "../db";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  /**
   * Get all products with their images
   */
  list: publicProcedure.query(async () => {
    const allProducts = await getProducts();
    const productsWithImages = await Promise.all(
      allProducts.map(async (product) => ({
        ...product,
        images: await getProductImages(product.id),
      }))
    );
    return productsWithImages;
  }),

  /**
   * Get a single product with all its images
   */
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const product = await getProductById(input.id);
    if (!product) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
    }
    const images = await getProductImages(product.id);
    return { ...product, images };
  }),

  /**
   * Create a new product (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        categoryId: z.number(),
        stock: z.number().min(0),
        inStock: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const result = await createProduct({
        title: input.title,
        description: input.description,
        price: input.price as any,
        categoryId: input.categoryId,
        stock: input.stock,
        inStock: input.inStock,
      });

      return result;
    }),

  /**
   * Update a product (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
        categoryId: z.number().optional(),
        stock: z.number().min(0).optional(),
        inStock: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const { id, ...data } = input;
      const updateData: any = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.inStock !== undefined) updateData.inStock = data.inStock;

      await updateProduct(id, updateData);
      return { success: true };
    }),

  /**
   * Delete a product (admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      // Delete all images associated with the product
      const images = await getProductImages(input.id);
      for (const image of images) {
        await deleteProductImage(image.id);
      }

      await deleteProduct(input.id);
      return { success: true };
    }),

  /**
   * Upload product image
   */
  uploadImage: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        filename: z.string(),
        data: z.string(), // base64 encoded image data
        order: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.data, "base64");

        // Upload to storage
        const { url, key } = await storagePut(
          `products/${input.productId}/${input.filename}`,
          buffer,
          "image/jpeg"
        );

        // Save image record to database
        await addProductImage({
          productId: input.productId,
          imageUrl: url,
          storageKey: key,
          order: input.order,
        });

        return { success: true, url, key };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  /**
   * Reorder product images
   */
  reorderImages: protectedProcedure
    .input(
      z.object({
        imageIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      for (let i = 0; i < input.imageIds.length; i++) {
        await updateProductImageOrder(input.imageIds[i], i);
      }

      return { success: true };
    }),

  /**
   * Delete a product image
   */
  deleteImage: protectedProcedure
    .input(z.object({ imageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      await deleteProductImage(input.imageId);
      return { success: true };
    }),
});
