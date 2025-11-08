# 🚨 DATABASE SETUP REQUIRED

## Current Problem

Your application shows these errors:
- ❌ "Error fetching submissions"
- ❌ "Error fetching task resources"
- ❌ File uploads are broken

**Root cause:** Database tables `submissions` and `task_resources` don't exist yet.

---

## Solution: Run Migrations in Supabase Dashboard

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project
   - Click on **SQL Editor** in the left menu

2. **Run These Migrations in Order:**

   **Migration 003** - Submissions Table
   ```
   📁 Open: supabase/migrations/003_add_submissions.sql
   ➡️ Copy all contents → Paste in SQL Editor → Click "Run"
   ```

   **Migration 004** - Enrollment Fields
   ```
   📁 Open: supabase/migrations/004_add_enrollment_fields.sql
   ➡️ Copy all contents → Paste in SQL Editor → Click "Run"
   ```

   **Migration 005** - Task Resources Table
   ```
   📁 Open: supabase/migrations/005_add_task_resources.sql
   ➡️ Copy all contents → Paste in SQL Editor → Click "Run"
   ```

   **Migration 006** - Storage Setup + Cleanup ⭐ **IMPORTANT**
   ```
   📁 Open: supabase/migrations/006_setup_storage_and_cleanup.sql
   ➡️ Copy all contents → Paste in SQL Editor → Click "Run"
   ```

3. **Verify Everything Worked**
   ```
   📁 Open: supabase/verify_migrations.sql
   ➡️ Copy all contents → Paste in SQL Editor → Click "Run"
   ✅ You should see all checks showing green checkmarks
   ```

4. **Refresh Your Application**
   - Reload the page in your browser
   - Errors should be gone
   - File uploads should work

---

## What Gets Fixed:

✅ Creates `submissions` table for student file uploads
✅ Creates `task_resources` table for teacher resource uploads
✅ Creates storage buckets: `submissions` and `task-resources`
✅ Sets up all security policies automatically
✅ Removes deadline functionality (cleaned up)
✅ Adds submission fields to enrollments
✅ Enables file upload error handling with detailed feedback

---

## After Setup:

### Test File Uploads:

**As a Teacher:**
1. Create a new homework/task
2. Upload resource files (PDF, images, etc.)
3. ✅ Should see success message with file name

**As a Student:**
1. Enroll in a homework
2. Upload submission files
3. ✅ Should see success message with file name

---

## Need Help?

**If migrations fail:**
- Make sure you're using the project owner account in Supabase
- Try running one migration at a time
- Check the error message in SQL Editor

**If storage buckets don't create:**
- Go to Storage section in Supabase dashboard
- Manually create two buckets:
  - Name: `submissions` (make it public)
  - Name: `task-resources` (make it public)
- Then re-run migration 006

**Still having issues?**
- Check `supabase/apply-migrations.md` for detailed troubleshooting
- Run `supabase/verify_migrations.sql` to see what's missing

---

## Files Created:

- ✅ `supabase/migrations/006_setup_storage_and_cleanup.sql` - New migration
- ✅ `supabase/verify_migrations.sql` - Verification script
- ✅ `supabase/apply-migrations.md` - Updated with latest instructions
- ✅ File upload error handling improved in:
  - `frontend/app/dashboard/teacher/create-homework/page.tsx`
  - `frontend/app/dashboard/teacher/homework/[id]/page.tsx`
  - `frontend/app/dashboard/student/homework/[id]/page.tsx`
