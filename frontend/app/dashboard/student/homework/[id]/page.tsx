'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  getHomework,
  getEnrollments,
} from '@/lib/supabase/queries';
import type { Homework, EnrollmentWithDetails } from '@/lib/types/database';
import { Upload, FileText, CheckCircle, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const supabase = createSupabaseBrowserClient();

export default function StudentHomeworkPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const params = useParams();
  const homeworkId = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [homework, setHomework] = useState<Homework | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    async function loadData() {
      if (!address) return;

      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();

        if (!profileData || profileData.role !== 'student') {
          router.push('/dashboard');
          return;
        }

        setProfile(profileData);

        // Load homework
        const homeworkData = await getHomework(homeworkId);
        setHomework(homeworkData);

        // Load enrollment
        const enrollmentsData = await getEnrollments({
          homeworkId,
          studentId: profileData.id,
        });

        if (enrollmentsData.length === 0) {
          alert('You are not enrolled in this task');
          router.push('/dashboard/student');
          return;
        }

        setEnrollment(enrollmentsData[0]);

        // Load existing submission if exists
        const { data: submissionData } = await supabase
          .from('enrollments')
          .select('submission_text')
          .eq('id', enrollmentsData[0].id)
          .single();

        if (submissionData?.submission_text) {
          setSubmissionText(submissionData.submission_text);
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        alert('Error loading task details');
        router.push('/dashboard/student');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address, isConnected, router, homeworkId]);

  async function handleSubmitSolution() {
    if (!enrollment || !submissionText.trim()) return;

    setSubmitting(true);
    try {
      // Update enrollment with submission
      const { error } = await supabase
        .from('enrollments')
        .update({
          submission_text: submissionText,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', enrollment.id);

      if (error) throw error;

      // Reload enrollment
      const enrollmentsData = await getEnrollments({
        homeworkId,
        studentId: profile.id,
      });

      setEnrollment(enrollmentsData[0]);
      alert('Solution submitted successfully! ✅ Your teacher will review it soon.');
    } catch (error: any) {
      console.error('Error submitting solution:', error);
      alert('Error submitting solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile || !homework || !enrollment) {
    return null;
  }

  const canSubmit = enrollment.status === 'active';
  const isCompleted = enrollment.status === 'completed';
  const isReviewed = enrollment.status === 'reviewed';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/student">
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
              <p className="text-sm text-zinc-500 mt-2">
                Teacher: {homework.teacher?.username || 'Unknown'}
              </p>
            </div>
            <Badge
              variant={
                isReviewed ? 'default' : isCompleted ? 'secondary' : 'outline'
              }
              className="text-lg px-4 py-2"
            >
              {isReviewed ? 'Reviewed' : isCompleted ? 'Submitted' : 'Active'}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Link href={`/dashboard/student/homework/${homeworkId}/questions`} className="flex-1">
            <Button variant="outline" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Questions
            </Button>
          </Link>
        </div>

        {/* Review Score (if reviewed) */}
        {isReviewed && enrollment.review_score !== null && (
          <Card className="mb-8 border-green-500 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-100">
                Your Score: {enrollment.review_score} / 5 ⭐
              </CardTitle>
              {enrollment.review_comment && (
                <CardDescription className="text-green-800 dark:text-green-200">
                  Teacher's feedback: {enrollment.review_comment}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        )}

        {/* Submit Solution */}
        <Card className={canSubmit ? 'border-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {canSubmit ? 'Submit Your Solution' : 'Your Submission'}
            </CardTitle>
            <CardDescription>
              {canSubmit
                ? 'Write your solution below and submit when ready'
                : isCompleted
                ? 'Your solution has been submitted and is awaiting review'
                : 'Your solution has been reviewed by your teacher'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Write your solution here..."
                rows={12}
                className="w-full font-mono"
                disabled={!canSubmit}
              />
              {canSubmit && (
                <Button
                  onClick={handleSubmitSolution}
                  disabled={!submissionText.trim() || submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Solution
                    </>
                  )}
                </Button>
              )}
              {isCompleted && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-semibold">Submitted on {new Date(enrollment.completed_at || '').toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
