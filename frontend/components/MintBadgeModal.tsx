'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeTemplate, BADGE_CONFIGS, detectSkillFromTitle, formatBadgeDate } from '@/components/BadgeTemplate';
import { createBadge, generateBadgeTokenId } from '@/lib/supabase/queries';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface MintBadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  homeworkId: string;
  homeworkTitle: string;
  teacherId: string;
  teacherName: string;
  onMinted?: () => void;
}

type MintingPhase = 'idle' | 'anchoring' | 'generating' | 'confirming' | 'success';

export function MintBadgeModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  homeworkId,
  homeworkTitle,
  teacherId,
  teacherName,
  onMinted,
}: MintBadgeModalProps) {
  const { addToast } = useToast();
  const [mintingPhase, setMintingPhase] = useState<MintingPhase>('idle');
  const [mintedBadge, setMintedBadge] = useState<any>(null);

  // Detect skill from homework title
  const detectedSkill = detectSkillFromTitle(homeworkTitle);
  const badgeConfig = BADGE_CONFIGS[detectedSkill];

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async function handleMint() {
    try {
      // Phase 1: Anchoring (2 seconds)
      setMintingPhase('anchoring');
      await sleep(2000);

      // Phase 2: Generating (2 seconds)
      setMintingPhase('generating');
      await sleep(2000);

      // Phase 3: Confirming (1 second)
      setMintingPhase('confirming');
      await sleep(1000);

      // Create badge in database
      const tokenId = generateBadgeTokenId();
      const badgeImageUrl = `/badges/${detectedSkill.toLowerCase().replace(/\//g, '-')}.svg`;

      const badge = await createBadge({
        student_id: studentId,
        homework_id: homeworkId,
        teacher_id: teacherId,
        badge_title: badgeConfig.skill,
        badge_description: `Earned for achieving 5-star excellence on "${homeworkTitle}"`,
        badge_image_url: badgeImageUrl,
        skill_verified: detectedSkill,
        token_id: tokenId,
        task_title: homeworkTitle,
        teacher_name: teacherName,
      });

      setMintedBadge(badge);
      setMintingPhase('success');

      // Call onMinted callback
      if (onMinted) {
        onMinted();
      }
    } catch (error) {
      console.error('Error minting badge:', error);
      addToast('❌ Failed to mint badge. Please try again.', 'error');
      setMintingPhase('idle');
    }
  }

  function handleClose() {
    setMintingPhase('idle');
    setMintedBadge(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {mintingPhase === 'idle' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Congratulations!
              </DialogTitle>
              <DialogDescription className="text-base">
                You earned 5 stars on this task!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Task info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                  <strong>Task Completed:</strong>
                </p>
                <p className="text-lg font-semibold">{homeworkTitle}</p>
              </div>

              {/* Badge preview */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 text-center">
                <p className="text-sm text-purple-900 dark:text-purple-100 mb-3">
                  You're now eligible to mint:
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl">{badgeConfig.icon}</span>
                  <div className="text-left">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {badgeConfig.skill}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      Proof-of-Learning NFT
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  A blockchain-verified credential proving your mastery
                </p>
              </div>

              {/* Mint button */}
              <Button
                onClick={handleMint}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                MINT YOUR BADGE
              </Button>

              <p className="text-xs text-center text-zinc-500">
                This badge will be added to your profile and can be shared as proof of your achievement
              </p>
            </div>
          </>
        )}

        {mintingPhase === 'anchoring' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-blue-600" />
            <p className="text-2xl font-bold mb-2">⛓️ Anchoring Proof to Blockchain...</p>
            <p className="text-sm text-zinc-600">
              Recording your achievement on EduChain Testnet
            </p>
          </div>
        )}

        {mintingPhase === 'generating' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-purple-600" />
            <p className="text-2xl font-bold mb-2">🎨 Generating Badge Artwork...</p>
            <p className="text-sm text-zinc-600">
              Creating your unique credential design
            </p>
          </div>
        )}

        {mintingPhase === 'confirming' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-green-600" />
            <p className="text-2xl font-bold mb-2">✅ Confirming Transaction...</p>
            <p className="text-sm text-zinc-600">
              Finalizing your Proof-of-Learning badge
            </p>
          </div>
        )}

        {mintingPhase === 'success' && mintedBadge && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Badge Minted Successfully!
              </DialogTitle>
              <DialogDescription>
                Your Proof-of-Learning credential is now on the blockchain
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Badge display */}
              <div className="flex justify-center">
                <div className="transform hover:scale-105 transition-transform">
                  <BadgeTemplate
                    config={badgeConfig}
                    teacherName={teacherName}
                    date={formatBadgeDate(mintedBadge.minted_at)}
                    tokenId={mintedBadge.token_id}
                  />
                </div>
              </div>

              {/* Badge details */}
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Token ID:</span>
                  <span className="font-mono font-bold">{mintedBadge.token_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Network:</span>
                  <span className="font-semibold">{mintedBadge.blockchain_network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Skill Verified:</span>
                  <Badge variant="default">{mintedBadge.skill_verified}</Badge>
                </div>
              </div>

              <Button onClick={handleClose} size="lg" className="w-full">
                View in My Profile
              </Button>

              <p className="text-xs text-center text-zinc-500">
                🎉 This badge is now visible in your profile and proves your {detectedSkill} expertise!
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
