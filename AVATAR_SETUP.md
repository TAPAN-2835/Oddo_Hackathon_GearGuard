# Supabase Storage Setup for Avatars

## Quick Setup Guide

Since the Supabase CLI isn't available, follow these steps to set up avatar storage:

### Step 1: Create Storage Bucket

1. Open your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Enter bucket name: `avatars`
5. Check **"Public bucket"** (allows public read access)
6. Click **"Create bucket"**

### Step 2: Configure Storage Policies (Optional)

For better security, add these RLS policies in the SQL Editor:

```sql
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Test the Setup

1. Run your app: `npm run dev`
2. Login to your account
3. Go to Profile page
4. Click "Change Avatar"
5. Try uploading an image or generating a DiceBear avatar
6. Verify the avatar appears in the TopNav

## Troubleshooting

**Error: "Storage bucket not found"**
- Make sure you created the `avatars` bucket in Supabase Dashboard
- Verify the bucket name is exactly `avatars` (lowercase)

**Error: "Permission denied"**
- Ensure the bucket is set to Public
- Or add the RLS policies above for authenticated access

**Avatar not updating**
- Check browser console for errors
- Verify your Supabase URL and anon key in `.env`
- Make sure you're logged in

## Done!

Once the bucket is created, the avatar system is fully functional and ready for your hackathon demo! 🎉
