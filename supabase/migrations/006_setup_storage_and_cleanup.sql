-- ============================================
-- Setup Storage Buckets and Cleanup
-- ============================================

-- ============================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================

-- Create submissions bucket (for student file uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Create task-resources bucket (for teacher file uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-resources', 'task-resources', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. STORAGE POLICIES - SUBMISSIONS BUCKET
-- ============================================

-- Allow everyone to read submissions
CREATE POLICY IF NOT EXISTS "Public Access to Submissions"
ON storage.objects FOR SELECT
USING (bucket_id = 'submissions');

-- Allow authenticated users to upload submissions
CREATE POLICY IF NOT EXISTS "Authenticated users can upload submissions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');

-- Allow users to delete their own submissions
CREATE POLICY IF NOT EXISTS "Users can delete own submissions"
ON storage.objects FOR DELETE
USING (bucket_id = 'submissions' AND auth.role() = 'authenticated');

-- Allow users to update their own submissions
CREATE POLICY IF NOT EXISTS "Users can update own submissions"
ON storage.objects FOR UPDATE
USING (bucket_id = 'submissions' AND auth.role() = 'authenticated');

-- ============================================
-- 3. STORAGE POLICIES - TASK-RESOURCES BUCKET
-- ============================================

-- Allow everyone to read task resources
CREATE POLICY IF NOT EXISTS "Public Access to Task Resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-resources');

-- Allow authenticated users to upload task resources
CREATE POLICY IF NOT EXISTS "Authenticated users can upload task resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-resources' AND auth.role() = 'authenticated');

-- Allow users to delete their own task resources
CREATE POLICY IF NOT EXISTS "Users can delete own task resources"
ON storage.objects FOR DELETE
USING (bucket_id = 'task-resources' AND auth.role() = 'authenticated');

-- Allow users to update their own task resources
CREATE POLICY IF NOT EXISTS "Users can update own task resources"
ON storage.objects FOR UPDATE
USING (bucket_id = 'task-resources' AND auth.role() = 'authenticated');

-- ============================================
-- 4. CLEANUP - Remove deadline column (no longer needed)
-- ============================================
ALTER TABLE homeworks
DROP COLUMN IF EXISTS deadline;

-- Update enrollments status constraint (remove 'missed' since no deadline)
ALTER TABLE enrollments
DROP CONSTRAINT IF EXISTS enrollments_status_check;

ALTER TABLE enrollments
ADD CONSTRAINT enrollments_status_check
CHECK (status IN ('active', 'completed', 'reviewed'));
