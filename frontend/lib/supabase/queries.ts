import { createSupabaseClient } from './client';
import type { Task, Profile, TaskSubmission, RecommendationExplanation } from '@/lib/types/database';

const supabase = createSupabaseClient();

// Profile Queries
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getProfileByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Profile | null;
}

export async function createProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// Task Queries
export async function getTasks(filters?: {
  category?: string;
  difficulty?: string;
  teacherId?: string;
  status?: string;
}) {
  let query = supabase
    .from('tasks')
    .select(`
      *,
      teacher:profiles!tasks_teacher_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters?.teacherId) {
    query = query.eq('teacher_id', filters.teacherId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Task[];
}

export async function getTask(taskId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      teacher:profiles!tasks_teacher_id_fkey(*)
    `)
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function createTask(task: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

// Task Submission Queries
export async function getTaskSubmissions(taskId: string) {
  const { data, error } = await supabase
    .from('task_submissions')
    .select(`
      *,
      student:profiles!task_submissions_student_id_fkey(*)
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TaskSubmission[];
}

export async function getStudentSubmissions(studentId: string) {
  const { data, error } = await supabase
    .from('task_submissions')
    .select(`
      *,
      task:tasks(*)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TaskSubmission[];
}

export async function createSubmission(submission: Partial<TaskSubmission>) {
  const { data, error } = await supabase
    .from('task_submissions')
    .insert([submission])
    .select()
    .single();

  if (error) throw error;
  return data as TaskSubmission;
}

export async function updateSubmission(submissionId: string, updates: Partial<TaskSubmission>) {
  const { data, error } = await supabase
    .from('task_submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data as TaskSubmission;
}

// Recommendation Queries
export async function getRecommendedTasks(userId: string) {
  // This is a simplified version - you would implement a more sophisticated
  // recommendation algorithm based on user preferences, past performance, etc.
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      teacher:profiles!tasks_teacher_id_fkey(*)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return tasks as Task[];
}

export async function createRecommendationExplanation(explanation: Partial<RecommendationExplanation>) {
  const { data, error } = await supabase
    .from('recommendation_explanations')
    .insert([explanation])
    .select()
    .single();

  if (error) throw error;
  return data as RecommendationExplanation;
}

export async function getRecommendationExplanations(userId: string, taskId: string) {
  const { data, error } = await supabase
    .from('recommendation_explanations')
    .select(`
      *,
      task:tasks(*)
    `)
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data[0] as RecommendationExplanation | null;
}

// Notification Queries
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Chat Queries
export async function getChatRooms(userId: string) {
  const { data, error } = await supabase
    .from('chat_room_participants')
    .select(`
      room:chat_rooms(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(d => d.room);
}

export async function getChatMessages(roomId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      sender:profiles!chat_messages_sender_id_fkey(*)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendChatMessage(message: { room_id: string; sender_id: string; message: string; is_ai_message?: boolean }) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data;
}
