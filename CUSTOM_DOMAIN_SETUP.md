# Custom Domain Setup for Rox Nails on Vercel

This guide will help you configure your custom domain `mycustomserver.com` on Vercel.

## Prerequisites

- Domain registered with a domain registrar
- Vercel account with deployed application
- Access to your domain's DNS settings

## Step-by-Step Domain Configuration

### 1. Add Domain in Vercel Dashboard

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Domains**
3. **Add your domain:**
   - Primary domain: `mycustomserver.com`
   - Optional: Add `www.mycustomserver.com` for redirect

### 2. Configure DNS Records

#### Option A: Using Vercel Nameservers (Recommended)

1. **In Vercel dashboard, copy the nameservers:**
   - Usually something like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

2. **Update nameservers at your domain registrar:**
   - Go to your domain registrar's control panel
   - Find DNS/Nameserver settings
   - Replace existing nameservers with Vercel's
   - Save changes

3. **Wait for propagation (up to 24 hours)**

#### Option B: Using CNAME Records (Alternative)

1. **Add CNAME record in your DNS settings:**
   ```
   Type: CNAME
   Name: @ (or leave blank)
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

2. **Add www subdomain (optional):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### 3. SSL Certificate Configuration

Vercel automatically provides SSL certificates:
- ✅ **Automatic HTTPS** - No configuration needed
- ✅ **Let's Encrypt certificates** - Free and automatically renewed
- ✅ **HTTP to HTTPS redirect** - Automatic

### 4. Environment Variables Update

Update your `NEXTAUTH_URL` in Vercel:
```
NEXTAUTH_URL=https://mycustomserver.com
```

## DNS Configuration Examples

### Cloudflare
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy status: Proxied (Orange cloud)
```

### GoDaddy
```
Type: CNAME
Host: @
Points to: cname.vercel-dns.com
TTL: 1 Hour
```

### Namecheap
```
Type: CNAME Record
Host: @
Value: cname.vercel-dns.com
TTL: 30 min
```

## Verification Steps

### 1. Check DNS Propagation
```bash
# Check if domain points to Vercel
nslookup mycustomserver.com

# Check specific record
dig mycustomserver.com CNAME
```

### 2. Test Domain Access
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://mycustomserver.com

# Test HTTPS
curl -I https://mycustomserver.com
```

### 3. Verify SSL Certificate
```bash
# Check SSL certificate
openssl s_client -connect mycustomserver.com:443 -servername mycustomserver.com
```

## Troubleshooting

### Common Issues

#### Domain Not Resolving
- **Wait for DNS propagation** (can take up to 24 hours)
- **Check nameservers** are correctly set
- **Verify DNS records** are properly configured

#### SSL Certificate Issues
- **Wait for certificate generation** (usually automatic)
- **Check domain verification** in Vercel dashboard
- **Ensure domain is properly added** to Vercel project

#### Redirect Issues
- **Check if www redirect is working**
- **Verify both HTTP and HTTPS work**
- **Test subdomain redirects**

### DNS Propagation Tools
- https://dnschecker.org/
- https://www.whatsmydns.net/
- https://dnspropagation.net/

## Performance Optimization

### Vercel Edge Network
Your custom domain automatically benefits from:
- **Global CDN** - Content served from nearest location
- **Edge caching** - Static assets cached globally
- **HTTP/2 support** - Faster loading times
- **Automatic compression** - Reduced bandwidth usage

### Monitoring
Vercel provides analytics for your custom domain:
- **Real-time performance metrics**
- **Geographic distribution**
- **Error rates and response times**
- **Bandwidth usage**

## Security Features

With custom domain on Vercel:
- ✅ **Automatic HTTPS** with Let's Encrypt
- ✅ **HSTS headers** for security
- ✅ **DDoS protection**
- ✅ **Bot protection**
- ✅ **Web Application Firewall (WAF)**

## Cost Considerations

### Free Tier
- ✅ **Custom domains included**
- ✅ **SSL certificates included**
- ✅ **Global CDN included**

### Pro Tier Benefits
- **Advanced analytics** for custom domains
- **Priority support** for domain issues
- **Custom SSL certificates** (if needed)

## Final Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records configured correctly
- [ ] SSL certificate active (green lock icon)
- [ ] HTTP redirects to HTTPS
- [ ] Environment variables updated
- [ ] Application accessible via custom domain
- [ ] Performance monitoring enabled

## Support

If you encounter issues:
1. **Check Vercel documentation**: https://vercel.com/docs/concepts/projects/domains
2. **Verify DNS settings** with your registrar
3. **Contact Vercel support** for domain-specific issues
4. **Check domain registrar support** for DNS issues

Your Rox Nails application will be live at `https://mycustomserver.com` with enterprise-grade performance and security!
