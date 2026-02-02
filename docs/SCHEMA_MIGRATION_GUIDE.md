# Schema Migration Guide

## Overview
Migrated from custom `users` table to using Supabase's built-in `auth.users` as the identity source.

## Key Changes

### Before (Old Schema)
```
auth.users (Supabase managed)
    ↓
users (custom table)
  - id: UUID (PK)
  - auth_id: UUID → auth.users(id)
  - phone_number, role, etc.
    ↓
profiles
  - id: UUID (PK)
  - user_id: UUID → users(id)
  - first_name, last_name, etc.
```

### After (New Schema)
```
auth.users (Supabase managed)
    ↓
profiles
  - id: UUID (PK) → auth.users(id) directly
  - first_name, last_name, etc.
```

## Database Changes

### Tables Modified
- **profiles**: `id` now directly references `auth.users(id)` instead of having separate `user_id`
- **users**: Table removed entirely
- **connections, messages, etc.**: All foreign keys now point to `profiles(id)` which equals `auth.uid()`

### RLS Policies Simplified
All policies now use `auth.uid()` directly instead of joining through `users` table:
- `profiles.id = auth.uid()` (owner check)
- `sender_id = auth.uid()` (connection sender)
- etc.

## Client Code Changes

### Services Updated

#### authService.js
- ✅ Removed `getOrCreateUser()` method
- ✅ `verifyOTP()` now returns `{ user: auth.users, profile, session }`
- ✅ `getCurrentUser()` fetches profile using `auth.uid()` directly

#### profileService.js
- ✅ `getProfileByUserId()` → `getProfile(profileId)`
- ✅ `createProfile()` now takes `profileId` (auth UID) and sets `id` directly

### Store Updated

#### useStore.js
- ✅ `user` now holds the `auth.users` object
- ✅ `profile.id` equals `user.id` (both are auth UID)
- ✅ Removed redundant profile fetches

### Screens Updated

#### AuthScreen.js
- ✅ Check for existing profile using `profiles.id = auth.uid()`
- ✅ Create profile with `id: authedUser.id`

#### LoginScreen.js
- ✅ Removed pre-check for users/profiles by phone
- ✅ Let auth flow handle existence checks

#### HomeScreen.js
- ✅ Filter out own profile using `profiles.id` instead of `user_id`

## Migration Steps (if you have existing data)

### 1. Backup existing data
```sql
-- Export users and profiles to CSV or backup tables
```

### 2. Create new schema
```sql
-- Run the new database-schema.sql
```

### 3. Migrate existing profiles (if any)
```sql
-- Map old profiles to auth UIDs
UPDATE profiles p
SET id = (SELECT auth_id FROM users u WHERE u.id = p.user_id)
WHERE EXISTS (SELECT 1 FROM users u WHERE u.id = p.user_id AND u.auth_id IS NOT NULL);

-- Drop old user_id column after verification
ALTER TABLE profiles DROP COLUMN user_id;
```

### 4. Drop old users table
```sql
DROP TABLE IF EXISTS users CASCADE;
```

## Benefits

1. **Simpler schema**: One less table to manage
2. **Cleaner RLS**: Direct `auth.uid()` checks without joins
3. **Better alignment**: Follows Supabase best practices
4. **Easier reasoning**: `profile.id = auth.uid()` everywhere

## Storage Policies

For profile photos bucket:
```sql
-- Owner can upload to their folder
bucket_id = 'profile-photos'
AND position(auth.uid()::text || '/' in storage.objects.name) = 1

-- Public can read non-private photos
EXISTS (
  SELECT 1 FROM profile_photos ph
  WHERE ph.storage_path = storage.objects.name
    AND ph.is_private = false
)
```

## Testing Checklist

- [ ] OTP login creates profile with `id = auth.uid()`
- [ ] Existing users can login and see their profile
- [ ] Connections insert passes RLS (sender_id = auth.uid())
- [ ] Communities/castes readable by anon users
- [ ] Profile photos upload to correct folder
- [ ] HomeScreen excludes own profile correctly
- [ ] Messages and conversations work for connected users

## Rollback Plan

If issues arise:
1. Keep backup of old schema SQL
2. Export any new data created
3. Restore old schema
4. Re-import data with old structure
5. Revert client code changes

---
**Migration completed**: Jan 30, 2026
**Schema version**: 2.0 (auth.users direct)
