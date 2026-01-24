# Backend Integration Guide

## Overview

Your matrimony app now has a complete Supabase backend integration with:
- ✅ Phone OTP Authentication
- ✅ User & Profile Management
- ✅ Connection Requests System
- ✅ Real-time Chat
- ✅ Photo Upload & Storage
- ✅ Verification System

## Project Structure

```
src/
├── config/
│   └── supabase.js          # Supabase client configuration
├── services/
│   ├── authService.js       # Authentication (OTP, login, logout)
│   ├── profileService.js    # Profile CRUD, search, communities/castes
│   ├── connectionService.js # Connection requests management
│   ├── chatService.js       # Real-time messaging
│   ├── storageService.js    # File uploads (photos, documents)
│   └── index.js            # Service exports
└── store/
    └── useStore.js          # Global state with Supabase integration
```

## Setup Instructions

### 1. Environment Configuration

Create `.env` file in project root:
```bash
cp .env.example .env
```

Add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Install Dependencies

Already installed:
- ✅ `@supabase/supabase-js` - Supabase client
- ✅ `expo-file-system` - File handling for uploads

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the complete schema from `docs/database-schema.sql`
4. Follow additional setup in `docs/SUPABASE_SETUP.md`

## Using the Services

### Authentication Service

```javascript
import { authService } from '../services';

// Send OTP
const result = await authService.sendOTP('+919876543210');

// Verify OTP
const result = await authService.verifyOTP('+919876543210', '123456');

// Get current user
const user = await authService.getCurrentUser();

// Sign out
await authService.signOut();

// Listen to auth changes
authService.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
});
```

### Profile Service

```javascript
import { profileService } from '../services';

// Get profile by user ID
const { data: profile } = await profileService.getProfileByUserId(userId);

// Create profile
const result = await profileService.createProfile(userId, {
  first_name: 'John',
  last_name: 'Doe',
  gender: 'male',
  dob: '1990-01-01',
  community_id: 1,
  caste_id: 1,
  // ... other fields
});

// Update profile
const result = await profileService.updateProfile(profileId, {
  bio: 'Updated bio',
  city: 'Mumbai',
});

// Get communities
const { data: communities } = await profileService.getCommunities();

// Get castes by community
const { data: castes } = await profileService.getCastesByCommunity(communityId);

// Search profiles
const { data: profiles } = await profileService.searchProfiles({
  communityId: 1,
  gender: 'female',
  minAge: 25,
  maxAge: 30,
});

// Add profile photo
const result = await profileService.addProfilePhoto(profileId, {
  image_url: 'https://...',
  is_primary: true,
  is_private: false,
});
```

### Connection Service

```javascript
import { connectionService } from '../services';

// Send connection request
const result = await connectionService.sendConnectionRequest(senderId, receiverId);

// Accept request
const result = await connectionService.acceptConnectionRequest(connectionId);

// Decline request
const result = await connectionService.declineConnectionRequest(connectionId);

// Block connection
const result = await connectionService.blockConnection(connectionId);

// Get my connections
const { data: connections } = await connectionService.getMyConnections(userId);

// Get pending requests
const { data: requests } = await connectionService.getPendingRequests(userId);

// Check connection status with another user
const { data: connection } = await connectionService.getConnectionStatus(userId, otherUserId);
```

### Chat Service

```javascript
import { chatService } from '../services';

// Get conversation by connection
const { data: conversation } = await chatService.getConversationByConnectionId(connectionId);

// Get all my conversations
const { data: conversations } = await chatService.getMyConversations(userId);

// Get messages in conversation
const { data: messages } = await chatService.getMessages(conversationId);

// Send message
const result = await chatService.sendMessage(conversationId, senderId, 'Hello!');

// Mark messages as read
await chatService.markMessagesAsRead(conversationId, userId);

// Subscribe to real-time messages
const subscription = chatService.subscribeToMessages(conversationId, (newMessage) => {
  console.log('New message:', newMessage);
});

// Unsubscribe
chatService.unsubscribeFromMessages(subscription);

// Get unread count
const { count } = await chatService.getUnreadCount(userId);
```

### Storage Service

```javascript
import { storageService } from '../services';

// Upload profile photo
const result = await storageService.uploadProfilePhoto(
  userId,
  'file:///path/to/photo.jpg',
  false // isPrivate
);

// Upload verification document
const result = await storageService.uploadVerificationDocument(
  userId,
  'file:///path/to/document.jpg',
  'pan' // docType
);

// Delete file
await storageService.deleteFile('profile-photos', 'path/to/file.jpg');

// Get signed URL for private file
const { url } = await storageService.getSignedUrl('verification-docs', 'path/to/file.jpg');
```

## Using the Store

The global store now has Supabase integration:

```javascript
import { useStore } from '../store/useStore';

function MyComponent() {
  const { 
    user, 
    profile, 
    isLoading, 
    error,
    sendOTP, 
    verifyOTP, 
    createProfile,
    updateProfile,
    logout 
  } = useStore();

  // Send OTP
  const handleSendOTP = async () => {
    const result = await sendOTP('+919876543210');
    if (result.success) {
      console.log('OTP sent!');
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otp) => {
    const result = await verifyOTP('+919876543210', otp);
    if (result.success) {
      console.log('Logged in!', user);
    }
  };

  // Create profile
  const handleCreateProfile = async (profileData) => {
    const result = await createProfile(profileData);
    if (result.success) {
      console.log('Profile created!', profile);
    }
  };

  return (
    <View>
      {isLoading && <ActivityIndicator />}
      {error && <Text>{error}</Text>}
      {/* Your UI */}
    </View>
  );
}
```

## Next Steps to Complete Integration

### 1. Update AuthScreen

Replace mock OTP with real Supabase authentication:

```javascript
// In src/screens/onboarding/AuthScreen.js
import { useStore } from '../../store/useStore';

const { sendOTP, verifyOTP, isLoading, error } = useStore();

const handleSendOTP = async () => {
  const result = await sendOTP(`+91${phone}`);
  if (result.success) {
    setOtpSent(true);
  }
};

const handleVerifyOTP = async () => {
  const result = await verifyOTP(`+91${phone}`, otp);
  if (result.success) {
    // Navigate to next screen
    navigation.navigate('IdentityStep');
  }
};
```

### 2. Update Onboarding Flow

Save wizard data to Supabase when user completes onboarding:

```javascript
// In PhotosStep.js (final step)
import { useStore } from '../../store/useStore';

const { wizardData, createProfile } = useStore();

const handleComplete = async () => {
  const profileData = {
    // Identity step
    community_id: wizardData.identity.community,
    caste_id: wizardData.identity.caste,
    managed_by: wizardData.identity.managedBy,
    
    // Basic step
    first_name: wizardData.basic.firstName,
    last_name: wizardData.basic.lastName,
    gender: wizardData.basic.gender,
    dob: wizardData.basic.dob,
    height_cm: wizardData.basic.height,
    marital_status: wizardData.basic.maritalStatus,
    
    // About step
    bio: wizardData.about.bio,
    education: wizardData.about.education,
    profession: wizardData.about.profession,
    income_range: wizardData.about.income,
    
    // Family step
    father_name: wizardData.family.fatherName,
    father_occupation: wizardData.family.fatherOccupation,
    mother_name: wizardData.family.motherName,
    mother_occupation: wizardData.family.motherOccupation,
    
    // Address step
    city: wizardData.address.city,
    state: wizardData.address.state,
  };
  
  const result = await createProfile(profileData);
  
  if (result.success) {
    // Upload photos
    // Navigate to main app
  }
};
```

### 3. Initialize Auth on App Start

```javascript
// In App.js
import { useEffect } from 'react';
import { useStore } from './src/store/useStore';

export default function App() {
  const initializeAuth = useStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
```

### 4. Update Navigation Logic

```javascript
// In AppNavigator.js
const { isAuthenticated, profile } = useStore();

// Show onboarding if authenticated but no profile
{isAuthenticated && !profile ? (
  <Stack.Screen name="Onboarding" component={OnboardingStack} />
) : isAuthenticated ? (
  // Show main app
) : (
  // Show intro/welcome
)}
```

## Testing Checklist

- [ ] Phone OTP sends successfully
- [ ] OTP verification works
- [ ] User is created in database
- [ ] Profile creation saves all fields
- [ ] Photos upload to storage
- [ ] Profile search returns results
- [ ] Connection requests work
- [ ] Chat messages send/receive
- [ ] Real-time updates work
- [ ] Logout clears session

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists with correct values
- Restart Expo dev server after adding `.env`

### "Phone auth not working"
- Enable Phone provider in Supabase dashboard
- Configure Twilio credentials
- Use correct phone format: +[country code][number]

### "RLS policy violation"
- Check that user is authenticated
- Verify RLS policies in database match your use case
- Check Supabase logs for detailed error

### "File upload fails"
- Verify storage buckets exist
- Check storage policies are configured
- Ensure file size is within limits

## Security Notes

- ✅ All API calls use Row Level Security (RLS)
- ✅ Private photos only visible to accepted connections
- ✅ Verification documents only visible to admins
- ✅ Users can only modify their own data
- ✅ Phone numbers are verified via OTP
- ✅ Environment variables keep credentials secure

## Production Checklist

Before deploying to production:

1. [ ] Set up proper Twilio account (not test mode)
2. [ ] Configure custom domain for Supabase
3. [ ] Set up proper error logging
4. [ ] Add rate limiting for OTP requests
5. [ ] Configure backup strategy
6. [ ] Set up monitoring and alerts
7. [ ] Review and test all RLS policies
8. [ ] Add analytics tracking
9. [ ] Test on real devices
10. [ ] Perform security audit

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review database logs in Supabase dashboard
- Check network requests in React Native debugger
