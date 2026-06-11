import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, Tag, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const recentProducts = products?.slice(-5).reverse() || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-foreground/70">Welcome to your admin panel. Manage your products and categories here.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Products */}
          <Card className="thor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">{totalProducts}</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    {totalProducts === 1 ? "1 product" : `${totalProducts} products`} in catalog
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Categories */}
          <Card className="thor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <Tag className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">{totalCategories}</div>
                  <p className="text-xs text-foreground/60 mt-1">
                    {totalCategories === 1 ? "1 category" : `${totalCategories} categories`} available
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="thor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <TrendingUp className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">
                    ₹{products && products.length > 0
                      ? (products.reduce((sum, p) => sum + parseFloat(p.price as any), 0) / products.length).toFixed(0)
                      : "0"}
                  </div>
                  <p className="text-xs text-foreground/60 mt-1">Average product price</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="thor-border">
          <CardHeader>
            <CardTitle>Recently Added Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : recentProducts.length === 0 ? (
              <p className="text-foreground/60 text-center py-8">No products added yet</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-foreground/60">₹{parseFloat(product.price as any).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inStock
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="thor-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70 text-sm mb-4">
              Use the navigation menu on the left to manage your products and categories.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> Go to Products to add, edit, or delete products
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> Go to Categories to manage product categories
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">→</span> Upload multiple images for each product
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
