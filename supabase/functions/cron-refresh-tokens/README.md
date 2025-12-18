# Cron Refresh Tokens Edge Function

This Edge Function is called by `pg_cron` every 10 minutes to refresh expiring X (Twitter) tokens.

## Purpose

- Calls the Vercel API endpoint `/api/cron/check-expired-tokens`
- Handles HTTP requests reliably (avoids `pg_net` memory issues)
- Provides better error handling and logging

## Setup

1. **Set Environment Variables** (Supabase Secrets):
   - `VERCEL_APP_URL` - Your Vercel deployment URL
   - `CRON_SECRET` - Your cron secret for authentication

2. **Deploy the Function**:
   ```bash
   supabase functions deploy cron-refresh-tokens
   ```

3. **Test the Function**:
   ```bash
   supabase functions invoke cron-refresh-tokens
   ```

## Usage

The function is automatically called by `pg_cron` every 10 minutes. You can also invoke it manually for testing.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_APP_URL` | Your Vercel app URL (e.g., `https://postvolve.vercel.app`) | Yes |
| `CRON_SECRET` | Secret token for API authentication | Yes |

## Response Format

**Success:**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "success": true,
    "expiredUpdated": 0,
    "expiredErrors": 0,
    "refreshed": 2,
    "refreshErrors": 0,
    "timestamp": "2024-12-XX..."
  },
  "timestamp": "2024-12-XX..."
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2024-12-XX..."
}
```

## Troubleshooting

See `EDGE_FUNCTION_SETUP.md` for detailed troubleshooting guide.






