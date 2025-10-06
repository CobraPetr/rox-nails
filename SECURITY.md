# Security Configuration Guide

This document outlines the security measures implemented for the Rox Nails application deployment.

## Implemented Security Features

### 1. SSL/TLS Encryption
- **HTTPS Enforcement**: All HTTP traffic redirects to HTTPS
- **Modern TLS**: Supports TLS 1.2 and 1.3 only
- **Secure Ciphers**: Uses strong encryption ciphers
- **HSTS**: HTTP Strict Transport Security enabled

### 2. Security Headers
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Browser XSS protection
- **Content-Security-Policy**: Restricts resource loading
- **Referrer-Policy**: Controls referrer information

### 3. Rate Limiting
- **API Endpoints**: 10 requests per second per IP
- **Login Endpoints**: 5 requests per minute per IP
- **Burst Handling**: Allows temporary spikes with queue management

### 4. Application Security
- **Environment Variables**: Sensitive data in environment variables
- **Database Security**: Separate database user with limited privileges
- **File Upload Security**: Size limits and type validation
- **Input Validation**: Zod schema validation for all inputs

### 5. Infrastructure Security
- **Docker Security**: Non-root user in containers
- **Network Isolation**: Docker networks for service isolation
- **Container Hardening**: Minimal attack surface with Alpine Linux
- **Resource Limits**: Memory and CPU constraints

## Security Checklist for Production

### Before Deployment
- [ ] Change all default passwords and secrets
- [ ] Use strong, unique passwords (minimum 16 characters)
- [ ] Generate secure random secrets for NEXTAUTH_SECRET and UPLOAD_SECRET
- [ ] Obtain valid SSL certificates (not self-signed)
- [ ] Configure firewall to allow only necessary ports (80, 443, 22)
- [ ] Set up regular security updates for the server

### Environment Variables to Secure
```bash
# Generate secure secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 32  # For UPLOAD_SECRET

# Use strong database password
DATABASE_URL="postgresql://rox_user:STRONG_PASSWORD@db:5432/rox_nails_prod"
```

### SSL Certificate Setup
1. **Let's Encrypt (Recommended)**:
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain certificate
   sudo certbot --nginx -d mycustomserver.com
   
   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

2. **Manual SSL Setup**:
   - Place certificate in `ssl/cert.pem`
   - Place private key in `ssl/private.key`
   - Ensure proper file permissions (600 for private key)

### Database Security
- [ ] Use dedicated database user (not postgres superuser)
- [ ] Limit database user permissions
- [ ] Enable SSL for database connections
- [ ] Regular database backups
- [ ] Monitor database access logs

### Server Hardening
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Configure fail2ban for brute force protection
- [ ] Keep system packages updated
- [ ] Configure automatic security updates
- [ ] Use a firewall (ufw/iptables)
- [ ] Monitor system logs

### Monitoring and Logging
- [ ] Set up log rotation
- [ ] Monitor application logs for errors
- [ ] Set up alerts for failed login attempts
- [ ] Monitor SSL certificate expiration
- [ ] Track resource usage (CPU, memory, disk)

## Security Monitoring

### Health Check Endpoint
The application provides a health check endpoint at `/api/health` that reports:
- Database connection status
- External service availability
- System resource usage
- Application uptime

### Log Monitoring
Monitor these log files for security issues:
```bash
# Application logs
docker-compose logs -f app

# Nginx access logs
docker-compose logs -f nginx

# System logs
sudo journalctl -u rox-nails -f
```

## Incident Response

### If Security Breach Suspected
1. **Immediate Actions**:
   - Change all passwords and secrets
   - Review access logs
   - Check for unauthorized changes
   - Take application offline if necessary

2. **Investigation**:
   - Analyze logs for suspicious activity
   - Check for data exfiltration
   - Identify attack vector
   - Document findings

3. **Recovery**:
   - Patch vulnerabilities
   - Restore from clean backups
   - Implement additional security measures
   - Monitor for continued attacks

## Regular Security Maintenance

### Weekly Tasks
- [ ] Review application logs
- [ ] Check for failed login attempts
- [ ] Verify SSL certificate validity
- [ ] Update system packages

### Monthly Tasks
- [ ] Review and rotate secrets
- [ ] Audit user access
- [ ] Test backup and recovery procedures
- [ ] Security vulnerability assessment

### Quarterly Tasks
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Update security documentation
- [ ] Review and update security policies

## Contact Information

For security issues or questions:
- Create a security issue in the repository
- Contact the development team
- For critical security issues, contact directly

Remember: Security is an ongoing process, not a one-time setup!
