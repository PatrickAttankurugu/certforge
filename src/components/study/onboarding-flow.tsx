'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Flame,
  Brain,
  GraduationCap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LottieAnimation } from '@/components/ui/lottie-animation'
import { LOTTIE_URLS } from '@/lib/animations'
import { toast } from 'sonner'

interface OnboardingFlowProps {
  userId: string
  userName: string | null
}

const STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'exam-date', label: 'Exam Date' },
  { id: 'daily-goal', label: 'Daily Goal' },
  { id: 'ready', label: 'Let\'s Go' },
]

export function OnboardingFlow({ userId, userName }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [examDate, setExamDate] = useState('')
  const [dailyGoal, setDailyGoal] = useState(20)
  const [saving, setSaving] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const progress = ((step + 1) / STEPS.length) * 100

  const handleComplete = async () => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('user_study_profiles')
      .update({
        target_exam_date: examDate || null,
        daily_goal_questions: dailyGoal,
      })
      .eq('user_id', userId)

    setSaving(false)
    if (error) {
      toast.error('Failed to save preferences')
      return
    }

    toast.success('You\'re all set! Let\'s start studying.')
    setDismissed(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg border-primary/30 shadow-2xl shadow-primary/10">
        <CardContent className="pt-6 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{STEPS[step].label}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}!
                </h2>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  You just made a great decision. Let&apos;s set up your study plan
                  in 30 seconds so CertForge can help you pass the{' '}
                  <strong className="text-foreground">AWS SAA-C03</strong> exam on your first attempt.
                </p>
              </div>

              {/* Berger: Social Currency — join a winning group */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg py-2">
                <div className="flex -space-x-1.5">
                  {['S', 'M', 'P'].map((initial, i) => (
                    <div key={i} className="h-5 w-5 rounded-full bg-accent border border-background flex items-center justify-center text-[10px] font-medium">
                      {initial}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ engineers who passed with CertForge</span>
              </div>

              <Button onClick={() => setStep(1)} className="gap-2">
                Let&apos;s Do This
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Exam Date — Cialdini: Commitment */}
          {step === 1 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">When is your exam?</h3>
                  <p className="text-xs text-muted-foreground">
                    Setting a date makes you <strong>2x more likely</strong> to follow through.
                  </p>
                </div>
              </div>

              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-lg border bg-background px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Brain className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Don&apos;t have a date yet? No worries — you can always set it later in Settings.
                </span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Skip for now
                </Button>
                <Button onClick={() => setStep(2)} className="flex-1 gap-1" disabled={!examDate}>
                  Set Date
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Daily Goal — Hooked: Investment */}
          {step === 2 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
                  <Target className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Set your daily question goal</h3>
                  <p className="text-xs text-muted-foreground">
                    Consistency beats cramming. Even 10 questions/day builds mastery.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dailyGoal} questions/day</span>
                  <Badge variant="outline" className="text-xs">
                    {dailyGoal <= 10 ? 'Casual' : dailyGoal <= 25 ? 'Steady' : dailyGoal <= 50 ? 'Focused' : 'Intense'}
                  </Badge>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>5</span>
                  <span>25</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Hooked: Variable Reward — show what they unlock */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: Flame, label: 'Daily Streak', desc: 'Build momentum' },
                  { icon: Zap, label: 'Adaptive AI', desc: 'Smart targeting' },
                  { icon: CheckCircle, label: 'Pass Prediction', desc: 'Know when ready' },
                ].map((feature) => (
                  <div key={feature.label} className="bg-muted/50 rounded-lg p-2">
                    <feature.icon className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="text-[10px] font-medium">{feature.label}</p>
                    <p className="text-[9px] text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 gap-1">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Ready — Hooked: Action + Hormozi: Urgency */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="relative h-20 w-20 mx-auto">
                <LottieAnimation
                  url={LOTTIE_URLS.success}
                  loop={false}
                  className="h-20 w-20"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">You&apos;re all set!</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Your personalized study plan is ready. Let&apos;s start with your first practice session.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Plan</p>
                {examDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Exam: {new Date(examDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-amber-500" />
                  <span>{dailyGoal} questions/day</span>
                </div>
              </div>

              <Button onClick={handleComplete} disabled={saving} className="gap-2 w-full">
                {saving ? 'Saving...' : 'Start Practicing'}
                <Zap className="h-4 w-4" />
              </Button>

              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                I&apos;ll explore on my own
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
