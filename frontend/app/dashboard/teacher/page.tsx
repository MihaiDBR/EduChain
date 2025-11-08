'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { getTasks, getProfile } from '@/lib/supabase/queries';
import type { Task, Profile } from '@/lib/types/database';
import { Plus, BookOpen, Users, TrendingUp, Coins } from 'lucide-react';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/client';

const supabase = createSupabaseClient();

export default function TeacherDashboard() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!address) return;

      try {
        // Load profile
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (profiles) {
          setProfile(profiles);

          // Load teacher's tasks
          const tasksData = await getTasks({ teacherId: profiles.id });
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const activeTasksCount = tasks.filter(t => t.status === 'active').length;
  const totalStaked = tasks.reduce((sum, t) => sum + Number(t.stake_amount), 0);
  const avgSuccessRate = tasks.length > 0
    ? tasks.reduce((sum, t) => {
        const rate = t.total_attempts > 0 ? (t.successful_completions / t.total_attempts) * 100 : 0;
        return sum + rate;
      }, 0) / tasks.length
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your educational tasks and track student progress
          </p>
        </div>
        <Link href="/dashboard/teacher/create-task">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <BookOpen className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasksCount}</div>
            <p className="text-xs text-zinc-500">
              {tasks.length - activeTasksCount} completed/cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.reduce((sum, t) => sum + t.total_attempts, 0)}
            </div>
            <p className="text-xs text-zinc-500">Task attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-zinc-500">Across all tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Coins className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaked} EDU</div>
            <p className="text-xs text-zinc-500">Your reputation: {profile?.reputation_score || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-zinc-400 mb-4" />
              <p className="text-zinc-600 mb-4">You haven't created any tasks yet</p>
              <Link href="/dashboard/teacher/create-task">
                <Button>Create Your First Task</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} showTeacher={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
