'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Settings, LogOut, Calendar, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProfileData {
  full_name: string | null
  email: string
  plan: string
}

interface StudyProfileData {
  target_exam_date: string | null
  daily_goal_questions: number
  daily_goal_minutes: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [studyProfile, setStudyProfile] = useState<StudyProfileData | null>(null)
  const [examDate, setExamDate] = useState('')
  const [dailyGoal, setDailyGoal] = useState(20)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: p }, { data: sp }] = await Promise.all([
        supabase.from('profiles').select('full_name, email, plan').eq('id', user.id).single(),
        supabase.from('user_study_profiles').select('target_exam_date, daily_goal_questions, daily_goal_minutes').eq('user_id', user.id).single(),
      ])

      if (p) setProfile(p)
      if (sp) {
        setStudyProfile(sp)
        setExamDate(sp.target_exam_date ?? '')
        setDailyGoal(sp.daily_goal_questions)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_study_profiles')
      .update({
        target_exam_date: examDate || null,
        daily_goal_questions: dailyGoal,
      })
      .eq('user_id', user.id)

    setSaving(false)
    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings saved')
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40" />
      <Skeleton className="h-48" />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Settings
      </h1>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{profile?.full_name ?? 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <Badge className="capitalize">{profile?.plan ?? 'free'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Study Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Study Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="h-3.5 w-3.5" />
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <Target className="h-3.5 w-3.5" />
              Daily Question Goal
            </label>
            <input
              type="number"
              min={5}
              max={100}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Sign out */}
      <Card>
        <CardContent className="pt-4">
          <ConfirmDialog
            trigger={
              <Button variant="destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            }
            title="Sign out?"
            description="You'll need to sign in again to continue studying."
            confirmLabel="Sign Out"
            onConfirm={handleSignOut}
          />
        </CardContent>
      </Card>
    </div>
  )
}
