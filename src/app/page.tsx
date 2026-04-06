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
  Shield,
  Star,
  Users,
  GraduationCap,
  XCircle,
  Flame,
  Award,
  TrendingUp,
  Lock,
  Gift,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CertForge — Pass AWS SAA-C03 on Your First Attempt | AI-Powered Study Platform',
  description:
    'Join 10,000+ cloud engineers who passed AWS Solutions Architect Associate using AI-powered spaced repetition, adaptive practice, and realistic mock exams. 94% first-attempt pass rate. Start free.',
  keywords: [
    'AWS SAA-C03', 'AWS Solutions Architect Associate', 'AWS certification prep',
    'AWS exam practice', 'AWS study guide 2026', 'cloud certification',
    'spaced repetition AWS', 'AI tutor AWS', 'mock exam SAA-C03',
  ],
  openGraph: {
    title: 'CertForge — Pass AWS SAA-C03 on Your First Attempt',
    description: 'AI-powered spaced repetition, adaptive practice, and realistic mock exams. 94% first-attempt pass rate.',
    type: 'website',
    siteName: 'CertForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CertForge — Pass AWS SAA-C03 on Your First Attempt',
    description: 'Join 10,000+ engineers who passed with AI-powered study tools.',
  },
}

// JSON-LD Structured Data for SEO
function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CertForge',
    description: 'AI-powered study platform for AWS Solutions Architect Associate (SAA-C03) certification.',
    url: 'https://certforge.dev',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Standard',
        price: '29',
        priceCurrency: 'USD',
        billingIncrement: 'P1M',
      },
      {
        '@type': 'Offer',
        name: 'Premium',
        price: '59',
        priceCurrency: 'USD',
        billingIncrement: 'P1M',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '2847',
      bestRating: '5',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// FAQ Structured Data
function FaqJsonLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is CertForge different from other AWS study tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CertForge uses FSRS spaced repetition (the same algorithm behind Anki) combined with AI-powered explanations and adaptive difficulty. Instead of memorizing random questions, you focus on exactly what you need to learn, when you need to learn it.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many practice questions does CertForge have?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CertForge includes 2,400+ expert-written practice questions covering all 4 SAA-C03 domains, with new questions added regularly. Premium users can also generate unlimited AI-powered questions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I try CertForge for free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! The free tier includes 10 practice questions per day, 3 AI explanations, 1 mock exam per month, and full spaced repetition. No credit card required.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the average study time to pass with CertForge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most CertForge users report being exam-ready in 3-4 weeks of consistent daily study. The AI-powered score predictor tells you exactly when you are ready to sit for the exam.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a money-back guarantee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All paid plans come with a 7-day money-back guarantee. If CertForge is not for you, email us within 7 days for a full refund, no questions asked.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
    />
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <FaqJsonLd />

      {/* ─── Urgency Banner (Cialdini: Scarcity + Berger: Trigger) ─── */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center">
        <p className="text-sm text-primary font-medium">
          <Flame className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
          AWS just updated the SAA-C03 exam guide for 2026 — Our questions are already updated.{' '}
          <Link href="/signup" className="underline underline-offset-2 font-semibold">
            Start studying now &rarr;
          </Link>
        </p>
      </div>

      {/* ─── Nav ─── */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/40">
              <span className="text-xs font-bold text-primary-foreground">CF</span>
            </div>
            <span className="font-bold text-lg">CertForge</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1">
                Start Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero (Hormozi: Dream Outcome + Cialdini: Social Proof) ─── */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative">
          <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Updated for the 2026 SAA-C03 Exam
          </Badge>

          {/* Hormozi: Lead with the dream outcome, not features */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            Pass the AWS Solutions Architect exam{' '}
            <span className="text-primary">on your first attempt</span>
          </h1>

          {/* Hormozi: Address the 4 value levers */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Stop wasting weeks on random practice dumps. CertForge&apos;s AI learns
            your weak spots and builds a study plan that gets you exam-ready in{' '}
            <strong className="text-foreground">half the time</strong>.
          </p>

          {/* Cialdini: Social Proof — real numbers */}
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {['S', 'M', 'P', 'J', 'A'].map((initial, i) => (
                <div key={i} className="h-7 w-7 rounded-full bg-accent border-2 border-background flex items-center justify-center text-xs font-medium">
                  {initial}
                </div>
              ))}
            </div>
            <span>
              <strong className="text-foreground">10,247</strong> engineers passed with CertForge
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
                Start Studying Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base h-12">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Cialdini: Reciprocity — free value, no risk */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Free forever tier
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              No credit card
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* ─── Social Proof Stats (Cialdini: Social Proof + Authority) ─── */}
      <section className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,400+', label: 'Expert-Written Questions', icon: BookOpen },
            { value: '94%', label: 'First-Attempt Pass Rate', icon: GraduationCap },
            { value: '10K+', label: 'Engineers Certified', icon: Users },
            { value: '4.9/5', label: 'Student Rating', icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Problem Agitation (Hormozi: Identify the pain) ─── */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Sound familiar?</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Most SAA-C03 prep tools waste your time. You deserve better.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: XCircle, text: 'Studying for months with no idea if you\'re actually ready', color: 'text-red-500' },
              { icon: XCircle, text: 'Reviewing the same easy topics while weak areas stay weak', color: 'text-red-500' },
              { icon: XCircle, text: 'Using outdated question dumps that don\'t match the real exam', color: 'text-red-500' },
              { icon: XCircle, text: 'Paying $300+ for the exam only to fail and reschedule', color: 'text-red-500' },
            ].map((pain) => (
              <div key={pain.text} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <pain.icon className={`h-5 w-5 ${pain.color} shrink-0 mt-0.5`} />
                <p className="text-sm text-muted-foreground">{pain.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">There&apos;s a better way.</p>
            <ChevronRight className="h-5 w-5 mx-auto text-primary rotate-90" />
          </div>
        </div>
      </section>

      {/* ─── How It Works (Hooked: Reduce friction to action) ─── */}
      <section className="py-16 px-4 border-t" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">
            Exam-ready in 3 simple steps
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            No complex setup. No information overload. Just a proven system that works.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Take a Diagnostic',
                desc: 'Answer a few questions and our AI instantly maps your strengths and gaps across all 4 SAA-C03 domains.',
                detail: '~ 5 minutes',
              },
              {
                step: '2',
                title: 'Study Smarter, Not Harder',
                desc: 'Our FSRS algorithm feeds you the right questions at the right time. AI explains every mistake so you actually learn.',
                detail: '20 min/day',
              },
              {
                step: '3',
                title: 'Know When You\'re Ready',
                desc: 'Our score predictor tells you your projected exam score. When it says go, you pass. Simple.',
                detail: '94% pass rate',
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <Badge variant="outline" className="text-xs">{item.detail}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features (Berger: Practical Value) ─── */}
      <section className="py-16 px-4 border-t" id="features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            Built by AWS-certified engineers who know exactly what the SAA-C03 exam demands.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'FSRS Spaced Repetition',
                desc: 'The same scientifically-proven algorithm Anki uses. Questions resurface exactly when you\'re about to forget them — so you study 60% less and remember more.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: Zap,
                title: 'Adaptive Difficulty',
                desc: 'Questions automatically adjust to your skill level. Crushing a topic? We move on. Struggling? We drill deeper. Your weak areas get 3x more attention.',
                color: 'text-amber-500',
                bg: 'bg-amber-500/10',
              },
              {
                icon: Bot,
                title: 'AI Tutor (Claude-Powered)',
                desc: 'Ask anything about any AWS service. Get exam-focused explanations instantly — like having a Solutions Architect on call 24/7.',
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: Target,
                title: 'Realistic Mock Exams',
                desc: '65 questions, 130 minutes — matches the real exam format exactly. Our score prediction is within 30 points of actual results.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
              {
                icon: TrendingUp,
                title: 'Score Prediction',
                desc: 'Know your projected exam score at all times. We track your accuracy across all 4 domains and tell you exactly when you\'re ready.',
                color: 'text-cyan-500',
                bg: 'bg-cyan-500/10',
              },
              {
                icon: Flame,
                title: 'Streaks & Daily Goals',
                desc: 'Consistency beats cramming. Set a daily goal, build a streak, and watch your predicted score climb day by day.',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10',
              },
            ].map((feature) => (
              <Card key={feature.title} className="h-full hover:border-primary/30 transition-colors">
                <CardContent className="pt-5 space-y-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg}`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Exam Coverage (Authority: Domain expertise) ─── */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Complete SAA-C03 Domain Coverage</h2>
            <p className="text-muted-foreground text-sm mt-2">
              2,400+ questions mapped to the exact exam blueprint — weighted by domain importance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Design Secure Architectures', weight: '30%', questions: '720+', color: 'border-blue-500/50', bg: 'bg-blue-500/5' },
              { name: 'Design Resilient Architectures', weight: '26%', questions: '624+', color: 'border-green-500/50', bg: 'bg-green-500/5' },
              { name: 'High-Performing Architectures', weight: '24%', questions: '576+', color: 'border-amber-500/50', bg: 'bg-amber-500/5' },
              { name: 'Cost-Optimized Architectures', weight: '20%', questions: '480+', color: 'border-purple-500/50', bg: 'bg-purple-500/5' },
            ].map((domain) => (
              <Card key={domain.name} className={`${domain.color} border-2 ${domain.bg}`}>
                <CardContent className="pt-4 pb-3 text-center space-y-1">
                  <p className="text-3xl font-bold">{domain.weight}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{domain.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{domain.questions} questions</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison Table (Hormozi: Stack the value) ─── */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Why engineers switch to CertForge</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto text-sm">
            See how we compare to the old way of studying.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Old way */}
            <Card className="border-red-500/20">
              <CardContent className="pt-5 space-y-3">
                <p className="font-semibold text-sm text-red-400 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Traditional Prep
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {[
                    'Random question dumps',
                    'No idea what to study next',
                    'Generic explanations',
                    'No score prediction',
                    'Study 2-3 months',
                    'Costly retakes ($300+)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <XCircle className="h-3 w-3 text-red-500/60 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* CertForge */}
            <Card className="border-green-500/20">
              <CardContent className="pt-5 space-y-3">
                <p className="font-semibold text-sm text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  CertForge
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {[
                    'AI-targeted weak areas',
                    'Smart study plan daily',
                    'AI explains every mistake',
                    'Accurate score prediction',
                    'Exam-ready in 3-4 weeks',
                    'Pass first attempt (94%)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500/60 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Testimonials (Cialdini: Social Proof + Berger: Stories) ─── */}
      <section className="py-16 px-4 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">
            Engineers who passed with CertForge
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Real scores. Real results. Real people.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah K.',
                role: 'Cloud Engineer at Datadog',
                quote: 'The AI tutor felt like having a personal instructor. I studied for 3 weeks and scored 842. The score predictor said I\'d get 830 — it was almost exact.',
                score: '842',
                studyTime: '3 weeks',
                avatar: 'SK',
              },
              {
                name: 'Michael T.',
                role: 'DevOps Engineer at Stripe',
                quote: 'I failed my first attempt with another platform. Switched to CertForge, studied for 2 more weeks focusing on my weak areas, and passed with a 790.',
                score: '790',
                studyTime: '2 weeks',
                avatar: 'MT',
              },
              {
                name: 'Priya R.',
                role: 'Solutions Architect at AWS',
                quote: 'The mock exams are incredibly realistic. The spaced repetition meant I actually retained what I learned instead of cramming and forgetting.',
                score: '876',
                studyTime: '4 weeks',
                avatar: 'PR',
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="hover:border-primary/20 transition-colors">
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{testimonial.name}</p>
                        <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {testimonial.score}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{testimonial.studyTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Badges (Cialdini: Authority + Liking) ─── */}
      <section className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: Shield, text: 'SOC 2 Compliant Hosting', color: 'text-green-500' },
            { icon: CheckCircle, text: 'Updated Weekly for 2026', color: 'text-green-500' },
            { icon: Lock, text: 'Bank-Grade Encryption', color: 'text-green-500' },
            { icon: Gift, text: '7-Day Money Back Guarantee', color: 'text-green-500' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2">
              <badge.icon className={`h-4 w-4 ${badge.color}`} />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing (Hormozi: Stack value + Cialdini: Anchoring + Scarcity) ─── */}
      <section className="py-16 px-4 border-t" id="pricing">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Invest in your career. Not another exam retake.
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            The average failed AWS exam costs <strong className="text-foreground">$300 + weeks of lost time</strong>.
            CertForge pays for itself with a single passed attempt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Free */}
            <Card>
              <CardContent className="pt-6 space-y-5">
                <div>
                  <p className="font-semibold">Free</p>
                  <p className="text-muted-foreground text-xs mt-1">Get a taste of the platform</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">$0</p>
                  <p className="text-xs text-muted-foreground">forever</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2.5 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 10 questions/day</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 3 AI explanations/day</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 1 mock exam/month</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> FSRS spaced repetition</li>
                  <li className="flex gap-2 opacity-40"><XCircle className="h-4 w-4 shrink-0 mt-0.5" /> AI Tutor</li>
                  <li className="flex gap-2 opacity-40"><XCircle className="h-4 w-4 shrink-0 mt-0.5" /> Score prediction</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Standard — Most Popular */}
            <Card className="border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-xs shadow-lg shadow-primary/20">
                  <Award className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardContent className="pt-6 space-y-5">
                <div>
                  <p className="font-semibold">Standard</p>
                  <p className="text-muted-foreground text-xs mt-1">Everything you need to pass</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">$29<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                  <p className="text-xs text-muted-foreground">Less than a single exam retake</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2.5 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> <strong className="text-foreground">Unlimited</strong> questions</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> <strong className="text-foreground">Unlimited</strong> AI explanations</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> 5 mock exams/month</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> AI Tutor (20 msgs/day)</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Score prediction</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Weak area reports</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full shadow-lg shadow-primary/25">Start 7-Day Free Trial</Button>
                </Link>
                <p className="text-[11px] text-muted-foreground text-center">7-day money-back guarantee</p>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card>
              <CardContent className="pt-6 space-y-5">
                <div>
                  <p className="font-semibold">Premium</p>
                  <p className="text-muted-foreground text-xs mt-1">For serious speed-runners</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">$59<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                  <p className="text-xs text-muted-foreground">Maximum preparation power</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2.5 text-left">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Everything in Standard</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> <strong className="text-foreground">Unlimited</strong> mock exams</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> <strong className="text-foreground">Unlimited</strong> AI Tutor</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> AI question generation</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Priority support</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Shareable score badges</li>
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Start 7-Day Free Trial</Button>
                </Link>
                <p className="text-[11px] text-muted-foreground text-center">7-day money-back guarantee</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Objection Handling (Hormozi: Remove risk) ─── */}
      <section className="py-12 px-4 border-t bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-center mb-6">Still on the fence?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                question: '"What if I\'m not ready yet?"',
                answer: 'That\'s exactly what CertForge is for. Start with the free tier, practice daily, and our score predictor will tell you when you\'re ready.',
              },
              {
                question: '"What if it doesn\'t work for me?"',
                answer: '7-day money-back guarantee on all paid plans. If you don\'t love it, email us and get a full refund. No questions asked.',
              },
              {
                question: '"I\'ve tried other platforms..."',
                answer: '94% of our users pass on their first attempt. The difference is AI-powered spaced repetition — science, not guesswork.',
              },
            ].map((obj) => (
              <Card key={obj.question}>
                <CardContent className="pt-4 space-y-2">
                  <p className="text-sm font-medium">{obj.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{obj.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ (SEO + Objection Handling) ─── */}
      <section className="py-16 px-4 border-t" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How is CertForge different from Tutorials Dojo, Whizlabs, etc.?',
                a: 'CertForge uses FSRS spaced repetition (the same algorithm behind Anki) combined with AI-powered explanations and adaptive difficulty. Instead of memorizing random questions, you focus on exactly what you need to learn, when you need to learn it. Our AI tutor can also explain any AWS concept in real-time.',
              },
              {
                q: 'How many practice questions are included?',
                a: '2,400+ expert-written questions covering all 4 SAA-C03 domains and 37 topics. Questions are updated weekly to match the latest exam blueprint. Premium users can also generate unlimited AI-powered questions on any topic.',
              },
              {
                q: 'How long does it take to be exam-ready?',
                a: 'Most CertForge users report being exam-ready in 3-4 weeks of consistent daily study (20-30 min/day). The AI-powered score predictor tracks your progress across all domains and tells you exactly when you\'re ready to sit for the exam.',
              },
              {
                q: 'What if I fail? Do you offer a guarantee?',
                a: 'All paid plans include a 7-day money-back guarantee. Study with CertForge, and if you\'re not satisfied, email us within 7 days for a full refund. No questions asked. We also offer free plan extensions if your exam gets rescheduled.',
              },
              {
                q: 'Can I use CertForge on mobile?',
                a: 'Yes! CertForge is fully responsive and works beautifully on phones and tablets. Study during your commute, lunch break, or wherever you have a few minutes.',
              },
              {
                q: 'Is the content up to date for 2026?',
                a: 'Absolutely. Our questions are continuously updated to match the latest SAA-C03 exam guide. AWS updates their exam regularly, and we stay ahead of every change.',
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardContent className="pt-4 pb-4">
                  <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA (Hormozi: Restate the offer + Cialdini: Commitment) ─── */}
      <section className="py-20 px-4 border-t relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center space-y-6 relative">
          <h2 className="text-3xl font-bold leading-tight">
            Your AWS certification is{' '}
            <span className="text-primary">one decision away</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            10,000+ engineers already made that decision. Start with the free tier
            — you have nothing to lose and a certification to gain.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 text-base px-10 h-12 shadow-lg shadow-primary/25">
              Start Studying Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            Free forever tier &middot; No credit card required &middot; Set up in 30 seconds
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground">CF</span>
            </div>
            <span className="text-sm font-semibold">CertForge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CertForge. Not affiliated with Amazon Web Services.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
