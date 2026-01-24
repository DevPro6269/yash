# Matrimony App - React Native Frontend

A full-fledged matrimony mobile application built with React Native and Expo, featuring a beautiful gradient theme and comprehensive user flow.

## Features

### 🎨 Design
- Custom gradient theme: `linear-gradient(112.74deg, #46001C 0.1%, #AC0045 99.9%)`
- Modern, clean UI with card-based layouts
- Smooth animations and transitions
- Responsive design for all screen sizes

### 📱 Screens & Features

#### Onboarding Wizard (6 Steps)
1. **Identity Step** - Profile creation details, community, and caste selection
2. **Basic Step** - Name, DOB, and height information
3. **About Step** - Education, profession, income, and bio
4. **Family Step** - Family details (parents' information)
5. **Address Step** - State, city, and residential address
6. **Photos Step** - Profile photo upload with image picker
7. **Auth Screen** - Phone verification with OTP (simulated)

#### Main App (Bottom Tabs)
1. **Home Tab** - Match discovery feed with profile cards
   - Swipeable profile cards
   - Detailed profile information
   - Connect button
   - Filter options (modal)

2. **Connections Tab** - Manage connection requests
   - Received requests (Accept/Decline)
   - Sent requests (with status)
   - Cancel pending requests

3. **Chats Tab** - Conversations list
   - Chat preview with last message
   - Unread count badges
   - Real-time chat interface (mock)

4. **Profile Tab** - User dashboard
   - Profile summary with photo
   - Completion percentage
   - Statistics (requests, matches)
   - Verification status
   - Edit profile, pause, logout, delete account options

### 🛠 Tech Stack
- **React Native** with Expo
- **React Navigation** (Stack + Bottom Tabs)
- **Zustand** for state management
- **Expo Linear Gradient** for gradient backgrounds
- **Expo Image Picker** for photo uploads
- **Expo Vector Icons** (Ionicons)

### 📦 Project Structure
```
yash/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   └── Badge.js
│   ├── screens/
│   │   ├── onboarding/      # Wizard screens
│   │   │   ├── IdentityStep.js
│   │   │   ├── BasicStep.js
│   │   │   ├── AboutStep.js
│   │   │   ├── FamilyStep.js
│   │   │   ├── AddressStep.js
│   │   │   ├── PhotosStep.js
│   │   │   └── AuthScreen.js
│   │   ├── tabs/            # Main app tabs
│   │   │   ├── HomeScreen.js
│   │   │   ├── ConnectionsScreen.js
│   │   │   ├── ChatsScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── ChatDetailScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── theme/               # Design tokens
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   ├── store/
│   │   └── useStore.js      # Zustand store
│   └── data/
│       └── mockData.js      # Mock profiles & data
├── App.js
├── package.json
└── app.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## Mock Data

The app uses mock data for demonstration:
- 5 sample profiles with photos
- Mock connection requests (sent/received)
- Sample chat conversations
- Pre-populated dropdown options (communities, castes, states, etc.)

## State Management

Using Zustand for lightweight state management:
- User authentication state
- Wizard form data (persisted across steps)
- User profile data

## Navigation Flow

```
App Start
  ↓
Onboarding Wizard (if not authenticated)
  ├── Identity Step
  ├── Basic Step
  ├── About Step
  ├── Family Step
  ├── Address Step
  ├── Photos Step
  └── Auth Screen
        ↓
Main App (Bottom Tabs)
  ├── Home (Match Discovery)
  ├── Connections (Requests)
  ├── Chats (Conversations)
  │     └── Chat Detail Screen
  └── Profile (Dashboard)
```

## Theme Colors

- **Primary Gradient**: `#46001C` → `#AC0045`
- **Secondary**: Gold (`#FFD700`)
- **Background**: White, Light Gray
- **Text**: Primary, Secondary, Light
- **Status**: Success, Error, Warning, Info

## Future Enhancements

- Backend API integration
- Real authentication with OTP
- Real-time chat with WebSocket
- Advanced filtering and search
- Subscription and payment integration
- Push notifications
- Photo verification
- Video calls
- Advanced matching algorithm

## License

This is a demonstration project for educational purposes.

## Author

Built with ❤️ for matrimony matchmaking
