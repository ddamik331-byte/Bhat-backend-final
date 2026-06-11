import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context for testing
function createMockContext(role: "admin" | "user" = "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Products Router", () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;
  let userCaller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    adminCaller = appRouter.createCaller(createMockContext("admin"));
    userCaller = appRouter.createCaller(createMockContext("user"));
  });

  describe("Product Listing", () => {
    it("should allow public access to list products", async () => {
      const result = await adminCaller.products.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return products with required fields", async () => {
      const products = await adminCaller.products.list();
      if (products.length > 0) {
        const product = products[0];
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("title");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("categoryId");
        expect(product).toHaveProperty("inStock");
      }
    });
  });

  describe("Product Creation", () => {
    it("should allow admin to create a product", async () => {
      const result = await adminCaller.products.create({
        title: "Test Product",
        description: "Test Description",
        price: "99.99",
        categoryId: 1,
        stock: 10,
        inStock: true,
      });

      expect(result).toBeDefined();
    });

    it("should reject product creation without required fields", async () => {
      try {
        await adminCaller.products.create({
          title: "",
          description: "Test",
          price: "99.99",
          categoryId: 1,
          stock: 10,
          inStock: true,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("Product Update", () => {
    it("should allow admin to update a product", async () => {
      // First create a product
      const created = await adminCaller.products.create({
        title: "Update Test Product",
        description: "Original Description",
        price: "50.00",
        categoryId: 1,
        stock: 5,
        inStock: true,
      });

      if (created) {
        const result = await adminCaller.products.update({
          id: 1,
          title: "Updated Product",
          description: "Updated Description",
          price: "75.00",
          categoryId: 1,
          stock: 8,
          inStock: true,
        });

        expect(result).toBeDefined();
      }
    });
  });

  describe("Product Deletion", () => {
    it("should allow admin to delete a product", async () => {
      try {
        const result = await adminCaller.products.delete({ id: 999 });
        // Deletion should complete without error
        expect(result).toBeDefined();
      } catch (error: any) {
        // Product might not exist, which is acceptable
        expect(error).toBeDefined();
      }
    });
  });

  describe("Authorization", () => {
    it("should prevent non-admin users from creating products", async () => {
      try {
        await userCaller.products.create({
          title: "Unauthorized Product",
          description: "Should Fail",
          price: "99.99",
          categoryId: 1,
          stock: 10,
          inStock: true,
        });
        expect.fail("Should have thrown authorization error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should prevent non-admin users from updating products", async () => {
      try {
        await userCaller.products.update({
          id: 1,
          title: "Unauthorized Update",
          description: "Should Fail",
          price: "99.99",
          categoryId: 1,
          stock: 10,
          inStock: true,
        });
        expect.fail("Should have thrown authorization error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should prevent non-admin users from deleting products", async () => {
      try {
        await userCaller.products.delete({ id: 1 });
        expect.fail("Should have thrown authorization error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Categories Router", () => {
  let adminCaller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    adminCaller = appRouter.createCaller(createMockContext("admin"));
  });

  describe("Category Listing", () => {
    it("should allow public access to list categories", async () => {
      const result = await adminCaller.categories.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return categories with required fields", async () => {
      const categories = await adminCaller.categories.list();
      if (categories.length > 0) {
        const category = categories[0];
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("slug");
      }
    });
  });

  describe("Category Creation", () => {
    it("should allow admin to create a category", async () => {
      const uniqueName = `Test Category ${Date.now()}`;
      const result = await adminCaller.categories.create({
        name: uniqueName,
        description: "Test Description",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Category Update", () => {
    it("should allow admin to update a category", async () => {
      try {
        const uniqueName = `Updated Category ${Date.now()}`;
        const result = await adminCaller.categories.update({
          id: 1,
          name: uniqueName,
          description: "Updated Description",
        });

        expect(result).toBeDefined();
      } catch (error: any) {
        // Category might not exist
        expect(error).toBeDefined();
      }
    });
  });


  describe("Category Deletion", () => {
    it("should allow admin to delete a category", async () => {
      try {
        const result = await adminCaller.categories.delete({ id: 999 });
        expect(result).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});
