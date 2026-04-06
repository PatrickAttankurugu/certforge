import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield, CheckCircle, ArrowRight, Award, BookOpen, ClipboardCheck, CreditCard, Star, Users, Lock,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pass Guarantee - Pass AWS SAA-C03 or Your Money Back',
  description:
    'CertForge offers a pass guarantee for premium members. Complete the study plan, take mock exams, and pass the AWS SAA-C03 - or get a full refund.',
  openGraph: {
    title: 'Pass Guarantee | CertForge',
    description: 'Pass the AWS SAA-C03 or your money back. Our pass guarantee covers premium plan members who complete the study requirements.',
  },
}

export default function GuaranteePage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <Shield className="h-3 w-3 text-green-500" />
          100% Money-Back Guarantee
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Pass the AWS SAA-C03{' '}
          <span className="text-primary">or your money back</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          We are so confident in CertForge that we guarantee you will pass the AWS Solutions
          Architect Associate exam. If you follow the plan and don&apos;t pass, we will refund
          every penny.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Start Premium Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">
          How the Pass Guarantee Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              icon: CreditCard,
              title: 'Sign Up for Premium',
              desc: 'Subscribe to the Premium plan ($59/mo) to unlock the full pass guarantee.',
            },
            {
              step: '2',
              icon: BookOpen,
              title: 'Complete 80%+ Questions',
              desc: 'Work through at least 80% of all available practice questions across all 4 domains.',
            },
            {
              step: '3',
              icon: ClipboardCheck,
              title: 'Take 3+ Mock Exams',
              desc: 'Complete at least 3 full mock exams scoring 600 or higher on each attempt.',
            },
            {
              step: '4',
              icon: Award,
              title: 'Pass or Get Refunded',
              desc: 'Take the real exam. If you don\'t pass, send us your score report for a full refund.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 mx-auto">
                {item.step}
              </div>
              <item.icon className="h-5 w-5 mx-auto text-muted-foreground" />
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="max-w-3xl mx-auto mb-16">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Guarantee Requirements
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                'Active Premium plan subscription for at least 30 days before your exam date',
                'Completed at least 80% of all available practice questions',
                'Taken at least 3 full mock exams with scores of 600 or above',
                'Exam taken within 60 days of your last study session',
                'Submit your official AWS score report showing a failing score within 14 days',
              ].map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Trust badges */}
      <section className="max-w-3xl mx-auto mb-16">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: Shield, text: 'Full Refund Guaranteed' },
            { icon: Lock, text: 'Secure Payment' },
            { icon: Users, text: '10,000+ Passed' },
            { icon: Star, text: '4.9/5 Rating' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2">
              <badge.icon className="h-4 w-4 text-green-500" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial placeholders */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-center mb-8">Engineers Who Used the Guarantee</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'David L.',
              role: 'Cloud Architect',
              quote: 'I studied for 4 weeks, scored 810. The guarantee gave me the confidence to commit to the Premium plan.',
            },
            {
              name: 'Anna M.',
              role: 'DevOps Engineer',
              quote: 'The mock exams were so close to the real exam. I passed on my first try and never needed the refund.',
            },
            {
              name: 'James W.',
              role: 'Solutions Architect',
              quote: 'Knowing there was a money-back guarantee removed all the pressure. I could focus purely on learning.',
            },
          ].map((t) => (
            <Card key={t.name} className="hover:border-primary/20 transition-colors">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-center mb-8">Guarantee FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: 'What if I fail and meet all the requirements?',
              a: 'Email us at support@certforge.dev with your AWS score report within 14 days of your exam. We will process a full refund within 5 business days.',
            },
            {
              q: 'Does the guarantee apply to monthly or annual plans?',
              a: 'The guarantee applies to the Premium plan only, whether you pay monthly or annually.',
            },
            {
              q: 'Can I use the guarantee more than once?',
              a: 'The guarantee covers one exam attempt per subscription period.',
            },
            {
              q: 'What counts as "80% of questions"?',
              a: 'You need to have answered at least 80% of the unique questions in our database at least once. Your progress dashboard tracks this percentage.',
            },
            {
              q: 'What if my mock exam scores are below 600?',
              a: 'Keep studying! The guarantee requires at least 3 mock exams scoring 600+. This threshold ensures you are genuinely prepared before attempting the real exam.',
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
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to pass with confidence?</h2>
        <p className="text-muted-foreground text-sm">
          Start your Premium trial today. Your certification is guaranteed.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Start Premium Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">7-day free trial. Cancel anytime.</p>
      </section>
    </div>
  )
}
