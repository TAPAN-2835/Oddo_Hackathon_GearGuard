-- Migration: Create avatars storage bucket and RLS policies
-- Description: Sets up storage bucket for user avatars with proper security policies

-- ============================================================================
-- STORAGE BUCKET CREATION
-- ============================================================================

-- Create the avatars storage bucket (public for read access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Policy: Allow authenticated users to upload their own avatars
-- Users can only upload to their own folder (avatars/{user_id}/*)
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to all avatars
-- Anyone can view avatars (needed for displaying user profiles)
CREATE POLICY "Public avatar access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Allow users to update their own avatars
-- Users can only update files in their own folder
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own avatars
-- Users can only delete files in their own folder
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- VERIFICATION QUERIES (Optional - for testing)
-- ============================================================================

-- Check if bucket was created successfully
-- SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check if policies were created successfully
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
