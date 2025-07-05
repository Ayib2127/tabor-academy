# Welcome Email Setup Guide

This guide will help you set up the automatic welcome email feature for your Tabor Academy MVP.

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Verified Domain**: Add and verify your domain in Resend
3. **API Key**: Get your Resend API key from the dashboard

## Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here

# Site Configuration (update with your actual domain)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Database Migration

Run the database migration to add the welcome email tracking:

1. **Using Supabase CLI** (recommended):
   ```bash
   supabase db push
   ```

2. **Manual SQL** (if CLI not available):
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the contents of `supabase/migrations/20250101000000_add_welcome_email_flag.sql`

## Email Configuration

### Update Email From Address

In `lib/email/resend.ts`, update the `from` address:

```typescript
from: 'Tabor Academy <noreply@yourdomain.com>', // Replace with your verified domain
```

### Customize Email Template

The welcome email template is in `lib/email/resend.ts`. You can customize:

- Email subject
- HTML content
- Text content
- Styling
- Links and CTAs

## How It Works

1. **User Registration**: When a user signs up, they get a `welcome_email_sent: false` flag
2. **First Login**: When they log in for the first time, the system:
   - Checks if `welcome_email_sent` is false
   - Sends a welcome email via Resend
   - Updates the flag to `true`
3. **Subsequent Logins**: No email is sent (flag is already `true`)

## Testing

### Test Individual User
```bash
curl -X POST http://localhost:3000/api/auth/welcome-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-uuid-here"}'
```

### Admin Panel
Access the admin welcome email manager at `/dashboard/admin` (if you have admin role).

## API Endpoints

- `POST /api/auth/welcome-email` - Send welcome email to user
- `GET /api/admin/welcome-email` - List users without welcome emails (admin only)
- `POST /api/admin/welcome-email` - Force send welcome email (admin only)

## Troubleshooting

### Email Not Sending
1. Check Resend API key is correct
2. Verify domain is verified in Resend
3. Check browser console for errors
4. Check server logs for API errors

### Database Issues
1. Ensure migration ran successfully
2. Check `welcome_email_sent` column exists in users table
3. Verify RLS policies allow updates

### Performance
- Welcome emails are sent asynchronously (non-blocking)
- Email sending doesn't delay login process
- Admin can manually trigger emails if needed

## Customization

### Email Content
Edit `lib/email/resend.ts` to customize:
- Email subject and content
- Styling and branding
- Call-to-action buttons
- Footer information

### Timing
- Emails are sent on first login (not registration)
- Can be modified to send on registration instead
- Admin can force-send emails anytime

### User Experience
- No loading delays during login
- Toast notifications for success/error
- Admin panel for management

## Security

- Admin endpoints require admin role
- User can only trigger their own welcome email
- API keys are server-side only
- Rate limiting handled by Resend

## Monitoring

Check Resend dashboard for:
- Email delivery rates
- Bounce rates
- Open rates
- Click rates

## Support

If you encounter issues:
1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify Resend dashboard for email status
4. Test with admin panel for manual sending 