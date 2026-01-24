# Implementation Plan: Matrimony App Frontend (UI First)
**Date:** 2025-01-24
**Strategy:** UI First (Mock Data), Backend Later

## Phase 1: Foundation & Navigation
**Goal:** Establish the app shell and navigation structure.
1.  **Setup Navigation:** Install `react-navigation` (Bottom Tabs + Native Stack).
2.  **Theming:** Define Colors (Brand Red/Gold?), Typography, and Spacing.
3.  **Shell Layout:** Implement **Bottom Tab Bar**:
    *   **Home** (Matches)
    *   **Connection** (Requests)
    *   **Chats** (Messages)
    *   **Profile** (Dashboard)

## Phase 2: Onboarding Wizard (Lazy Auth)
**Goal:** "Value First" entry flow.
1.  **State Store:** Setup Zustand/Context for wizard data.
2.  **Wizard UI:**
    *   **Step 1 (Identity):** Name, DOB, Gender.
    *   **Step 2 (Community):** Caste/Subcaste selectors.
    *   **Step 3 (Work):** Education, Profession, Income.
    *   **Step 4 (Family):** Parents' details.
3.  **Photos:** Image picker for Profile & ID.
4.  **Auth Screen:** Phone + OTP Input (Simulated).

## Phase 3: Home Tab (Discovery)
**Goal:** Main browsing experience.
1.  **Match Card:** High-fidelity design (Photo, Name, Age, Job, City).
2.  **Feed:** Vertical scroll with Mock Data.
3.  **Actions:** "Connect" and "Pass" buttons.
4.  **Filters:** Header modal for Age, Height, Location.

## Phase 4: Connections & Chat
**Goal:** Manage interactions.
1.  **Connection Tab:**
    *   **Received:** List with Accept/Decline.
    *   **Sent:** List with Cancel.
2.  **Chats Tab:** List of active conversations.

## Phase 5: Profile & Dashboard
**Goal:** User hub.
1.  **Dashboard:**
    *   **Stats:** "Requests Received" counter.
    *   **Verification:** Status badge + Upload link.
2.  **Actions:**
    *   **Edit:** Re-enter Wizard.
    *   **Delete:** Account deletion flow.
