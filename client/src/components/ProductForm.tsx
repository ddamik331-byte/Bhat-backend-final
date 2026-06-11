import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { X, Upload, GripVertical, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { data: categories } = trpc.categories.list.useQuery();
  const createProductMutation = trpc.products.create.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const uploadImageMutation = trpc.products.uploadImage.useMutation();
  const deleteImageMutation = trpc.products.deleteImage.useMutation();

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    categoryId: product?.categoryId || "",
    stock: product?.stock || "0",
    inStock: product?.inStock ?? true,
  });

  const [images, setImages] = useState<any[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = async (event) => {
          const base64 = (event.target?.result as string).split(",")[1];
          if (!product?.id) {
            // For new products, store locally
            setImages((prev) => [
              ...prev,
              {
                id: Date.now() + i,
                imageUrl: event.target?.result,
                storageKey: "",
                order: prev.length,
                isNew: true,
                base64,
                filename: file.name,
              },
            ]);
          } else {
            // For existing products, upload immediately
            try {
              await uploadImageMutation.mutateAsync({
                productId: product.id,
                filename: file.name,
                data: base64,
                order: images.length,
              });
              toast.success("Image uploaded successfully");
            } catch (error: any) {
              toast.error("Failed to upload image");
            }
          }
        };

        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (product?.id && !images.find((img) => img.id === imageId)?.isNew) {
      try {
        await deleteImageMutation.mutateAsync({ imageId });
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      } catch (error: any) {
        toast.error("Failed to delete image");
      }
    } else {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (product?.id) {
        // Update existing product
        await updateProductMutation.mutateAsync({
          id: product.id,
          ...formData,
          categoryId: parseInt(formData.categoryId),
          stock: parseInt(formData.stock),
        });

        // Upload new images
        for (const img of images.filter((img) => img.isNew)) {
          await uploadImageMutation.mutateAsync({
            productId: product.id,
            filename: img.filename,
            data: img.base64,
            order: img.order,
          });
        }

        toast.success("Product updated successfully");
      } else {
        // Create new product
        await createProductMutation.mutateAsync({
          ...formData,
          categoryId: parseInt(formData.categoryId),
          stock: parseInt(formData.stock),
        });

        // Note: Images for new products should be uploaded after the product is created
        // For now, they will be stored locally and uploaded on next edit

        toast.success("Product created successfully. Add images by editing the product.");
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product?.id ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-input border border-primary/20 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md bg-input border border-primary/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">In Stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product Images</h3>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("image-input")?.click()}
            >
              <Upload className="mx-auto mb-2 text-primary" size={32} />
              <p className="font-medium mb-1">Click to upload images</p>
              <p className="text-sm text-foreground/60">or drag and drop</p>
              <input
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-foreground/70">{images.length} image{images.length !== 1 ? "s" : ""} selected</p>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.imageUrl}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-primary/20">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="glow-effect"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                product?.id ? "Update Product" : "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
