# Deployment Guide - Bhat Imported Clothes Admin Panel

## Environment Variables Required

To deploy this application, you need to configure the following environment variables on your hosting platform (Vercel, Railway, etc.):

### Database Configuration
- **DATABASE_URL**: MySQL connection string
  - Format: `mysql://username:password@host:3306/database_name`
  - Required: Yes

### Authentication & Security
- **JWT_SECRET**: Secret key for session signing
  - Generate a strong random string (min 32 characters)
  - Required: Yes

### Manus OAuth Configuration
- **VITE_APP_ID**: Your Manus OAuth application ID
  - Required: Yes
- **OAUTH_SERVER_URL**: Manus OAuth server URL
  - Default: `https://api.manus.im`
  - Required: Yes
- **VITE_OAUTH_PORTAL_URL**: Manus login portal URL
  - Default: `https://login.manus.im`
  - Required: Yes

### Owner Information
- **OWNER_OPEN_ID**: Your Manus OpenID (admin user identifier)
  - Required: Yes
- **OWNER_NAME**: Your name
  - Required: Yes

### Manus Built-in APIs
- **BUILT_IN_FORGE_API_URL**: Manus API endpoint
  - Default: `https://api.manus.im`
  - Required: Yes
- **BUILT_IN_FORGE_API_KEY**: Server-side API key for Manus services
  - Required: Yes
- **VITE_FRONTEND_FORGE_API_URL**: Frontend API endpoint
  - Default: `https://api.manus.im`
  - Required: Yes
- **VITE_FRONTEND_FORGE_API_KEY**: Frontend API key
  - Required: Yes

### Analytics (Optional)
- **VITE_ANALYTICS_ENDPOINT**: Analytics service endpoint
- **VITE_ANALYTICS_WEBSITE_ID**: Website ID for analytics tracking

## Deployment Steps

### 1. Vercel Deployment
```bash
# Connect your GitHub repository to Vercel
# Vercel will automatically detect the project configuration

# Add environment variables in Vercel Dashboard:
# Settings → Environment Variables → Add all required variables
```

### 2. Railway Deployment
```bash
# Connect your GitHub repository
# Add environment variables in Railway Dashboard
# Deploy from the main branch
```

### 3. Docker Deployment
```bash
# Build image
docker build -t bhat-clothes-admin .

# Run container with environment variables
docker run -e DATABASE_URL="..." -e JWT_SECRET="..." -p 3000:3000 bhat-clothes-admin
```

## Build & Start Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
```

## Database Setup

1. Create a MySQL database
2. Set DATABASE_URL to your connection string
3. Migrations will run automatically on first deployment

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure DATABASE_URL is correct
- Verify Node.js version compatibility (v18+)

### Runtime Errors
- Check application logs on your hosting platform
- Verify all required environment variables are present
- Ensure database is accessible from the deployment environment

### Authentication Issues
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure OWNER_OPEN_ID matches your Manus account

## Support

For issues related to:
- **Manus OAuth**: Check Manus documentation
- **Database**: Verify MySQL connection and permissions
- **Deployment**: Check platform-specific documentation
