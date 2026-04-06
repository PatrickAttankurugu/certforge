import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Brain,
  BarChart3,
  Clock,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Bot,
} from 'lucide-react'

export const metadata = {
  title: 'CertForge — AI-Powered AWS Certification Study',
  description: 'Master the AWS Solutions Architect Associate (SAA-C03) exam with AI-powered spaced repetition, adaptive practice, and mock exams.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">CertForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="text-xs px-3 py-1">
            AWS SAA-C03 &middot; Updated for 2026
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Pass the AWS Solutions Architect exam with{' '}
            <span className="text-primary">AI-powered</span> studying
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Adaptive spaced repetition, AI explanations, realistic mock exams, and a personal AI tutor — all built to get you certified faster.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Studying Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Free tier: 10 questions/day &middot; No credit card required
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Everything you need to pass</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'FSRS Spaced Repetition',
                desc: 'The same algorithm Anki uses. Questions resurface right when you\'re about to forget them.',
                color: 'text-blue-500',
              },
              {
                icon: Zap,
                title: 'Adaptive Difficulty',
                desc: 'Questions automatically adjust to your skill level. Weak areas get more attention.',
                color: 'text-amber-500',
              },
              {
                icon: Bot,
                title: 'AI Tutor',
                desc: 'Ask questions about any AWS topic. Get instant, exam-focused explanations.',
                color: 'text-green-500',
              },
              {
                icon: Target,
                title: 'Mock Exams',
                desc: '65 questions, 130 minutes — matches the real exam format exactly.',
                color: 'text-purple-500',
              },
              {
                icon: BarChart3,
                title: 'Score Prediction',
                desc: 'Know where you stand before exam day. Track progress across all 4 domains.',
                color: 'text-cyan-500',
              },
              {
                icon: Clock,
                title: 'Daily Streaks',
                desc: 'Build consistency with daily goals and streak tracking.',
                color: 'text-orange-500',
              },
            ].map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardContent className="pt-5 space-y-2">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exam coverage */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold">Full SAA-C03 Coverage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Secure Architectures', weight: '30%', color: 'border-blue-500/50' },
              { name: 'Resilient Architectures', weight: '26%', color: 'border-green-500/50' },
              { name: 'High-Performing', weight: '24%', color: 'border-amber-500/50' },
              { name: 'Cost-Optimized', weight: '20%', color: 'border-purple-500/50' },
            ].map((domain) => (
              <Card key={domain.name} className={`${domain.color} border-2`}>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className="text-2xl font-bold">{domain.weight}</p>
                  <p className="text-xs text-muted-foreground mt-1">{domain.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 border-t" id="pricing">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="font-semibold">Free</p>
                <p className="text-3xl font-bold">$0</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 10 questions/day</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 3 AI explanations/day</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 1 mock exam/month</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Spaced repetition</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Standard</p>
                  <Badge className="text-xs">Popular</Badge>
                </div>
                <p className="text-3xl font-bold">$29<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Unlimited questions</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Unlimited AI explanations</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 5 mock exams/month</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> AI Tutor (20 msgs/day)</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Score prediction</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full">Subscribe</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="font-semibold">Premium</p>
                <p className="text-3xl font-bold">$59<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Everything in Standard</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Unlimited mock exams</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Unlimited AI Tutor</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> AI question generation</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Weak area reports</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Subscribe</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CertForge. Not affiliated with Amazon Web Services.</p>
      </footer>
    </div>
  )
}
