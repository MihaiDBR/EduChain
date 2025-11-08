'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getHomework, getEnrollments, updateHomework } from '@/lib/supabase/queries';
import type { HomeworkWithTeacher, EnrollmentWithDetails } from '@/lib/types/database';
import { BookOpen, Users, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const supabase = createSupabaseBrowserClient();

export default function HomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [homework, setHomework] = useState<HomeworkWithTeacher | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    async function loadData() {
      if (!address || !params.id) return;

      try {
        // Verify teacher ownership
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (!profileData || profileData.role !== 'teacher') {
          router.push('/dashboard');
          return;
        }

        // Load homework
        const homeworkData = await getHomework(params.id as string);

        // Verify ownership
        if (homeworkData.teacher_id !== profileData.id) {
          alert('You do not have access to this task');
          router.push('/dashboard/teacher');
          return;
        }

        setHomework(homeworkData);

        // Load enrollments
        const enrollmentsData = await getEnrollments({ homeworkId: params.id as string });
        setEnrollments(enrollmentsData);
      } catch (error: any) {
        console.error('Error loading task:', error);
        alert('Error loading task details');
        router.push('/dashboard/teacher');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address, isConnected, params.id, router]);

  async function toggleActive() {
    if (!homework) return;

    setToggling(true);
    try {
      await updateHomework(homework.id, { is_active: !homework.is_active });
      setHomework({ ...homework, is_active: !homework.is_active });
    } catch (error) {
      console.error('Error toggling task status:', error);
      alert('Error updating task status');
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!homework) {
    return null;
  }

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const reviewedEnrollments = enrollments.filter(e => e.status === 'reviewed');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/teacher">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{homework.title}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {homework.description || 'No description provided'}
              </p>
            </div>
            <Badge variant={homework.is_active ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {homework.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={toggleActive}
            disabled={toggling}
            variant="outline"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            {toggling ? 'Updating...' : homework.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Link href={`/dashboard/teacher/homework/${homework.id}/review`}>
            <Button>
              Review Submissions ({completedEnrollments.length})
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.current_students}</div>
              <p className="text-xs text-zinc-500">of {homework.max_students} max</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEnrollments.length}</div>
              <p className="text-xs text-zinc-500">working on it</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedEnrollments.length}</div>
              <p className="text-xs text-zinc-500">awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewedEnrollments.length}</div>
              <p className="text-xs text-zinc-500">finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Students */}
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
            <CardDescription>All students enrolled in this task</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="text-center py-8 text-zinc-600">
                No students enrolled yet
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div>
                      <p className="font-medium">{enrollment.student?.username || 'Unknown Student'}</p>
                      <p className="text-sm text-zinc-600">
                        Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          enrollment.status === 'reviewed'
                            ? 'default'
                            : enrollment.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {enrollment.status}
                      </Badge>
                      {enrollment.status === 'completed' && (
                        <Link href={`/dashboard/teacher/homework/${homework.id}/review`}>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
