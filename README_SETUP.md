# Bhat Imported Clothes - Admin Panel Setup Guide

## Project Overview

This is a professional admin panel for managing the Bhat Imported Clothes inventory. It features:

- **Admin Dashboard**: Real-time statistics and quick actions
- **Product Management**: Add, edit, delete products with multi-image uploads
- **Category Management**: Organize products into categories
- **Inventory Tracking**: Monitor stock levels and product status
- **Professional UI**: Thor-inspired dark theme with electric blue accents
- **Secure Authentication**: Role-based access control for admin-only access

## Tech Stack

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express.js + tRPC + Node.js
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Manus OAuth
- **Storage**: S3-compatible file storage for product images
- **Testing**: Vitest

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MySQL database
- Manus OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ddamik331-byte/Bhat-backend-final.git
   cd Bhat-backend-final
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required variables (see DEPLOYMENT.md)

4. **Set up database**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Access the admin panel**
   - Open http://localhost:3000
   - Log in with your Manus account (must be admin)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Admin pages (Dashboard, Products, Categories)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── index.css      # Global styles with Thor theme
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── routers/           # tRPC procedures for products/categories
│   ├── db.ts              # Database queries
│   └── _core/             # Authentication and core utilities
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

## Key Features

### Admin Dashboard
- Total products count
- Total categories count
- Average product price
- Recently added products
- Quick action buttons
- Getting started guide

### Product Management
- Create products with title, description, price, category
- Upload multiple images per product
- Edit product details and images
- Delete products with confirmation
- Track stock status (In Stock / Out of Stock)
- View product images in a gallery

### Category Management
- Create new categories
- Edit category details
- Delete categories
- Organize products by category

## Database Schema

### Products Table
- id (Primary Key)
- title (String)
- description (Text)
- price (Decimal)
- categoryId (Foreign Key)
- stock (Integer)
- inStock (Boolean)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Categories Table
- id (Primary Key)
- name (String, Unique)
- description (Text)
- slug (String, Unique)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Product Images Table
- id (Primary Key)
- productId (Foreign Key)
- imageUrl (String)
- storageKey (String)
- order (Integer)
- createdAt (Timestamp)

## API Endpoints

All API calls go through tRPC at `/api/trpc`:

### Products
- `products.list` - Get all products
- `products.create` - Create new product
- `products.update` - Update product
- `products.delete` - Delete product
- `products.uploadImage` - Upload product image
- `products.reorderImages` - Reorder product images
- `products.deleteImage` - Delete product image

### Categories
- `categories.list` - Get all categories
- `categories.create` - Create new category
- `categories.update` - Update category
- `categories.delete` - Delete category

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

## Testing

Run all tests:
```bash
pnpm test
```

Tests include:
- Authentication flow
- Product CRUD operations
- Category management
- Authorization checks

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Color Scheme (Thor-Inspired)

- **Primary Background**: Dark Navy (#0f1419)
- **Primary Accent**: Electric Blue (#3b82f6)
- **Secondary**: Silver (#c0c0c0)
- **Text**: Light Gray (#e5e7eb)

## Security Features

- ✅ Admin-only access control
- ✅ Role-based authorization
- ✅ Secure session management
- ✅ CSRF protection
- ✅ Input validation
- ✅ Confirmation dialogs for destructive actions

## Performance Optimizations

- Lazy-loaded components
- Optimized image storage with S3
- Database query optimization
- CSS-in-JS with Tailwind
- Minified production builds

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check MySQL server is running
- Ensure database exists and is accessible

### Authentication Failed
- Verify VITE_APP_ID is correct
- Check OWNER_OPEN_ID matches your account
- Ensure OAuth credentials are valid

## Contributing

To add new features:
1. Create a new branch
2. Add database schema changes in `drizzle/schema.ts`
3. Generate migrations: `pnpm drizzle-kit generate`
4. Add tRPC procedures in `server/routers/`
5. Create React components in `client/src/`
6. Write tests in `server/*.test.ts`
7. Submit a pull request

## License

MIT

## Support

For issues or questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review error logs in your hosting platform
3. Check Manus documentation for OAuth issues
4. Verify database connectivity

## Version

Current: 1.0.0
Last Updated: June 2026
