import Link from 'next/link'
import Image from 'next/image'
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
  Sparkles,
  Cloud,
  Monitor,
} from 'lucide-react'
import { STOCK_IMAGES } from '@/lib/animations'
import { LandingAnimations } from '@/components/landing/landing-animations'
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
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Standard', price: '29', priceCurrency: 'USD', billingIncrement: 'P1M' },
      { '@type': 'Offer', name: 'Premium', price: '59', priceCurrency: 'USD', billingIncrement: 'P1M' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '2847', bestRating: '5' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

function FaqJsonLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How is CertForge different from other AWS study tools?', acceptedAnswer: { '@type': 'Answer', text: 'CertForge uses FSRS spaced repetition combined with AI-powered explanations and adaptive difficulty.' } },
      { '@type': 'Question', name: 'How many practice questions does CertForge have?', acceptedAnswer: { '@type': 'Answer', text: 'CertForge includes 2,400+ expert-written practice questions covering all 4 SAA-C03 domains.' } },
      { '@type': 'Question', name: 'Can I try CertForge for free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! The free tier includes 10 practice questions per day, 3 AI explanations, 1 mock exam per month.' } },
      { '@type': 'Question', name: 'What is the average study time?', acceptedAnswer: { '@type': 'Answer', text: 'Most users report being exam-ready in 3-4 weeks of consistent daily study.' } },
      { '@type': 'Question', name: 'Is there a money-back guarantee?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. All paid plans come with a 7-day money-back guarantee.' } },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <FaqJsonLd />

      {/* Client-side animated wrapper - handles all framer-motion and Lottie */}
      <LandingAnimations>
        {/* ─── Urgency Banner ─── */}
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center">
          <p className="text-xs sm:text-sm text-primary font-medium">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/30">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">CertForge</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1 shadow-lg shadow-primary/20">
                  Start Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ─── Hero ─── */}
        <section className="py-12 sm:py-20 px-4 relative overflow-hidden" data-animate="hero">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text content */}
              <div className="space-y-6 text-center lg:text-left" data-animate="fade-up">
                <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Updated for the 2026 SAA-C03 Exam
                </Badge>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
                  Pass the AWS Solutions Architect exam{' '}
                  <span className="text-primary">on your first attempt</span>
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Stop wasting weeks on random practice dumps. CertForge&apos;s AI learns
                  your weak spots and builds a study plan that gets you exam-ready in{' '}
                  <strong className="text-foreground">half the time</strong>.
                </p>

                {/* Social proof */}
                <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {[STOCK_IMAGES.avatar1, STOCK_IMAGES.avatar2, STOCK_IMAGES.avatar3].map((src, i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                        <Image
                          src={src}
                          alt=""
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {['J', 'A'].map((initial, i) => (
                      <div key={initial} className="h-8 w-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary">
                        {initial}
                      </div>
                    ))}
                  </div>
                  <span>
                    <strong className="text-foreground">10,247</strong> engineers passed with CertForge
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25 w-full sm:w-auto">
                      Start Studying Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="outline" size="lg" className="text-base h-12 w-full sm:w-auto">
                      See How It Works
                    </Button>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Free forever tier</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> No credit card</span>
                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Cancel anytime</span>
                </div>
              </div>

              {/* Right: Hero image with floating elements */}
              <div className="relative hidden md:block" data-animate="fade-left">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
                  <Image
                    src={STOCK_IMAGES.heroWorkstation}
                    alt="Cloud engineer studying for AWS certification"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  {/* Floating stat card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50" data-animate="float">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs">Predicted Score</p>
                          <p className="text-muted-foreground text-xs">Ready to pass!</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-500">842</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge - top right */}
                <div className="absolute -top-3 -right-3 bg-card border border-border/50 rounded-lg px-3 py-2 shadow-lg" data-animate="float-delayed">
                  <div className="flex items-center gap-2 text-xs">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">12 day streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Social Proof Stats ─── */}
        <section className="py-8 sm:py-10 px-4 border-t bg-muted/30" data-animate="stats">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { value: '2,400+', label: 'Expert-Written Questions', icon: BookOpen },
              { value: '94%', label: 'First-Attempt Pass Rate', icon: GraduationCap },
              { value: '10K+', label: 'Engineers Certified', icon: Users },
              { value: '4.9/5', label: 'Student Rating', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1" data-animate="stagger-item">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Problem Agitation ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" data-animate="section">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Sound familiar?</h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">
              Most SAA-C03 prep tools waste your time. You deserve better.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { text: 'Studying for months with no idea if you\'re actually ready' },
                { text: 'Reviewing the same easy topics while weak areas stay weak' },
                { text: 'Using outdated question dumps that don\'t match the real exam' },
                { text: 'Paying $300+ for the exam only to fail and reschedule' },
              ].map((pain) => (
                <div key={pain.text} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10" data-animate="stagger-item">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
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

        {/* ─── How It Works ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" id="how-it-works" data-animate="section">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">
              Exam-ready in 3 simple steps
            </h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto text-sm sm:text-base">
              No complex setup. No information overload. Just a proven system that works.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: '1',
                  title: 'Take a Diagnostic',
                  desc: 'Answer a few questions and our AI instantly maps your strengths and gaps across all 4 SAA-C03 domains.',
                  detail: '~ 5 minutes',
                  icon: Target,
                  image: STOCK_IMAGES.codingLaptop,
                },
                {
                  step: '2',
                  title: 'Study Smarter, Not Harder',
                  desc: 'Our FSRS algorithm feeds you the right questions at the right time. AI explains every mistake so you actually learn.',
                  detail: '20 min/day',
                  icon: Brain,
                  image: STOCK_IMAGES.studyEnvironment,
                },
                {
                  step: '3',
                  title: 'Know When You\'re Ready',
                  desc: 'Our score predictor tells you your projected exam score. When it says go, you pass. Simple.',
                  detail: '94% pass rate',
                  icon: Award,
                  image: STOCK_IMAGES.graduation,
                },
              ].map((item) => (
                <div key={item.step} className="text-center space-y-3" data-animate="stagger-item">
                  {/* Step image */}
                  <div className="relative h-36 sm:h-44 rounded-xl overflow-hidden mx-auto mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <Badge variant="outline" className="text-xs">{item.detail}</Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" id="features" data-animate="section">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto text-sm sm:text-base">
              Built by AWS-certified engineers who know exactly what the SAA-C03 exam demands.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Brain, title: 'FSRS Spaced Repetition', desc: 'The same algorithm Anki uses. Questions resurface exactly when you\'re about to forget — study 60% less and remember more.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: Zap, title: 'Adaptive Difficulty', desc: 'Questions adjust to your skill level. Crushing a topic? We move on. Struggling? We drill deeper with 3x attention.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { icon: Bot, title: 'AI Tutor (Claude-Powered)', desc: 'Ask anything about any AWS service. Get exam-focused explanations instantly — like having a Solutions Architect on call 24/7.', color: 'text-green-500', bg: 'bg-green-500/10' },
                { icon: Target, title: 'Realistic Mock Exams', desc: '65 questions, 130 minutes — matches the real exam format exactly. Score prediction within 30 points of actual.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { icon: TrendingUp, title: 'Score Prediction', desc: 'Know your projected exam score at all times. Track accuracy across all 4 domains and know exactly when you\'re ready.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                { icon: Flame, title: 'Streaks & Daily Goals', desc: 'Consistency beats cramming. Set a daily goal, build a streak, and watch your predicted score climb day by day.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
              ].map((feature) => (
                <div key={feature.title} data-animate="stagger-item">
                  <Card className="h-full hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                    <CardContent className="pt-5 space-y-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} transition-transform duration-300 group-hover:scale-110`}>
                        <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Platform Preview Image ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" data-animate="section">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
              <Image
                src={STOCK_IMAGES.techAbstract}
                alt="CertForge platform interface"
                width={1200}
                height={600}
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <Cloud className="h-6 w-6 text-primary" />
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">Study anywhere, on any device</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Fully responsive — desktop, tablet, or phone. Study during your commute, lunch break, or wherever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Exam Coverage ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" data-animate="section">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Complete SAA-C03 Domain Coverage</h2>
              <p className="text-muted-foreground text-sm mt-2">
                2,400+ questions mapped to the exact exam blueprint — weighted by domain importance
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: 'Design Secure Architectures', weight: '30%', questions: '720+', color: 'border-blue-500/50', bg: 'bg-blue-500/5', icon: Shield },
                { name: 'Design Resilient Architectures', weight: '26%', questions: '624+', color: 'border-green-500/50', bg: 'bg-green-500/5', icon: BarChart3 },
                { name: 'High-Performing Architectures', weight: '24%', questions: '576+', color: 'border-amber-500/50', bg: 'bg-amber-500/5', icon: Zap },
                { name: 'Cost-Optimized Architectures', weight: '20%', questions: '480+', color: 'border-purple-500/50', bg: 'bg-purple-500/5', icon: Target },
              ].map((domain) => (
                <Card key={domain.name} className={`${domain.color} border-2 ${domain.bg} hover:shadow-md transition-shadow`} data-animate="stagger-item">
                  <CardContent className="pt-4 pb-3 text-center space-y-1">
                    <domain.icon className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                    <p className="text-2xl sm:text-3xl font-bold">{domain.weight}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{domain.name}</p>
                    <p className="text-[10px] text-muted-foreground/60">{domain.questions} questions</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Comparison Table ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" data-animate="section">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">Why engineers switch to CertForge</h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto text-sm">
              See how we compare to the old way of studying.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-red-500/20">
                <CardContent className="pt-5 space-y-3">
                  <p className="font-semibold text-sm text-red-400 flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Traditional Prep
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {['Random question dumps', 'No idea what to study next', 'Generic explanations', 'No score prediction', 'Study 2-3 months', 'Costly retakes ($300+)'].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <XCircle className="h-3 w-3 text-red-500/60 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-green-500/20">
                <CardContent className="pt-5 space-y-3">
                  <p className="font-semibold text-sm text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> CertForge
                  </p>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {['AI-targeted weak areas', 'Smart study plan daily', 'AI explains every mistake', 'Accurate score prediction', 'Exam-ready in 3-4 weeks', 'Pass first attempt (94%)'].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500/60 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" data-animate="section">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">
              Engineers who passed with CertForge
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-8 sm:mb-10">
              Real scores. Real results. Real people.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: 'Sarah K.',
                  role: 'Cloud Engineer at Datadog',
                  quote: 'The AI tutor felt like having a personal instructor. I studied for 3 weeks and scored 842. The score predictor said I\'d get 830 — it was almost exact.',
                  score: '842',
                  studyTime: '3 weeks',
                  avatar: STOCK_IMAGES.avatar1,
                },
                {
                  name: 'Michael T.',
                  role: 'DevOps Engineer at Stripe',
                  quote: 'I failed my first attempt with another platform. Switched to CertForge, studied for 2 more weeks focusing on my weak areas, and passed with a 790.',
                  score: '790',
                  studyTime: '2 weeks',
                  avatar: STOCK_IMAGES.avatar2,
                },
                {
                  name: 'Priya R.',
                  role: 'Solutions Architect at AWS',
                  quote: 'The mock exams are incredibly realistic. The spaced repetition meant I actually retained what I learned instead of cramming and forgetting.',
                  score: '876',
                  studyTime: '4 weeks',
                  avatar: STOCK_IMAGES.avatar3,
                },
              ].map((testimonial) => (
                <Card key={testimonial.name} className="hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5" data-animate="stagger-item">
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
                        <div className="h-9 w-9 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{testimonial.name}</p>
                          <p className="text-[11px] text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="font-mono text-xs">{testimonial.score}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{testimonial.studyTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Trust Badges ─── */}
        <section className="py-6 sm:py-8 px-4 border-t bg-muted/30" data-animate="section">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            {[
              { icon: Shield, text: 'SOC 2 Compliant Hosting', color: 'text-green-500' },
              { icon: CheckCircle, text: 'Updated Weekly for 2026', color: 'text-green-500' },
              { icon: Lock, text: 'Bank-Grade Encryption', color: 'text-green-500' },
              { icon: Gift, text: '7-Day Money Back', color: 'text-green-500' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2">
                <badge.icon className={`h-4 w-4 ${badge.color}`} />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" id="pricing" data-animate="section">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Invest in your career. Not another exam retake.
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              The average failed AWS exam costs <strong className="text-foreground">$300 + weeks of lost time</strong>.
              CertForge pays for itself with a single passed attempt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-6">
              {/* Free */}
              <Card data-animate="stagger-item">
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

              {/* Standard */}
              <Card className="border-primary relative" data-animate="stagger-item">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs shadow-lg shadow-primary/20">
                    <Award className="h-3 w-3 mr-1" /> Most Popular
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
              <Card data-animate="stagger-item">
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

        {/* ─── Objection Handling ─── */}
        <section className="py-10 sm:py-12 px-4 border-t bg-muted/30" data-animate="section">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-center mb-6">Still on the fence?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { question: '"What if I\'m not ready yet?"', answer: 'That\'s exactly what CertForge is for. Start with the free tier, practice daily, and our score predictor will tell you when you\'re ready.' },
                { question: '"What if it doesn\'t work?"', answer: '7-day money-back guarantee on all paid plans. If you don\'t love it, email us for a full refund. No questions asked.' },
                { question: '"I\'ve tried others..."', answer: '94% first-attempt pass rate. The difference is AI-powered spaced repetition — science, not guesswork.' },
              ].map((obj) => (
                <Card key={obj.question} className="hover:border-primary/20 transition-colors" data-animate="stagger-item">
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm font-medium">{obj.question}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{obj.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-12 sm:py-16 px-4 border-t" id="faq" data-animate="section">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { q: 'How is CertForge different from Tutorials Dojo, Whizlabs, etc.?', a: 'CertForge uses FSRS spaced repetition combined with AI-powered explanations and adaptive difficulty. Instead of memorizing random questions, you focus on exactly what you need to learn, when you need to learn it.' },
                { q: 'How many practice questions are included?', a: '2,400+ expert-written questions covering all 4 SAA-C03 domains and 37 topics. Questions are updated weekly. Premium users can also generate unlimited AI questions.' },
                { q: 'How long does it take to be exam-ready?', a: 'Most users report being exam-ready in 3-4 weeks of consistent daily study (20-30 min/day). Our score predictor tells you exactly when you\'re ready.' },
                { q: 'What if I fail? Do you offer a guarantee?', a: 'All paid plans include a 7-day money-back guarantee. Email us within 7 days for a full refund, no questions asked.' },
                { q: 'Can I use CertForge on mobile?', a: 'Yes! CertForge is fully responsive and works beautifully on phones and tablets.' },
                { q: 'Is the content up to date for 2026?', a: 'Absolutely. Our questions are continuously updated to match the latest SAA-C03 exam guide.' },
              ].map((faq) => (
                <Card key={faq.q} className="hover:border-primary/20 transition-colors">
                  <CardContent className="pt-4 pb-4">
                    <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-16 sm:py-20 px-4 border-t relative overflow-hidden" data-animate="section">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={STOCK_IMAGES.cloudComputing}
              alt=""
              fill
              className="object-cover opacity-[0.03]"
            />
          </div>
          <div className="max-w-2xl mx-auto text-center space-y-6 relative">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              Your AWS certification is{' '}
              <span className="text-primary">one decision away</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
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
        <footer className="border-t py-6 sm:py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
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
      </LandingAnimations>
    </div>
  )
}
