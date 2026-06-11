import { Link } from "wouter";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Loader2, Package, Search } from "lucide-react";

export default function Shop() {
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="border-b border-primary/20 py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Collection</h1>
          <p className="text-foreground/70 max-w-2xl">
            Browse our complete collection of premium imported clothing. Find the perfect style for you.
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="font-bold mb-3">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="font-bold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === null
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10 text-foreground/80"
                      }`}
                    >
                      All Products
                    </button>
                    {categoriesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-primary" size={20} />
                      </div>
                    ) : categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-primary/10 text-foreground/80"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-foreground/60 text-sm">No categories available</p>
                    )}
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <h3 className="font-bold mb-3">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-foreground/80">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Products */}
            <div className="lg:col-span-3">
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto mb-4 text-foreground/30" size={48} />
                  <h3 className="text-xl font-bold mb-2">No products found</h3>
                  <p className="text-foreground/70">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-foreground/70">
                      Showing <span className="font-bold text-primary">{filteredProducts.length}</span> product
                      {filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map((product) => (
                                        <div key={product.id} className="group cursor-pointer" onClick={() => window.location.href = `/product/${product.id}`}>
                      <Card className="overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
                            <CardContent className="p-0">
                              {/* Product Image */}
                              <div className="relative overflow-hidden bg-card h-72">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0].imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                    <Package className="text-primary/50" size={48} />
                                  </div>
                                )}
                                {product.inStock && (
                                  <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                    In Stock
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                  {product.title}
                                </h3>
                                <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                                  {product.description}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-2xl font-bold text-primary">
                                    ₹{parseFloat(product.price as any).toFixed(2)}
                                  </span>
                                  {product.stock > 0 && (
                                    <span className="text-xs text-foreground/60">
                                      {product.stock} in stock
                                    </span>
                                  )}
                                </div>
                                <Button className="w-full" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                      </Card>
                  </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/50 py-12 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-primary">Bhat Clothess</h4>
              <p className="text-foreground/70 text-sm">Premium imported clothing with authentic quality and affordable prices.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/"><a className="text-foreground/70 hover:text-primary transition-colors">Home</a></Link></li>
                <li><Link href="/shop"><a className="text-foreground/70 hover:text-primary transition-colors">Shop</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Information</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-foreground/70 text-sm">
                <strong>WhatsApp:</strong> +91-9103174217, 8899507736
                <br />
                <strong>Location:</strong> Singhpora pattan Near J&K Bank, Singhpora
              </p>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8 text-center text-foreground/60 text-sm">
            <p>&copy; 2026 Bhat Imported Clothess. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
