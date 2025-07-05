# Deployment Guide for Tabor Academy

This guide provides instructions for deploying the Tabor Academy platform to production.

## Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- A Vercel, Netlify, or similar hosting account
- Domain name (optional but recommended)

## Environment Setup

1. Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

2. Configure the following environment variables:

- `NEXT_PUBLIC_GA_ID`: Google Analytics Measurement ID
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for error monitoring
- `JWT_SECRET`: Secret key for JWT token generation and validation
- `NEXT_PUBLIC_FRONTEND_URL`: Your frontend URL for CORS (optional)

## Build and Deployment

### Manual Deployment

1. Install dependencies:

```bash
npm ci
```

2. Build the application:

```bash
npm run build
```

3. Start the production server:

```bash
npm start
```

### Deploying to Vercel

1. Install the Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy to production:

```bash
vercel --prod
```

### Deploying to Netlify

1. Install the Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Deploy to production:

```bash
netlify deploy --prod
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are correctly set
- [ ] Test authentication flows
- [ ] Verify payment processing (if applicable)
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test site performance with Lighthouse
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain and SSL

## Monitoring and Maintenance

- Set up Sentry for error monitoring
- Configure Google Analytics for user tracking
- Set up uptime monitoring
- Implement regular database backups (if applicable)
- Schedule regular security audits

## Troubleshooting

### Common Issues

1. **Middleware not running**:
   - Ensure `output: 'export'` is removed from `next.config.js`
   - Verify deployment platform supports Next.js middleware

2. **Image optimization issues**:
   - Check that `unoptimized: true` is removed from `next.config.js`
   - Verify image domains are correctly configured

3. **Authentication failures**:
   - Verify `JWT_SECRET` is correctly set
   - Check token expiration settings

4. **CORS errors**:
   - Set `NEXT_PUBLIC_FRONTEND_URL` correctly
   - Verify middleware is running

## Support

For additional support, contact the development team or refer to the Next.js documentation.