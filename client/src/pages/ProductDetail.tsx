import { useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Loader2, Package, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!productId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <p className="text-foreground/70">Product not found</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <p className="text-foreground/70">Product not found</p>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="border-b border-primary/20 py-4">
        <div className="container">
          <button onClick={() => window.location.href = '/shop'} className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            Back to Shop
          </button>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-card aspect-square">
                {currentImage ? (
                  <img
                    src={currentImage.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <Package className="text-primary/50" size={64} />
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-background/80 text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg aspect-square border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-primary/20 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${product.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-display font-bold mb-4">{product.title}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ₹{parseFloat(product.price as any).toFixed(2)}
                  </span>
                  {product.inStock ? (
                    <span className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              {product.categoryId && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Category</h3>
                  <div className="inline-block px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-primary font-medium">Category #{product.categoryId}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg mb-3">Description</h3>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {product.description || "No description available"}
                </p>
              </div>

              {/* Stock Info */}
              <Card className="thor-border">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Available Stock:</span>
                      <span className="font-bold">{product.stock} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Status:</span>
                      <span className="font-bold">
                        {product.inStock ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <div className="space-y-3 pt-6 border-t border-primary/20">
                <Button
                  size="lg"
                  className="w-full glow-effect"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Contact for Purchase" : "Out of Stock"}
                </Button>
                <p className="text-sm text-foreground/70 text-center">
                  <strong>WhatsApp:</strong> +91-9103174217, 8899507736
                </p>
              </div>

              {/* Product Details Card */}
              <Card className="thor-border">
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-4">Product Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Product ID:</span>
                      <span className="font-mono">#{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Added:</span>
                      <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Images:</span>
                      <span>{images.length} photo{images.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
