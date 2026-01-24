# Supabase Backend Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name:** matrimony-app
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
4. Wait for project to be created (~2 minutes)

## 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

3. Create `.env` file in your project root:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Enable Phone Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Phone** and click to configure
3. Enable Phone provider
4. Choose a provider (Twilio recommended for production, or use Supabase's test mode for development)
5. If using Twilio:
   - Add your Twilio Account SID
   - Add your Twilio Auth Token
   - Add your Twilio Phone Number

## 4. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the SQL from `docs/database-schema.sql`
4. Click "Run" to execute

## 5. Set Up Storage Buckets

### Create Buckets:

1. Go to **Storage** in Supabase dashboard
2. Create two buckets:
   - **profile-photos** (Public)
   - **verification-docs** (Private)

### Configure Policies:

For **profile-photos**:
```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read all photos
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

For **verification-docs**:
```sql
-- Allow authenticated users to upload their own verification docs
CREATE POLICY "Users can upload their own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Only admins can view verification docs
CREATE POLICY "Only admins can view verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs' AND 
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.auth_id = auth.uid() 
    AND users.role = 'admin'
  )
);
```

## 6. Seed Initial Data

Run this SQL to add some initial communities and castes:

```sql
-- Insert communities
INSERT INTO communities (name, is_active) VALUES
('Baniya', true),
('Teli', true);

-- Insert castes for Baniya community
INSERT INTO castes (community_id, name) VALUES
(1, 'Agarwal'),
(1, 'Maheshwari'),
(1, 'Gupta'),
(1, 'Other');

-- Insert castes for Teli community
INSERT INTO castes (community_id, name) VALUES
(2, 'Teli'),
(2, 'Other');

-- Add more castes as needed
```

## 7. Test Your Setup

1. Start your Expo app:
```bash
npx expo start --clear
```

2. Try to:
   - Send OTP to your phone
   - Verify OTP
   - Create a profile
   - Upload a photo

## 8. Environment Variables in Expo

For Expo to read `.env` files, you need to install:

```bash
npm install dotenv
```

Then update `app.config.js` (create if it doesn't exist):

```javascript
import 'dotenv/config';

export default {
  expo: {
    // ... your existing app.json config
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
```

## Troubleshooting

### Phone Auth Not Working
- Check that Phone provider is enabled in Supabase
- Verify Twilio credentials are correct
- Check phone number format (must include country code, e.g., +919876543210)

### Database Errors
- Check RLS policies are correctly set up
- Verify user has proper permissions
- Check Supabase logs in dashboard

### Storage Upload Fails
- Verify buckets are created
- Check storage policies are set up
- Ensure file size is within limits (default 50MB)

## Next Steps

1. ✅ Backend is ready
2. Update frontend screens to use real data
3. Test complete user flow
4. Add admin panel for verification
5. Deploy to production
