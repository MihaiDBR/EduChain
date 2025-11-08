export type UserRole = 'teacher' | 'student' | 'both';
export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TaskStatus = 'active' | 'completed' | 'cancelled';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'stake' | 'reward' | 'penalty' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type ChatRoomType = 'task_discussion' | 'general' | 'ai_assistance';
export type NotificationType = 'task_submitted' | 'task_graded' | 'new_task' | 'message' | 'reward';

export interface Profile {
  id: string;
  wallet_address: string;
  role: UserRole;
  username?: string;
  avatar_url?: string;
  bio?: string;
  reputation_score: number;
  total_tasks_created: number;
  total_tasks_completed: number;
  total_tasks_attempted: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  category: string;
  tags: string[];
  stake_amount: number;
  reward_amount: number;
  student_stake_required: number;
  max_attempts: number;
  time_limit_minutes?: number;
  status: TaskStatus;
  total_attempts: number;
  successful_completions: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  teacher?: Profile;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  student_id: string;
  submission_content: string;
  status: SubmissionStatus;
  stake_amount: number;
  reward_earned: number;
  teacher_feedback?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
  task?: Task;
  student?: Profile;
}

export interface StakingTransaction {
  id: string;
  user_id: string;
  task_id?: string;
  submission_id?: string;
  transaction_type: TransactionType;
  amount: number;
  tx_hash?: string;
  status: TransactionStatus;
  created_at: string;
}

export interface TaskRating {
  id: string;
  task_id: string;
  student_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface TeacherRating {
  id: string;
  teacher_id: string;
  student_id: string;
  rating: number;
  comment?: string;
  task_id?: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  task_id?: string;
  name: string;
  type: ChatRoomType;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id?: string;
  message: string;
  is_ai_message: boolean;
  created_at: string;
  sender?: Profile;
}

export interface RecommendationExplanation {
  id: string;
  user_id: string;
  task_id: string;
  explanation: string;
  relevance_score?: number;
  factors?: Record<string, any>;
  created_at: string;
  task?: Task;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  related_id?: string;
  created_at: string;
}
