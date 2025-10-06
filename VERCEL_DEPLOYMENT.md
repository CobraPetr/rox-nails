# Vercel Deployment Guide for Rox Nails

This guide will help you deploy your Rox Nails application to Vercel with a solid, production-ready setup.

## Prerequisites

- Vercel account (free tier available)
- GitHub/GitLab/Bitbucket account (for automatic deployments)
- Database setup (PostgreSQL recommended)

## Quick Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `rox-nails` repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add the following variables:

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd rox-nails
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set up environment variables
   - Deploy

## Environment Variables Setup

Add these environment variables in your Vercel project settings:

### Required Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"

# Upload Configuration
UPLOAD_SECRET="your-upload-secret"

# Google Calendar (if using)
GOOGLE_CAL_ID="primary"

# N8N Webhooks (if using)
N8N_WEBHOOK_BOOKING="https://your-n8n-server.com/webhook/bookings/create"
N8N_WEBHOOK_AVAIL="https://your-n8n-server.com/webhook/availability"
```

### Database Setup Options

#### Option 1: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

#### Option 2: External Database
- Supabase (free tier available)
- Railway PostgreSQL
- PlanetScale
- Any PostgreSQL provider

## Custom Domain Setup

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add your custom domain (e.g., `mycustomserver.com`)

2. **Configure DNS:**
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record pointing to Vercel's IP

3. **SSL Certificate:**
   - Vercel automatically provides SSL certificates
   - No additional configuration needed

## Deployment Configuration

The project includes:
- `vercel.json` - Vercel-specific configuration
- Security headers
- Function timeout settings
- Image optimization settings

## Build Settings

Vercel will automatically:
- Detect Next.js framework
- Install dependencies with pnpm
- Run `prisma generate`
- Build the application
- Deploy to global CDN

## Environment-Specific Deployments

### Development
- Automatically deployed on every push to `main`
- Uses development environment variables

### Preview
- Automatically deployed on pull requests
- Uses preview environment variables

### Production
- Deployed from `main` branch
- Uses production environment variables

## Monitoring and Analytics

Vercel provides:
- Real-time performance metrics
- Function execution logs
- Error tracking
- Analytics dashboard

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check environment variables are set
   - Ensure all dependencies are in `package.json`
   - Check build logs in Vercel dashboard

2. **Database Connection Issues:**
   - Verify `DATABASE_URL` is correct
   - Ensure database allows external connections
   - Check Prisma schema is valid

3. **Environment Variable Issues:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding new variables

### Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel remove [deployment-url]

# Inspect project
vercel inspect [deployment-url]
```

## Performance Optimization

Vercel automatically provides:
- Global CDN distribution
- Automatic image optimization
- Edge functions for API routes
- Automatic compression
- HTTP/2 support

## Security Features

- Automatic HTTPS/SSL
- Security headers (configured in vercel.json)
- DDoS protection
- Bot protection
- Web Application Firewall (WAF)

## Cost Considerations

### Free Tier Limits
- 100GB bandwidth per month
- 100GB-hours function execution
- Unlimited static deployments
- 1 concurrent build

### Pro Tier Benefits
- Unlimited bandwidth
- Advanced analytics
- Custom domains
- Priority support

## Support

- Vercel Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status Page: https://vercel-status.com

Your Rox Nails application will be live at your Vercel URL with a solid, production-ready setup!
