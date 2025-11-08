-- ============================================
-- PROOF-OF-LEARNING BADGES (NFT Credentials)
-- Students earn badges for 5-star reviews
-- ============================================

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  homework_id UUID REFERENCES homeworks(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Badge metadata
  badge_title TEXT NOT NULL,
  badge_description TEXT,
  badge_image_url TEXT NOT NULL,
  skill_verified TEXT NOT NULL, -- "Python Basics", "Math Algebra", etc.

  -- Simulated blockchain data
  token_id TEXT NOT NULL UNIQUE, -- #42069
  blockchain_network TEXT DEFAULT 'EduChain Testnet',
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Task details
  task_title TEXT NOT NULL,
  review_score INTEGER NOT NULL DEFAULT 5 CHECK (review_score = 5), -- Only 5-star reviews
  teacher_name TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_badges_student ON badges(student_id);
CREATE INDEX idx_badges_homework ON badges(homework_id);
CREATE INDEX idx_badges_teacher ON badges(teacher_id);
CREATE INDEX idx_badges_token ON badges(token_id);
CREATE INDEX idx_badges_skill ON badges(skill_verified);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Everyone can view badges (they're public credentials)
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- Anyone can create badges (system/frontend creates them)
CREATE POLICY "Anyone can create badges"
  ON badges FOR INSERT
  WITH CHECK (true);

-- Only the badge owner can delete (in case they want to re-mint)
CREATE POLICY "Users can delete own badges"
  ON badges FOR DELETE
  USING (student_id IN (SELECT id FROM profiles WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'));
