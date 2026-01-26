# Environment Variables Configuration

This document describes the environment variables required for the application.

## Required Environment Variables

### For Render/Production Deployment

Set these in your Render dashboard under **Environment**:

1. **VITE_SUPABASE_URL**
   - Value: `https://qiqxdivyyjcbegdlptuq.supabase.co`
   - Description: Your Supabase project URL
   - Required: Yes (for CreateViewerModal and CreateUserModal functions)

2. **VITE_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcXhkaXZ5eWpjYmVnZGxwdHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjA4NDUsImV4cCI6MjA2NzQ5Njg0NX0.jkOmX28FJaWdMP2oFMflVwTpErCEU5WavvRzdnuyGRg`
   - Description: Your Supabase anonymous/public key (safe to expose in client-side code)
   - Required: Recommended (for better configuration management)

3. **VITE_APP_URL** (Optional)
   - Value: `https://escpnetwork.net/`
   - Description: The main application URL for redirects after form submissions
   - Required: No (defaults to `https://escpnetwork.net/`)

## How to Set in Render

1. Go to your Render dashboard
2. Select your service (e.g., `cffdatabase`)
3. Navigate to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable:
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://qiqxdivyyjcbegdlptuq.supabase.co`
   - Click **Save Changes**
6. Repeat for `VITE_SUPABASE_ANON_KEY`
7. **Redeploy** your service for changes to take effect

## Fallback Behavior

The application includes fallback values, so it will work even if environment variables are not set. However, using environment variables is recommended for:
- Better configuration management
- Easier switching between environments
- Security best practices

## Local Development

For local development, create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://qiqxdivyyjcbegdlptuq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcXhkaXZ5eWpjYmVnZGxwdHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjA4NDUsImV4cCI6MjA2NzQ5Njg0NX0.jkOmX28FJaWdMP2oFMflVwTpErCEU5WavvRzdnuyGRg
```

**Note:** Never commit `.env` files to version control. The `.env.example` file (if created) should not contain actual secrets.

