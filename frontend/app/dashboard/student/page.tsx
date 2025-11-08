'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from '@/components/TaskCard';
import { getTasks, getRecommendedTasks, createRecommendationExplanation } from '@/lib/supabase/queries';
import type { Task, Profile } from '@/lib/types/database';
import { BookOpen, Trophy, TrendingUp, Coins, Lightbulb, Filter } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase/client';

const supabase = createSupabaseClient();

export default function StudentDashboard() {
  const { address } = useAccount();
  const [recommendedTasks, setRecommendedTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

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

          // Load recommended tasks
          const recommended = await getRecommendedTasks(profiles.id);
          setRecommendedTasks(recommended);

          // Generate explanations for recommended tasks
          for (const task of recommended.slice(0, 3)) {
            await generateRecommendationExplanation(profiles.id, task);
          }

          // Load all tasks
          const tasksData = await getTasks({ status: 'active' });
          setAllTasks(tasksData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address]);

  async function generateRecommendationExplanation(userId: string, task: Task) {
    // Simple recommendation logic - in production, use a more sophisticated algorithm
    const factors: Record<string, any> = {};
    let explanation = `This task was recommended because: `;
    const reasons: string[] = [];

    // Factor 1: Difficulty matches user level
    if (profile) {
      const userLevel = profile.total_tasks_completed < 5 ? 'beginner'
        : profile.total_tasks_completed < 20 ? 'intermediate'
        : 'advanced';

      if (task.difficulty === userLevel) {
        reasons.push(`it matches your current skill level (${userLevel})`);
        factors.difficulty_match = true;
      }
    }

    // Factor 2: High success rate
    const successRate = task.total_attempts > 0
      ? (task.successful_completions / task.total_attempts) * 100
      : 0;

    if (successRate > 60) {
      reasons.push(`it has a good success rate (${successRate.toFixed(0)}%)`);
      factors.high_success_rate = successRate;
    }

    // Factor 3: Good reward to stake ratio
    const rewardRatio = task.reward_amount / task.student_stake_required;
    if (rewardRatio > 1.5) {
      reasons.push(`it offers a favorable reward ratio (${rewardRatio.toFixed(1)}x)`);
      factors.good_reward_ratio = rewardRatio;
    }

    // Factor 4: Reputable teacher
    if (task.teacher && task.teacher.reputation_score > 50) {
      reasons.push(`the teacher has a strong reputation (${task.teacher.reputation_score})`);
      factors.reputable_teacher = task.teacher.reputation_score;
    }

    explanation += reasons.join(', ') + '.';

    try {
      await createRecommendationExplanation({
        user_id: userId,
        task_id: task.id,
        explanation,
        relevance_score: reasons.length * 25, // Simple scoring
        factors,
      });
    } catch (error) {
      console.error('Error creating recommendation explanation:', error);
    }
  }

  const handleStake = async (taskId: string) => {
    // This would integrate with the smart contract
    console.log('Staking for task:', taskId);
    // Navigate to task detail page
    window.location.href = `/tasks/${taskId}`;
  };

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    if (selectedCategory && task.category !== selectedCategory) return false;
    if (selectedDifficulty && task.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const categories = Array.from(new Set(allTasks.map(t => t.category)));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Discover tasks, learn, and earn rewards through your achievements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.total_tasks_completed || 0}</div>
            <p className="text-xs text-zinc-500">
              {profile?.total_tasks_attempted || 0} attempted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.total_tasks_attempted
                ? Math.round((profile.total_tasks_completed / profile.total_tasks_attempted) * 100)
                : 0}%
            </div>
            <p className="text-xs text-zinc-500">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.reputation_score || 0}</div>
            <p className="text-xs text-zinc-500">Based on participation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tasks</CardTitle>
            <Coins className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
            <p className="text-xs text-zinc-500">{recommendedTasks.length} recommended</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Tasks */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Badge variant="secondary">AI-Powered</Badge>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          These tasks are personalized based on your skills and interests. Click on any task to see why it was recommended.
        </p>
        {recommendedTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-zinc-600">
              No recommendations available yet. Complete some tasks to get personalized suggestions!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} onStake={handleStake} />
            ))}
          </div>
        )}
      </div>

      {/* All Tasks with Filters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Browse All Tasks</h2>
          <div className="flex gap-2">
            <Filter className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}

          <div className="w-px bg-zinc-200 mx-2" />

          <Button
            variant={selectedDifficulty === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(null)}
          >
            All Levels
          </Button>
          {['beginner', 'intermediate', 'advanced'].map(level => (
            <Button
              key={level}
              variant={selectedDifficulty === level ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStake={handleStake} />
          ))}
        </div>
      </div>
    </div>
  );
}
