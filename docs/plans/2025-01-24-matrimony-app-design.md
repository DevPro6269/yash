# Matrimony App Design Document
**Date:** 2025-01-24
**Type:** Mobile Application (Community & Caste Based)
**Architecture:** React Native (Expo) + Supabase

## 1. Overview
A specialized matrimony platform focusing initially on 2-3 specific communities/castes, with plans to scale. The app emphasizes trust and privacy through manual verification and request-based contact sharing.

**Key Features:**
*   **Community/Caste Logic:** Strict hierarchical filtering.
*   **Privacy First:** Contact details and private photos are only visible after a connection request is accepted.
*   **Trust:** Manual Admin verification using Live Selfie + Govt ID.
*   **Communication:** In-app real-time chat (no direct phone number sharing).

## 2. Technical Architecture

### 2.1 Stack
*   **Frontend:** React Native (via Expo)
    *   Targets: iOS and Android
*   **Backend:** Supabase (Managed Service)
    *   **Database:** PostgreSQL
    *   **Auth:** Phone Auth (OTP)
    *   **Storage:** Secure buckets for Profile Photos and Verification Docs
    *   **Realtime:** For Chat and Notifications

### 2.2 User Identity Flow
1.  **Auth:** User enters Phone -> Supabase sends OTP -> User verifies.
2.  **Identity:** On success, check `users` table.
    *   *If New:* Create row in `users`.
    *   *If Existing:* Log in.
3.  **Profile:** App fetches `profiles` row where `user_id` matches.

## 3. Database Schema

### 3.1 Identity & Access
**`users`**
*   `id` (UUID, PK)
*   `auth_id` (UUID, Nullable, Unique) - Link to Supabase Auth
*   `phone_number` (Text, Unique)
*   `role` (Enum: 'user', 'admin')
*   `account_status` (Enum: 'active', 'suspended', 'banned')
*   `created_at`, `last_login_at`

### 3.2 Master Data
**`communities`**
*   `id` (Int, PK), `name` (Text), `is_active` (Bool)

**`castes`**
*   `id` (Int, PK), `community_id` (FK), `name` (Text)

### 3.3 Profiles (Core Data)
**`profiles`**
*   `id` (UUID, PK)
*   `user_id` (FK -> users.id, Unique)
*   `community_id` (FK), `caste_id` (FK)
*   `managed_by` (Enum: 'self', 'parent', 'sibling', 'relative')
*   **Personal:** `first_name`, `last_name`, `gender`, `dob`, `height_cm`, `marital_status`, `bio`
*   **Family:** `father_name`, `father_occupation`, `mother_name`, `mother_occupation`
*   **Professional:** `education`, `profession`, `income_range`
*   **Location:** `city`, `state`
*   `verification_status` (Enum: 'pending', 'verified', 'rejected')

**`profile_photos`**
*   `id` (UUID, PK), `profile_id` (FK)
*   `image_url` (Text)
*   `is_primary` (Bool), `is_private` (Bool)

### 3.4 Verification System
**`verification_requests`**
*   `id` (UUID, PK), `profile_id` (FK)
*   `govt_id_type` (Enum: 'pan', 'voter_id', 'driving_license')
*   `govt_id_url` (Text, Private)
*   `live_selfie_url` (Text, Private)
*   `status` (Enum: 'pending', 'approved', 'rejected')
*   `rejection_reason` (Text)

### 3.5 Social & Chat
**`connections`**
*   `id` (UUID, PK)
*   `sender_id` (FK), `receiver_id` (FK)
*   `status` (Enum: 'pending', 'accepted', 'declined', 'blocked')

**`conversations`**
*   `id` (UUID, PK), `connection_id` (FK, Unique)
*   `last_message_at`, `last_message_preview`

**`messages`**
*   `id` (UUID, PK), `conversation_id` (FK), `sender_id` (FK)
*   `content` (Text), `message_type` ('text', 'image'), `is_read` (Bool)

## 4. Security & Privacy
*   **Row Level Security (RLS):**
    *   `verification_requests`: Only insertable by owner, readable by Admin.
    *   `profile_photos`: Private photos only readable if `connection.status` = 'accepted'.
    *   `messages`: Only readable by participants of the conversation.

## 5. Next Steps
1.  Initialize React Native (Expo) project.
2.  Set up Supabase project (Tables, Storage, Auth).
3.  Implement Auth Flow (Login Screen).
4.  Implement Profile Creation Flow.
