import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Loader2, Zap, Package, Truck } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeIn">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                ⚡ Premium Imported Clothing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-balance">
              <span className="gradient-text">Thunder Threads</span>
              <br />
              <span className="text-foreground">Premium Quality. Affordable Price.</span>
            </h1>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Discover the finest imported clothing collection with authentic quality and unbeatable prices. Best quality clothing from around the world, delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glow-effect" onClick={() => window.location.href = '/shop'}>
              <Zap className="mr-2" size={20} />
              Shop Now
            </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t border-primary/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <Package className="text-primary" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Quality</h3>
              <p className="text-foreground/70">Premium imported clothing with authentic quality standards</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <Zap className="text-primary" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable Prices</h3>
              <p className="text-foreground/70">Get premium quality at unbeatable prices</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <Truck className="text-primary" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-foreground/70">Quick and reliable shipping to your location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Collection</h2>
            <p className="text-foreground/70">Explore our latest and most popular imported clothing</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <a className="group">
                    <Card className="overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-card h-64">
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
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              ₹{parseFloat(product.price as any).toFixed(2)}
                            </span>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/shop'}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/50 py-12">
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
