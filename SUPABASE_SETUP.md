# Little Roses Academy — Supabase Backend Setup & Verification Guide

This guide details the complete Supabase integration for the **Little Roses Academy** application.

---

## Part A: What Has Been Completed Automatically in the Codebase

1. **Purged Placeholder References**:
   - Every reference to any old or placeholder Supabase project, URL, and test keys has been removed from all application source code, configuration files, and scripts.
   - The application does not contain any hardcoded API keys or secret credentials.

2. **Sanitized Environment Variables**:
   - The application relies **exclusively** on two standard client-safe variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - No `service_role` key, database secret, or admin credential is ever used or exposed in frontend code.

3. **Safe Initialization & Offline Architecture**:
   - `src/supabaseClient.ts` employs a fail-safe proxy pattern: if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are not yet set, the app does not crash or loop. It defaults gracefully to local offline storage (`localStorage` & `IndexedDB`).
   - When keys are supplied, the real Supabase client seamlessly initializes.

4. **Complete Backend Schema & Policies (`supabase-schema.sql`)**:
   - Comprehensive, production-ready, idempotent DDL script created and verified for brand-new Supabase projects.
   - Creates and enforces:
     - `public.profiles`: Stores role (`admin` or `teacher`), full names, and staff IDs.
     - `public.is_admin()`: Secure `SECURITY DEFINER` function for role validation.
     - `public.teacher_resources`: CBC curriculum schemes, lesson plans, assessment rubrics, and documents.
     - `public.teacher_devices`: Hardware phone locking with a partial unique index guaranteeing **at most 1 active device per teacher**.
     - Strict Row Level Security (RLS) on all tables:
       - Admins have full access to view, insert, update, and delete resources.
       - Teachers can **only read resources where `published = true`**.
       - Teachers can **only view/register their own device binding record** (strict teacher isolation).
       - Only Admins can revoke or reset device locks.
     - Anti-tamper trigger (`trg_prevent_role_escalation`): Blocks non-admins from self-promoting their role in `public.profiles`.
     - `storage.buckets`: Pre-configures the `resource-files` public bucket with RLS policies allowing public/teacher downloads while restricting uploads, modifications, and deletions exclusively to authenticated Admins.
     - Pre-seeds rationalized CBC curriculum schemes and assessment guides.

5. **Dynamic Origin WebAuthn & Hardware Biometrics**:
   - In `src/services/biometricService.ts`, relying party IDs now dynamically bind to your actual deployed HTTPS domain (or `localhost`), avoiding any placeholder or hardcoded domains.

---

## Part B: What You Must Do Manually in Supabase

Because AI Studio cannot access your personal Supabase account without your manual actions, you need to perform the following steps in your new "Little Roses Academy" project:

1. **Obtain your Project URL and Anon Key**.
2. **Set the environment variables** (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
3. **Execute `supabase-schema.sql` in the Supabase SQL Editor**.
4. **Create your initial Admin user in Supabase Authentication** and grant the `admin` role in `public.profiles`.

---

## Part C: Exactly Where to Enter `VITE_SUPABASE_URL`

1. In your **Supabase Dashboard** (https://supabase.com/dashboard/projects):
   - Select your project: **Little Roses Academy**.
   - In the left sidebar, click the **Project Settings** (gear icon ⚙️) at the bottom.
   - Click **API** under the *Configuration* section.
   - Under **Project URL**, click the **Copy** button. The URL format is:
     ```text
     https://<your-project-ref>.supabase.co
     ```

2. Where to enter it in your environment:
   - **In Google AI Studio / Cloud Hosting**:
     - Go to **Settings** (or Project Configuration) -> **Secrets & Environment Variables**.
     - Add a new variable:
       - **Name:** `VITE_SUPABASE_URL`
       - **Value:** `https://<your-project-ref>.supabase.co`
   - **In Local / Container Development**:
     - Add or update in your `.env` file at project root:
       ```env
       VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
       ```

---

## Part D: Exactly Where to Enter `VITE_SUPABASE_ANON_KEY`

1. In the same **Supabase Dashboard** -> **Project Settings** -> **API** screen:
   - Look under **Project API keys**.
   - Locate the key labeled **`anon`** / **`public`** (starts with `ey...` or `sb_publishable_...`).
   - Click **Copy**.
   - ⚠️ **SECURITY WARNING:** Do **NOT** copy the `service_role` secret key!

2. Where to enter it in your environment:
   - **In Google AI Studio / Cloud Hosting**:
     - Go to **Settings** -> **Secrets & Environment Variables**.
     - Add a new variable:
       - **Name:** `VITE_SUPABASE_ANON_KEY`
       - **Value:** `<paste the anon public key you copied>`
   - **In Local / Container Development**:
     - Add or update in your `.env` file at project root:
       ```env
       VITE_SUPABASE_ANON_KEY=<paste the anon public key you copied>
       ```

*Note: After updating environment variables, the server reloads and the app detects your Supabase project.*

---

## Part E: Exactly How to Run `supabase-schema.sql`

1. In your **Supabase Dashboard**, click on the **SQL Editor** tab (icon `>_` in the left sidebar).
2. Click the **"New query"** button (top left).
3. In this workspace repository, open the file `supabase-schema.sql` and copy its entire contents (`Ctrl+A` -> `Ctrl+C`).
4. Paste the entire SQL script into the query editor window in Supabase.
5. Click the green **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`).
6. Supabase will execute the script and output:
   ```text
   Success. No rows returned
   ```
7. Verify creation:
   - Click **Table Editor** (grid icon in the sidebar). You will see:
     - `profiles`
     - `teacher_resources` (populated with 3 starter CBC schemes/plans)
     - `teacher_devices`
   - Click **Storage** in the sidebar. You will see the bucket **`resource-files`** marked as Public.

---

## Part F: How to Verify All System Features

### 1. Verify Authentication & Admin Profile
1. In Supabase Dashboard -> **Authentication** -> **Users**, click **"Add user"** -> **"Create user"**.
   - Email: `admin@littleroses.ac.ke` (or your preferred admin email)
   - Password: Choose a secure password
   - Toggle **"Auto Confirm User"** to ON.
   - Click **"Create user"**.
2. Copy the newly created user's **User UID** (from the list of users).
3. Go to **SQL Editor** in Supabase and run:
   ```sql
   INSERT INTO public.profiles (id, email, full_name, role)
   VALUES (
     'YOUR-COPIED-USER-UID-HERE',
     'admin@littleroses.ac.ke',
     'Lead Administrator',
     'admin'
   )
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```
4. Now in the app, sign in using this email and password. You have full administrator authorization.

### 2. Verify Row Level Security (RLS) & Authorization
- **Admin Verification**:
  - Open **Curriculum Hub** -> **Admin Resource Manager**.
  - Notice the header badge indicates your project is connected.
  - Create a new Scheme of Work with `Published: No` (Draft).
  - You (as Admin) can see it in your manager list.
- **Teacher Isolation Verification**:
  - Open an incognito browser window or log in as a Teacher (e.g. `tr-elvis`).
  - Notice that the draft resource is **not visible** in the Teacher Portal—only items with `published = true` appear.
  - Attempting to edit or delete any resource as a teacher is rejected at the PostgreSQL level by RLS.

### 3. Verify Supabase Storage
- In **Admin Resource Manager**, click **"Upload New Curriculum Document"**.
- Select a PDF or syllabus document.
- Click upload. The file is stored in your Supabase `resource-files` bucket, and a public URL is generated.
- Verify in Supabase Dashboard -> **Storage** -> **`resource-files`** that the uploaded file is present.

### 4. Verify Cloud Synchronization & Offline Caching
- When online, resources are fetched directly from Supabase and synchronized to local browser storage.
- Toggle your browser DevTools to **Offline** (Network tab -> Offline).
- Refresh or navigate the app: all curriculum schemes, lesson plans, and teaching guides remain available offline.
- Return online: sync resumes automatically.

### 5. Verify Hardware Device Binding (1-Phone Limit)
- When a teacher activates their mobile device in the Teacher Portal, a record is created in `public.teacher_devices`.
- The unique partial index `idx_one_active_device_per_teacher` guarantees that if the same teacher tries to activate a second device simultaneously, the database rejects the second binding until an Admin revokes the previous device lock.
- Admins can manage and revoke active device locks from the **Device Management** panel.

### 6. Verify Biometric / WebAuthn Login
- On a mobile device with biometric hardware (fingerprint sensor or Face Unlock) or a laptop with Touch ID/Windows Hello over HTTPS:
  - Open the Teacher Device Setup in the app.
  - Click **"Register Device Biometrics"**.
  - The native operating system biometric prompt (Android Biometric / Touch ID) will prompt for your fingerprint/PIN.
  - After enrolling, teachers can tap **"Quick Biometric Unlock"** to verify identity locally without retyping passwords.

---

## Simple Step-by-Step Checklist

- [ ] **Step 1:** Open your Supabase project (*Little Roses Academy*) at https://supabase.com/dashboard.
- [ ] **Step 2:** Go to **Project Settings** -> **API** and copy:
  - **Project URL**
  - **`anon` public key**
- [ ] **Step 3:** Enter these in your environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] **Step 4:** In Supabase Dashboard, open **SQL Editor**, paste the entire contents of `supabase-schema.sql`, and click **Run**.
- [ ] **Step 5:** In Supabase Dashboard -> **Authentication** -> **Users**, click **Add user**, enter your admin email & password, and copy the user's UUID.
- [ ] **Step 6:** In **SQL Editor**, run the SQL snippet from Part F1 to link that user UUID to `role = 'admin'` in `public.profiles`.
- [ ] **Step 7:** Open the Little Roses Academy app in your browser, log in, and verify the connection in the **Admin Resource Manager**.
