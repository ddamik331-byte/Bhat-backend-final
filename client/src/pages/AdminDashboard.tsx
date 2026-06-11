import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Package, Tag, TrendingUp, Loader2, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const recentProducts = products?.slice(-5).reverse() || [];
  const averagePrice = products && products.length > 0
    ? (products.reduce((sum, p) => sum + parseFloat(p.price as any), 0) / products.length).toFixed(0)
    : "0";

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-primary/20 pb-6">
          <h1 className="text-3xl font-display font-bold mb-2 text-foreground">Dashboard</h1>
          <p className="text-foreground/70">Welcome to Bhat Imported Clothes Admin Panel. Manage your inventory and categories.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Products */}
          <Card className="thor-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Total Products</CardTitle>
              <Package className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">{totalProducts}</div>
                  <p className="text-xs text-foreground/60 mt-2">
                    {totalProducts === 1 ? "1 product" : `${totalProducts} products`} in your catalog
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Categories */}
          <Card className="thor-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Total Categories</CardTitle>
              <Tag className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">{totalCategories}</div>
                  <p className="text-xs text-foreground/60 mt-2">
                    {totalCategories === 1 ? "1 category" : `${totalCategories} categories`} available
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="thor-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">Average Price</CardTitle>
              <TrendingUp className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Loader2 className="animate-spin text-primary" size={24} />
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">₹{averagePrice}</div>
                  <p className="text-xs text-foreground/60 mt-2">Average product price</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="thor-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => window.location.href = "/admin/products"}
                className="flex items-center gap-2 h-12"
              >
                <Plus size={20} />
                <span>Manage Products</span>
                <ArrowRight size={16} className="ml-auto" />
              </Button>
              <Button
                onClick={() => window.location.href = "/admin/categories"}
                variant="outline"
                className="flex items-center gap-2 h-12"
              >
                <Plus size={20} />
                <span>Manage Categories</span>
                <ArrowRight size={16} className="ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recently Added Products */}
        {recentProducts.length > 0 && (
          <Card className="thor-border">
            <CardHeader>
              <CardTitle className="text-lg">Recently Added Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.title}</p>
                      <p className="text-sm text-foreground/60">₹{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.inStock
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/admin/products?edit=${product.id}`}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started Guide */}
        <Card className="thor-border bg-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-foreground/80">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span>Go to <strong>Products</strong> to add your first product with images and details</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span>Create <strong>Categories</strong> to organize your products</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span>Upload multiple images per product for better presentation</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                <span>Set prices, descriptions, and stock status for each product</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
