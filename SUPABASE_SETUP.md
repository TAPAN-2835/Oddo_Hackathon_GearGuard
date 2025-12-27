# Supabase Backend Integration Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: GearGuard
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for project to be provisioned (~2 minutes)

---

## Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. Wait for completion (should see "Success" message)
7. Verify tables were created:
   - Go to **Table Editor**
   - You should see: profiles, teams, equipment, maintenance_requests, etc.

---

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 4: Configure Environment Variables

1. In your project root, create a `.env` file
2. Copy contents from `.env.example`
3. Replace with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Save the file
5. **IMPORTANT**: Never commit `.env` to git (it's in `.gitignore`)

---

## Step 5: Install Supabase Client

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

---

## Step 6: Test the Connection

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open browser console (F12)
3. You should NOT see any Supabase errors
4. If you see "Missing Supabase environment variables", check your `.env` file

---

## Step 7: Create First User

1. Go to your app's signup page
2. Create a new account with:
   - Email: admin@gearguard.com
   - Password: (your choice, min 6 characters)
   - Name: Admin User

3. Check Supabase dashboard:
   - Go to **Authentication** → **Users**
   - You should see your new user
   - Go to **Table Editor** → **profiles**
   - You should see the profile entry

---

## Step 8: Update User Role to Admin

1. In Supabase dashboard, go to **Table Editor** → **profiles**
2. Find your user
3. Click the row to edit
4. Change `role` from `technician` to `admin`
5. Click "Save"

---

## Step 9: Test Real-time Features

1. Open your app in two browser windows
2. In window 1: Create a maintenance request
3. In window 2: Dashboard should update automatically
4. This confirms real-time subscriptions are working

---

## Step 10: Verify All Features

Test each feature:

- ✅ Login/Signup with Supabase Auth
- ✅ Create equipment
- ✅ Create maintenance request
- ✅ View dashboard stats (real data)
- ✅ Notifications appear
- ✅ Reports show real analytics
- ✅ Data persists after refresh

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env` file exists in project root
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env`

### Error: "Invalid API key"
- Double-check you copied the **anon public** key, not the service role key
- Make sure there are no extra spaces in `.env`

### Tables not created
- Re-run the migration SQL
- Check for error messages in SQL editor
- Verify you're in the correct project

### Login not working
- Check browser console for errors
- Verify email confirmation is disabled in Supabase:
  - Go to **Authentication** → **Settings**
  - Disable "Enable email confirmations"

### Real-time not working
- Check browser console for subscription errors
- Verify RLS policies are set correctly
- Try refreshing the page

---

## Next Steps

Once everything is working:

1. Add more users via signup
2. Create teams and equipment
3. Test all CRUD operations
4. Verify real-time updates
5. Check reports and analytics

---

## Database Schema Overview

**Tables Created:**
- `profiles` - User profiles
- `teams` - Maintenance teams
- `equipment_categories` - Equipment types
- `equipment` - Equipment inventory
- `work_centers` - Work locations
- `technicians` - Technician assignments
- `maintenance_requests` - Work orders
- `notifications` - User notifications

**Features:**
- Row Level Security (RLS) enabled
- Real-time subscriptions
- Auto-generated request numbers
- Automatic timestamps
- Foreign key relationships

---

## Security Notes

- RLS policies protect all data
- Users can only see their own notifications
- Admins can manage all data
- Technicians can update assigned requests
- All queries are type-safe with TypeScript

---

**You're all set! Your app now has a production-ready backend with Supabase.** 🎉
