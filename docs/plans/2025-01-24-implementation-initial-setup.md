# Initial Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (or superpowers:executing-plans) to implement this plan task-by-task.

**Goal:** Initialize the React Native (Expo) project, set up Supabase integration, and establish the testing framework.

**Architecture:** 
- **Frontend:** React Native (Expo SDK 50+) using TypeScript.
- **Backend:** Supabase JS Client for auth/db interaction.
- **Testing:** Jest + React Native Testing Library.

**Tech Stack:** React Native, Expo, TypeScript, Supabase, Jest.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `apps/matrimony-app/` (We will use a monorepo-like structure or just put the app in the root if preferred. Let's put it in the root for simplicity as it's the only app).
- Modify: `package.json`

**Step 1: Initialize Expo Project**
*Action:* Run the initialization command.
```bash
# We are in the worktree root.
npx create-expo-app . --template blank-typescript
```
*Note:* This might complain if the directory is not empty (it has `docs/`). We might need to use a subfolder or force it. 
*Correction:* Best practice is to create it in a subfolder like `app` or just run it and move files. 
Let's use `npx create-expo-app app --template blank-typescript` to keep it clean, then we can move `docs` inside or keep them side-by-side. 
*Decision:* Create in `app/` directory.

**Step 2: Verify Installation**
*Action:* Check if `app/package.json` exists.
```bash
ls app/package.json
```

**Step 3: Commit**
```bash
git add app/
git commit -m "chore: initialize expo app"
```

---

### Task 2: Configure Testing Infrastructure

**Files:**
- Modify: `app/package.json`
- Create: `app/jest.config.js` (if not created)

**Step 1: Install Test Dependencies**
```bash
cd app
npm install --save-dev jest jest-expo @testing-library/react-native @types/jest
```

**Step 2: Configure Jest**
Add/Modify `package.json` scripts:
```json
"scripts": {
  "test": "jest"
}
```

**Step 3: Verify with a Dummy Test**
Create `app/__tests__/smoke.test.ts`:
```typescript
describe('Smoke Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
```

**Step 4: Run Test**
```bash
npm test
```

**Step 5: Commit**
```bash
git add package.json package-lock.json __tests__/smoke.test.ts
git commit -m "chore: setup testing infrastructure"
```

---

### Task 3: Supabase Client Setup (TDD)

**Files:**
- Create: `app/lib/supabase.ts`
- Create: `app/lib/__tests__/supabase.test.ts`
- Create: `app/.env` (and `.env.example`)

**Step 1: Install Supabase Client**
```bash
cd app
npm install @supabase/supabase-js AsyncStorage @react-native-async-storage/async-storage
```

**Step 2: Write Failing Test (Missing Client)**
Create `app/lib/__tests__/supabase.test.ts`:
```typescript
import { supabase } from '../supabase';

describe('Supabase Client', () => {
  it('should be defined', () => {
    expect(supabase).toBeDefined();
  });
});
```

**Step 3: Run Test (Fail)**
```bash
npm test
# Should fail because '../supabase' does not exist
```

**Step 4: Implement Supabase Client**
Create `app/lib/supabase.ts`:
```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```
*Note:* Also need to install `react-native-url-polyfill`.
```bash
npm install react-native-url-polyfill
```

**Step 5: Run Test (Pass)**
```bash
npm test
```

**Step 6: Commit**
```bash
git add lib/supabase.ts lib/__tests__/supabase.test.ts package.json package-lock.json
git commit -m "feat: setup supabase client"
```

---

### Task 4: Basic Directory Structure

**Files:**
- Create: `app/src/components/`
- Create: `app/src/screens/`
- Create: `app/src/navigation/`
- Create: `app/src/types/`

**Step 1: Create Directories**
```bash
cd app
mkdir -p src/components src/screens src/navigation src/types
```

**Step 2: Commit**
```bash
git add src/
git commit -m "chore: scaffold source directories"
```
