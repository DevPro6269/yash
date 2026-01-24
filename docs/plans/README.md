# Matrimony App – Frontend Design & Flow Plan (UI First)

**Project:** Matrimony Mobile App  
**Approach:** UI First (Mock Data → Backend Later)  
**Date:** 2025-01-24  
**Target:** React Native (Expo / CLI)

---

## 🎯 Objective

Design and implement the **complete frontend UI & user flow** of a matrimony app using mock data.
Backend, APIs, and real authentication will be integrated in later phases.

This document defines:
- Screen flow
- Navigation structure
- UI components
- Design-first development plan

---

## 🧭 Overall Navigation Structure

**Primary Navigation:** Bottom Tab Bar

Tabs:
1. **Home** – Match Discovery
2. **Connections** – Requests (Sent / Received)
3. **Chats** – Conversations
4. **Profile** – Dashboard & Settings

Navigation Stack:
- Root Stack
  - Onboarding Wizard
  - Auth (Phone + OTP)
  - Main Tabs

---

## Phase 1: Foundation & App Shell

### 🎯 Goal
Set up navigation, theming, and app skeleton.

### Tasks
- Install & configure `react-navigation`
  - Native Stack Navigator
  - Bottom Tab Navigator
- Define global theme
  - Colors (Primary: Red / Gold)
  - Typography (Headings, Body, Labels)
  - Spacing & radius tokens
- Create reusable UI primitives
  - Button
  - Input
  - Card
  - Badge

### Bottom Tabs
- **Home** (Matches)
- **Connections** (Requests)
- **Chats**
- **Profile**

---

## Phase 2: Onboarding Wizard (Lazy Authentication)

### 🎯 Goal
Show value first, collect profile data before forcing signup.

### State Management
- Use **Zustand** or **Context API**
- Store wizard data locally until submission

### Wizard Steps

#### Step 1: Identity
- By whom Profile is being made
- Community
- Caste

#### Step 2: Basic
- First Name
- Last Name
- DOB
- Height

#### Step 3: About
- Education
- Profession
- Income Range
- Bio

#### Step 4: Family Details
- Father Name
- Father Occupation
- Mother Name
- Mother Occupation

#### Step 5: Address
- State
- City
- Residental Address

#### Step 5: Photos
- Profile Photo Upload

### Auth Screen (Simulated)
- Phone Number Input
- OTP Input

---

## Phase 3: Home Tab – Match Discovery

### 🎯 Goal
Core browsing experience.

### UI Components

#### Match Card
- Profile Photo
- Name
- Age
- Profession
- City
- Verification Status

#### Feed
- Vertical scroll
- Mock profile data
- Card-based layout

#### Actions
- **Connect** (Primary CTA)


#### Filters (Modal / Bottom Sheet)
- Age Range
- Height Range
- Location
- Education

---

## Phase 4: Connections & Chats

### 🎯 Goal
Manage user interactions.

### Connections Tab

#### Received Requests
- Profile preview
- Accept / Decline buttons

#### Sent Requests
- Status indicator
- Cancel option

---

### Chats Tab

- List of conversations
- Profile photo
- Last message preview
- Timestamp
- Unread count badge

> Chat UI can be mocked (no real-time logic yet)

---

## Phase 5: Profile & Dashboard

### 🎯 Goal
User control center.

### Dashboard Sections

#### Profile Summary
- Profile photo
- Name, Age, City
- Completion percentage

#### Stats
- Requests Received
- Requests Sent
- Matches

#### Verification
- Status badge (Pending / Verified / Rejected)
- Upload ID CTA

### Actions
- Edit Profile (Re-enter Wizard)
- Pause Profile
- Delete Account (Confirmation Flow)

---

## 🧱 UI Design Principles

- Mobile-first
- Clean & minimal
- Indian matrimony UX patterns
- Clear CTAs
- Soft colors, readable typography
- Avoid information overload

---

## 🚀 Future Enhancements (Out of Scope Now)

- Backend API integration
- Real OTP & auth
- Real-time chat
- Subscription & payments
- Advanced matching algorithm

---

## ✅ Deliverables (UI Phase)

- Fully navigable app
- Mock data everywhere
- Reusable components
- Production-ready UI structure

---

## 🧠 Notes

- Backend contracts will be defined after UI freeze
- This plan supports gradual backend integration
- Screens should be built as isolated, testable components

---
