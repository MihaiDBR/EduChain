-- ============================================
-- QUICK VERIFICATION SCRIPT
-- Run this after applying all migrations
-- ============================================

-- 1. Check all required tables exist
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✅ ALL TABLES EXIST'
    ELSE '❌ MISSING TABLES: ' || (4 - COUNT(*))::text
  END as table_status,
  array_agg(table_name) as found_tables
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('submissions', 'task_resources', 'homeworks', 'enrollments');

-- 2. Check storage buckets exist
SELECT
  CASE
    WHEN COUNT(*) = 2 THEN '✅ ALL BUCKETS EXIST'
    ELSE '❌ MISSING BUCKETS: ' || (2 - COUNT(*))::text
  END as bucket_status,
  array_agg(name) as found_buckets
FROM storage.buckets
WHERE id IN ('submissions', 'task-resources');

-- 3. Verify deadline column is REMOVED
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✅ DEADLINE REMOVED (CORRECT)'
    ELSE '❌ DEADLINE STILL EXISTS (NEEDS CLEANUP)'
  END as deadline_status
FROM information_schema.columns
WHERE table_name = 'homeworks'
AND column_name = 'deadline';

-- 4. Check enrollment fields
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✅ ALL ENROLLMENT FIELDS EXIST'
    ELSE '❌ MISSING FIELDS: ' || (4 - COUNT(*))::text
  END as enrollment_fields_status,
  array_agg(column_name) as found_fields
FROM information_schema.columns
WHERE table_name = 'enrollments'
AND column_name IN ('submission_text', 'completed_at', 'review_score', 'review_comment');

-- 5. Check submissions table structure
SELECT
  CASE
    WHEN COUNT(*) >= 8 THEN '✅ SUBMISSIONS TABLE COMPLETE'
    ELSE '❌ SUBMISSIONS TABLE INCOMPLETE'
  END as submissions_status,
  array_agg(column_name) as found_columns
FROM information_schema.columns
WHERE table_name = 'submissions';

-- 6. Check task_resources table structure
SELECT
  CASE
    WHEN COUNT(*) >= 6 THEN '✅ TASK_RESOURCES TABLE COMPLETE'
    ELSE '❌ TASK_RESOURCES TABLE INCOMPLETE'
  END as task_resources_status,
  array_agg(column_name) as found_columns
FROM information_schema.columns
WHERE table_name = 'task_resources';

-- ============================================
-- SUMMARY: If all checks show ✅, you're good to go!
-- ============================================
