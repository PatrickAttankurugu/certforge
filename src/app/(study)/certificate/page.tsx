'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Award, Download, ExternalLink, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EXAM_NAME, EXAM_CODE, EXAM_PASS_SCORE } from '@/lib/study/constants'

interface CertData {
  fullName: string
  predictedScore: number | null
  passed: boolean
  totalQuestions: number
  bestMockScore: number | null
  verificationId: string
  date: string
}

export default function CertificatePage() {
  const [certData, setCertData] = useState<CertData | null>(null)
  const [loading, setLoading] = useState(true)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profile }, { data: studyProfile }, { data: bestExam }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('user_study_profiles').select('estimated_score, total_questions_answered').eq('user_id', user.id).single(),
        supabase
          .from('mock_exams')
          .select('score')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('score', { ascending: false })
          .limit(1)
          .single(),
      ])

      const predictedScore = studyProfile?.estimated_score ?? bestExam?.score ?? null
      const passed = (predictedScore ?? 0) >= EXAM_PASS_SCORE

      // Create a deterministic verification ID from user ID
      const verificationId = `CF-${user.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

      setCertData({
        fullName: profile?.full_name ?? 'Student',
        predictedScore,
        passed,
        totalQuestions: studyProfile?.total_questions_answered ?? 0,
        bestMockScore: bestExam?.score ?? null,
        verificationId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleDownload = async () => {
    if (!certRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `certforge-certificate-${EXAM_CODE}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Certificate downloaded!')
    } catch {
      toast.error('Failed to download certificate')
    }
  }

  const handleShareLinkedIn = () => {
    if (!certData) return
    const text = `I've been preparing for the ${EXAM_NAME} (${EXAM_CODE}) certification with CertForge!${
      certData.passed ? ` Predicted score: ${certData.predictedScore}/1000 - Ready to pass!` : ''
    }\n\n${certData.totalQuestions} practice questions completed.\n\n#AWS #CloudComputing #Certification\n\nhttps://certforge.dev`

    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://certforge.dev')}&summary=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!certData) return null

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Study Certificate
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          <Button size="sm" onClick={handleShareLinkedIn}>
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Share to LinkedIn
          </Button>
        </div>
      </div>

      {/* Certificate card */}
      <div ref={certRef}>
        <Card className="border-2 border-primary/20 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">CertForge</p>
                <h2 className="text-xl font-bold">Study Completion Certificate</h2>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Name */}
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">This certifies that</p>
                <p className="text-2xl font-bold text-primary">{certData.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  has completed comprehensive preparation for
                </p>
              </div>

              {/* Exam */}
              <div className="text-center">
                <Badge className="text-sm px-4 py-1">{EXAM_NAME}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{EXAM_CODE}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center rounded-lg border bg-background/50 p-3">
                  <p className="text-xl font-bold">{certData.totalQuestions}</p>
                  <p className="text-[10px] text-muted-foreground">Questions Practiced</p>
                </div>
                <div className="text-center rounded-lg border bg-background/50 p-3">
                  <p className="text-xl font-bold">
                    {certData.predictedScore ?? '--'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Predicted Score</p>
                </div>
                <div className="text-center rounded-lg border bg-background/50 p-3">
                  <p className="text-xl font-bold">
                    {certData.bestMockScore ?? '--'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Best Mock Score</p>
                </div>
              </div>

              {certData.passed && (
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-sm px-4 py-1">
                    Predicted to PASS
                  </Badge>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border text-[10px] text-muted-foreground">
                <span>Date: {certData.date}</span>
                <span>ID: {certData.verificationId}</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        This certificate represents study progress on CertForge and is not an official AWS certification.
      </p>
    </div>
  )
}
