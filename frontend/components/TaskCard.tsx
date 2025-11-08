'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types/database";
import { BookOpen, Clock, Coins, TrendingUp, User } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
  onStake?: (taskId: string) => void;
  showTeacher?: boolean;
}

export function TaskCard({ task, onStake, showTeacher = true }: TaskCardProps) {
  const difficultyColors = {
    beginner: 'success' as const,
    intermediate: 'default' as const,
    advanced: 'destructive' as const,
  };

  const successRate = task.total_attempts > 0
    ? Math.round((task.successful_completions / task.total_attempts) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {task.description}
            </CardDescription>
          </div>
          <Badge variant={difficultyColors[task.difficulty]}>
            {task.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            {task.category}
          </Badge>
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-600" />
            <div>
              <div className="text-xs text-zinc-500">Reward</div>
              <div className="font-semibold">{task.reward_amount} EDU</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs text-zinc-500">Stake Required</div>
              <div className="font-semibold">{task.student_stake_required} EDU</div>
            </div>
          </div>

          {task.time_limit_minutes && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-600" />
              <div>
                <div className="text-xs text-zinc-500">Time Limit</div>
                <div className="font-semibold">{task.time_limit_minutes} min</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-zinc-500">Success Rate</div>
              <div className="font-semibold">{successRate}%</div>
            </div>
          </div>
        </div>

        {showTeacher && task.teacher && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <User className="w-4 h-4 text-zinc-600" />
            <div className="text-sm">
              <span className="text-zinc-500">Teacher:</span>{' '}
              <span className="font-medium">{task.teacher.username || 'Anonymous'}</span>
              <span className="text-xs text-zinc-500 ml-2">
                ({task.teacher.reputation_score} reputation)
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/tasks/${task.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {onStake && (
          <Button onClick={() => onStake(task.id)} className="flex-1">
            Stake & Attempt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
