-- =====================================================
-- SUPABASE MATRIMONY APP - CLEAN SCHEMA
-- Uses auth.users as identity source
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. MASTER DATA
-- =====================================================

CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE castes (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (community_id, name)
);

-- =====================================================
-- 2. PROFILES (linked directly to auth.users)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  community_id INTEGER REFERENCES communities(id),
  caste_id INTEGER REFERENCES castes(id),

  managed_by TEXT CHECK (managed_by IN ('self','parent','sibling','relative')),

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male','female','other')) NOT NULL,
  dob DATE NOT NULL,
  height_cm INTEGER,
  marital_status TEXT CHECK (marital_status IN ('never_married','divorced','widowed')),
  bio TEXT,

  father_name TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  siblings_count INTEGER DEFAULT 0,

  education TEXT,
  profession TEXT,
  income_range TEXT,

  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',

  verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','rejected')),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. PROFILE PHOTOS
-- =====================================================

CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 4. CONNECTIONS
-- =====================================================

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','declined','blocked')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (sender_id, receiver_id),
  CHECK (sender_id <> receiver_id)
);

-- =====================================================
-- 5. CHAT SYSTEM
-- =====================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE UNIQUE,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text'
    CHECK (message_type IN ('text','image')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. INDEXES
-- =====================================================

CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_connections_sender ON connections(sender_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- =====================================================
-- 7. RLS ENABLE
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE castes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. RLS POLICIES (SIMPLE & SAFE)
-- =====================================================

-- Profiles
CREATE POLICY "Read own or verified profiles"
ON profiles FOR SELECT
USING (id = auth.uid() OR verification_status = 'verified');

CREATE POLICY "Insert own profile"
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "Update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());

-- Profile Photos
CREATE POLICY "View public or own photos"
ON profile_photos FOR SELECT
USING (
  is_private = false
  OR profile_id = auth.uid()
);

CREATE POLICY "Insert own photos"
ON profile_photos FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Delete own photos"
ON profile_photos FOR DELETE
USING (profile_id = auth.uid());

-- Connections
CREATE POLICY "View own connections"
ON connections FOR SELECT
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Create connection"
ON connections FOR INSERT
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Update own connection"
ON connections FOR UPDATE
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Conversations
CREATE POLICY "View own conversations"
ON conversations FOR SELECT
USING (
  connection_id IN (
    SELECT id FROM connections
    WHERE sender_id = auth.uid()
       OR receiver_id = auth.uid()
  )
);

-- Messages
CREATE POLICY "View messages in own conversations"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations
    WHERE connection_id IN (
      SELECT id FROM connections
      WHERE sender_id = auth.uid()
         OR receiver_id = auth.uid()
    )
  )
);

CREATE POLICY "Send messages"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND conversation_id IN (
    SELECT id FROM conversations
    WHERE connection_id IN (
      SELECT id FROM connections
      WHERE sender_id = auth.uid()
         OR receiver_id = auth.uid()
    )
  )
);

-- Communities & Castes (read-only for all)
CREATE POLICY "Anyone can view communities"
ON communities FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can view castes"
ON castes FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- DONE ✅
-- =====================================================
