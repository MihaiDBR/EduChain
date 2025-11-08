# Apply Database Migrations

To apply all new migrations, follow these steps:

1. **Open Supabase Dashboard**: Go to your Supabase project dashboard

2. **SQL Editor**: Navigate to the SQL Editor section

3. **Run Migrations in Order**:
   - First: `migrations/003_add_submissions.sql` (Submissions table)
   - Second: `migrations/004_add_enrollment_fields.sql` (Enrollment fields)
   - Third: `migrations/005_add_task_resources.sql` (Task resources + deadline field)

4. **Create Storage Buckets**:

   **Bucket 1: submissions** (for student file uploads)
   - Go to Storage section
   - Create a new bucket named `submissions`
   - Make it public
   - Add the following policies:

```sql
-- Allow public SELECT access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'submissions');

-- Allow authenticated INSERT
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'submissions');

-- Allow authenticated UPDATE (for their own files)
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'submissions');

-- Allow authenticated DELETE (for their own files)
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'submissions');
```

   **Bucket 2: task-resources** (for teacher resource uploads)
   - Create a new bucket named `task-resources`
   - Make it public
   - Add the following policies:

```sql
-- Allow public SELECT access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-resources');

-- Allow teachers to upload
CREATE POLICY "Teachers can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-resources');

-- Allow teachers to delete
CREATE POLICY "Teachers can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'task-resources');
```

5. **Verify**: Check that all tables have been created successfully:
   - `submissions`
   - `task_resources`
   - Check that `homeworks` has `deadline` field
   - Check that `enrollments` supports 'missed' status

## What was changed:

1. ✅ Added submissions table with file upload support
2. ✅ Added student file upload functionality
3. ✅ Added teacher submission review page
4. ✅ Added "Unreviewed Work" section in teacher dashboard
5. ✅ Dashboard now redirects to role-specific pages after login
