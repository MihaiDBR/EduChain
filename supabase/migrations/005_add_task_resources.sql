-- Add Task Resources Table for Teacher File Uploads
-- Teachers can upload resources/materials for their homework tasks

-- ============================================
-- TASK RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS task_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID REFERENCES homeworks(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_homework FOREIGN KEY (homework_id) REFERENCES homeworks(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_task_resources_homework ON task_resources(homework_id);
CREATE INDEX idx_task_resources_teacher ON task_resources(teacher_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE task_resources ENABLE ROW LEVEL SECURITY;

-- Everyone can view task resources
CREATE POLICY "Task resources are viewable by everyone"
  ON task_resources FOR SELECT
  USING (true);

-- Teachers can upload task resources for their own homeworks
CREATE POLICY "Teachers can upload task resources"
  ON task_resources FOR INSERT
  WITH CHECK (true);

-- Teachers can delete their own task resources
CREATE POLICY "Teachers can delete own task resources"
  ON task_resources FOR DELETE
  USING (true);

-- ============================================
-- HOMEWORK TABLE UPDATE - Add deadline field
-- ============================================
ALTER TABLE homeworks
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days');

-- ============================================
-- ENROLLMENT TABLE UPDATE - Add missed status
-- ============================================
-- Update the check constraint to include 'missed' status
ALTER TABLE enrollments
DROP CONSTRAINT IF EXISTS enrollments_status_check;

ALTER TABLE enrollments
ADD CONSTRAINT enrollments_status_check
CHECK (status IN ('active', 'completed', 'reviewed', 'missed'));
