# 🗄️ PostVolve Database Setup Guide

This directory contains all database-related files for PostVolve, including migrations, types, and documentation.

## 📋 Quick Start

### Step 1: Run the Migration

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your PostVolve project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Migration SQL**
   - Open `migrations/001_initial_schema.sql`
   - Copy all contents (Ctrl/Cmd + A, then Ctrl/Cmd + C)
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" or press Ctrl/Cmd + Enter
   - Wait for completion (should take ~5-10 seconds)

5. **Verify Success** ✅
   - Go to "Table Editor" in the left sidebar
   - You should see all 12 tables:
     - users
     - subscriptions
     - invoices
     - user_settings
     - posting_schedules
     - connected_accounts
     - posts
     - post_platforms
     - post_analytics
     - daily_analytics
     - usage_tracking
     - activity_log

---

## 📊 Database Schema Overview

### Core Tables

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `users` | User profiles and auth data | Extends `auth.users` |
| `subscriptions` | Billing plans and status | 1:1 with users |
| `user_settings` | User preferences | 1:1 with users |
| `posting_schedules` | Auto-post schedules | N:1 with users |
| `connected_accounts` | OAuth social media tokens | N:1 with users |

### Content Tables

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `posts` | Main post content | N:1 with users |
| `post_platforms` | Platform-specific versions | N:1 with posts |
| `post_analytics` | Performance metrics | N:1 with post_platforms |

### Analytics & Billing Tables

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `daily_analytics` | Aggregated daily stats | N:1 with users |
| `usage_tracking` | Monthly usage for billing | N:1 with users |
| `invoices` | Payment history | N:1 with users |
| `activity_log` | Audit trail | N:1 with users |

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- No cross-user data leakage
- Secure by default

### Helper Functions
- `is_username_available(varchar)` - Check if username is taken
- `get_user_limits(uuid)` - Get user's subscription limits
- `calculate_engagement_rate()` - Auto-calculate analytics rates

---

## 🔧 TypeScript Integration

After running the migration, you'll need to generate TypeScript types.

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Generate types
npx supabase gen types typescript --linked > shared/types/database.types.ts
```

### Option B: Manual (if CLI not available)
The TypeScript types have already been created in `/shared/types/database.types.ts` based on the schema.

---

## 🧪 Testing the Database

After migration, test the connection:

1. **Create a test user** via your app's sign-up page
2. **Check the users table** in Supabase Dashboard
3. **Verify RLS** - Try to access another user's data (should fail)
4. **Test helper functions** in SQL Editor:
   ```sql
   -- Check if username is available
   SELECT public.is_username_available('testuser');
   
   -- Get user limits (replace with actual user ID)
   SELECT * FROM public.get_user_limits('your-user-uuid');
   ```

---

## 🔄 Future Migrations

When you need to modify the schema:

1. Create a new migration file: `002_description.sql`
2. Number them sequentially: `001_`, `002_`, `003_`, etc.
3. Always include:
   - Clear comments
   - Rollback instructions
   - Test queries
4. Run in Supabase SQL Editor (same process as initial migration)

### Migration Best Practices

✅ **DO:**
- Add comments explaining changes
- Include rollback SQL at the bottom
- Test on a staging database first
- Back up data before destructive changes

❌ **DON'T:**
- Delete or modify `001_initial_schema.sql`
- Run migrations directly on production without testing
- Skip version numbers

---

## 📝 Common Tasks

### Add a New Column
```sql
-- Add column
ALTER TABLE public.posts 
ADD COLUMN view_count INT DEFAULT 0;

-- Create index if needed
CREATE INDEX idx_posts_view_count ON public.posts(view_count);

-- Update RLS policies if needed
```

### Update an Enum
```sql
-- Add new value to existing enum
ALTER TYPE platform_type ADD VALUE 'tiktok';
```

### Create a New Index
```sql
-- For performance optimization
CREATE INDEX idx_posts_user_status 
ON public.posts(user_id, status) 
WHERE deleted_at IS NULL;
```

---

## 🐛 Troubleshooting

### Error: "permission denied for schema public"
**Solution**: Make sure you're running the migration as the project owner in Supabase Dashboard.

### Error: "type already exists"
**Solution**: The migration was partially run. Check which tables exist and either:
- Drop them manually and re-run, OR
- Comment out the parts that already exist

### Error: "relation already exists"
**Solution**: Table already created. Check Table Editor to see what exists.

### RLS Policies Not Working
**Solution**: 
1. Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Check policy with: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`
3. Test with a real authenticated user (not service role)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Migration Checklist

Before deploying to production:

- [ ] Migration runs successfully in Supabase Dashboard
- [ ] All 12 tables visible in Table Editor
- [ ] RLS policies tested with real users
- [ ] TypeScript types generated and imported
- [ ] Helper functions tested
- [ ] Indexes created for frequently queried columns
- [ ] Test user can sign up and create posts
- [ ] Analytics tracking works
- [ ] Subscription limits enforced
- [ ] Activity log captures events

---

**Need Help?** Check the main README.md or create an issue in the repository.

