# Supabase Backend Integration - Quick Setup Summary

## 🚀 Quick Start (5 Minutes)

### 1. Create Supabase Project
- Go to https://supabase.com → New Project
- Name: **GearGuard**
- Choose region & create password
- Wait ~2 minutes for provisioning

### 2. Run Database Migration
1. Open Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Copy ALL contents from: `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Verify success (check Table Editor for tables)

### 3. Get API Credentials
- Go to **Settings** → **API**
- Copy:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **anon public key**: `eyJ...`

### 4. Configure Environment
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Install & Run
```bash
npm install @supabase/supabase-js
npm run dev
```

### 6. Create Admin User
1. Go to signup page
2. Create account: `admin@gearguard.com`
3. In Supabase: **Table Editor** → **profiles**
4. Change role from `technician` to `admin`

### 7. Disable Email Confirmation (Important!)
- **Authentication** → **Settings**
- **Disable** "Enable email confirmations"
- Save

## ✅ What's Included

**Database Tables:**
- ✅ profiles (users)
- ✅ teams
- ✅ equipment
- ✅ maintenance_requests
- ✅ work_centers
- ✅ technicians
- ✅ notifications
- ✅ equipment_categories

**Features:**
- ✅ Row Level Security (RLS)
- ✅ Real-time subscriptions
- ✅ Auto-generated request numbers
- ✅ TypeScript types
- ✅ Service layer (CRUD operations)

**Services Created:**
- `auth.service.ts` - Authentication
- `equipment.service.ts` - Equipment CRUD
- `requests.service.ts` - Maintenance requests
- `teams.service.ts` - Teams management
- `workcenters.service.ts` - Work centers
- `notifications.service.ts` - Notifications

## 🔧 Updated Components

**Authentication:**
- ✅ Login - Uses Supabase Auth
- ✅ SignUp - Creates user + profile
- ✅ App.tsx - Session management
- ✅ Protected routes

**Ready to Update:**
- Dashboard (use real stats)
- Equipment page (CRUD with DB)
- Modals (save to DB)
- Reports (real analytics)

## 📝 Test Checklist

After setup:
1. ✅ Login works
2. ✅ Signup creates user
3. ✅ Dashboard loads
4. ✅ No console errors
5. ✅ Session persists on refresh

## 🐛 Common Issues

**"Missing environment variables"**
→ Check `.env` file, restart dev server

**"Invalid API key"**
→ Use **anon public** key, not service role

**Login fails**
→ Disable email confirmations in Supabase

**Tables not found**
→ Re-run migration SQL

---

**Next:** Update components to use real data from Supabase! 🎉
