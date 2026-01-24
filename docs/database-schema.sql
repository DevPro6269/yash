-- =====================================================
-- MATRIMONY APP - DATABASE SCHEMA
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. IDENTITY & ACCESS TABLES
-- =====================================================

-- Users table (links to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE,
  phone_number TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MASTER DATA TABLES
-- =====================================================

-- Communities table
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Castes table (belongs to community)
CREATE TABLE castes (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, name)
);

-- =====================================================
-- 3. PROFILE TABLES
-- =====================================================

-- Main profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  community_id INTEGER REFERENCES communities(id),
  caste_id INTEGER REFERENCES castes(id),
  managed_by TEXT CHECK (managed_by IN ('self', 'parent', 'sibling', 'relative')),
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  dob DATE NOT NULL,
  height_cm INTEGER,
  marital_status TEXT CHECK (marital_status IN ('never_married', 'divorced', 'widowed')),
  bio TEXT,
  
  -- Family Information
  father_name TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  siblings_count INTEGER DEFAULT 0,
  
  -- Professional Information
  education TEXT,
  profession TEXT,
  income_range TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  
  -- Verification
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile photos table
CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. VERIFICATION SYSTEM
-- =====================================================

-- Verification requests table
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  govt_id_type TEXT NOT NULL CHECK (govt_id_type IN ('pan', 'aadhar', 'voter_id', 'driving_license', 'passport')),
  govt_id_url TEXT NOT NULL,
  live_selfie_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. CONNECTIONS & SOCIAL
-- =====================================================

-- Connections table (connection requests between users)
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

-- =====================================================
-- 6. CHAT SYSTEM
-- =====================================================

-- Conversations table (one per accepted connection)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE UNIQUE NOT NULL,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_community ON profiles(community_id);
CREATE INDEX idx_profiles_caste ON profiles(caste_id);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_profile_photos_profile ON profile_photos(profile_id);
CREATE INDEX idx_connections_sender ON connections(sender_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Profiles policies
CREATE POLICY "Anyone can view verified profiles"
  ON profiles FOR SELECT
  USING (verification_status = 'verified' OR user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Profile photos policies
CREATE POLICY "Public photos are viewable by all"
  ON profile_photos FOR SELECT
  USING (
    is_private = false OR
    profile_id IN (
      SELECT id FROM profiles WHERE user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    ) OR
    -- Private photos visible if connection is accepted
    profile_id IN (
      SELECT sender_id FROM connections 
      WHERE receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      AND status = 'accepted'
      UNION
      SELECT receiver_id FROM connections 
      WHERE sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      AND status = 'accepted'
    )
  );

CREATE POLICY "Users can insert their own photos"
  ON profile_photos FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete their own photos"
  ON profile_photos FOR DELETE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- Verification requests policies
CREATE POLICY "Users can insert their own verification request"
  ON verification_requests FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    ) OR
    -- Admins can view all
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update verification requests"
  ON verification_requests FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() AND role = 'admin'
  ));

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON connections FOR SELECT
  USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())) OR
    receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can create connection requests"
  ON connections FOR INSERT
  WITH CHECK (sender_id IN (
    SELECT id FROM profiles WHERE user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update their connections"
  ON connections FOR UPDATE
  USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())) OR
    receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (
    connection_id IN (
      SELECT id FROM connections 
      WHERE sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      OR receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE connection_id IN (
        SELECT id FROM connections 
        WHERE sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
        OR receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      )
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE connection_id IN (
        SELECT id FROM connections 
        WHERE sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
        OR receiver_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
      )
    ) AND
    sender_id IN (SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (sender_id IN (
    SELECT id FROM profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  ));

-- =====================================================
-- 9. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for connections
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. MASTER DATA - READ POLICIES
-- =====================================================

-- Communities and Castes are readable by all authenticated users
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE castes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view communities"
  ON communities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view castes"
  ON castes FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- SCHEMA SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run seed data (see SUPABASE_SETUP.md)
-- 2. Set up Storage buckets and policies
-- 3. Enable Phone Auth in Supabase dashboard
-- =====================================================
