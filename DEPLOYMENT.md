# Rox Nails - Production Deployment Guide

This guide will help you deploy the Rox Nails application on your custom server with a solid, bug-free setup.

## Prerequisites

- Docker and Docker Compose installed on your server
- Domain name pointing to your server (mycustomserver.com)
- SSL certificates (optional for development, required for production)

## Quick Deployment

1. **Clone and navigate to the project:**
   ```bash
   cd rox-nails
   ```

2. **Configure environment variables:**
   ```bash
   cp production.env .env.local
   # Edit .env.local with your actual values
   ```

3. **Deploy the application:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Manual Deployment Steps

### 1. Environment Configuration

Edit `.env.local` with your production values:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@your-db-host:5432/rox_nails_prod?schema=public"

# N8N Webhook URLs
N8N_WEBHOOK_BOOKING=https://your-n8n-server.com/webhook/bookings/create
N8N_WEBHOOK_AVAIL=https://your-n8n-server.com/webhook/availability

# Upload Configuration
UPLOAD_SECRET=your-secure-production-secret

# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-nextauth-secret
NEXTAUTH_URL=https://mycustomserver.com:3000
```

### 2. SSL Certificates

For production, place your SSL certificates in the `ssl/` directory:
- `ssl/cert.pem` - Your SSL certificate
- `ssl/private.key` - Your private key

For development, the deploy script will create self-signed certificates.

### 3. Start the Application

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Architecture Overview

The deployment uses:

- **Next.js App**: Main application running on port 3000
- **PostgreSQL**: Database with persistent storage
- **Nginx**: Reverse proxy with SSL termination and security headers
- **Docker**: Containerized deployment for consistency

## Security Features

- SSL/TLS encryption
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Rate limiting on API endpoints
- Gzip compression
- Secure cookie settings

## Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f nginx
```

### Database Management
```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Access database
docker-compose exec db psql -U postgres -d rox_nails_prod

# Backup database
docker-compose exec db pg_dump -U postgres rox_nails_prod > backup.sql
```

### Updates
```bash
# Pull latest changes and rebuild
git pull
docker-compose build --no-cache
docker-compose up -d

# Run migrations if needed
docker-compose exec app npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 443, and 3000 are available
2. **SSL errors**: Check certificate paths and permissions
3. **Database connection**: Verify DATABASE_URL in .env.local
4. **Memory issues**: Ensure server has at least 2GB RAM

### Health Checks

```bash
# Check application health
curl -f http://localhost/health

# Check database connection
docker-compose exec app npx prisma db pull

# Check SSL certificate
openssl x509 -in ssl/cert.pem -text -noout
```

## Performance Optimization

- The application uses Next.js standalone output for optimal performance
- Nginx handles static file caching
- Database connections are optimized for production
- Gzip compression reduces bandwidth usage

## Backup Strategy

1. **Database backups**: Run daily automated backups
2. **Application data**: Backup uploaded files and configuration
3. **SSL certificates**: Keep secure copies of certificates

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment configuration
3. Ensure all prerequisites are met
4. Check network connectivity and firewall settings
