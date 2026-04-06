import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Infinity as InfinityIcon, CheckCircle, ArrowRight, Shield, Star, Clock, XCircle, Sparkles,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lifetime Access - One Payment, Forever Premium',
  description:
    'Get lifetime premium access to CertForge for a one-time payment of $399. No recurring charges. All future certifications included.',
  openGraph: {
    title: 'Lifetime Access | CertForge',
    description: 'One-time payment of $399 for lifetime premium access. Pays for itself in 7 months.',
  },
}

export default function LifetimePage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <InfinityIcon className="h-3 w-3 text-primary" />
          Limited-Time Offer
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          One payment.{' '}
          <span className="text-primary">Forever premium.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Stop paying monthly. Get lifetime premium access to CertForge with a single
          payment. Includes all current and future certifications.
        </p>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">Compare Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <p className="font-semibold">Monthly Premium</p>
                <p className="text-xs text-muted-foreground">Pay as you go</p>
              </div>
              <div>
                <p className="text-4xl font-bold">$59<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                <p className="text-xs text-muted-foreground">$708/year if you stay subscribed</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Full Premium features</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Cancel anytime</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />Recurring charges</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />Future certs cost extra</li>
              </ul>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full">Choose Monthly</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Annual */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div>
                <p className="font-semibold">Annual Premium</p>
                <p className="text-xs text-muted-foreground">Save with yearly billing</p>
              </div>
              <div>
                <p className="text-4xl font-bold">$199<span className="text-sm text-muted-foreground font-normal">/yr</span></p>
                <p className="text-xs text-green-500 font-medium">Save $509/year vs monthly</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Full Premium features</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />72% savings vs monthly</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />Annual renewal</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />Future certs cost extra</li>
              </ul>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full">Choose Annual</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Lifetime */}
          <Card className="border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="text-xs shadow-lg shadow-primary/20">
                <Sparkles className="h-3 w-3 mr-1" /> Best Value
              </Badge>
            </div>
            <CardContent className="pt-6 space-y-5">
              <div>
                <p className="font-semibold">Lifetime Access</p>
                <p className="text-xs text-muted-foreground">Pay once, use forever</p>
              </div>
              <div>
                <p className="text-4xl font-bold">$399<span className="text-sm text-muted-foreground font-normal"> once</span></p>
                <p className="text-xs text-green-500 font-medium">Pays for itself in 7 months</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Full Premium features</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />No recurring charges ever</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />All future certifications</li>
                <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Lifetime updates</li>
              </ul>
              <Link href="/signup" className="block">
                <Button className="w-full shadow-lg shadow-primary/25">Get Lifetime Access</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="max-w-2xl mx-auto mb-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 space-y-4 text-center">
            <h2 className="text-lg font-bold">Savings Calculator</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">7 months</p>
                <p className="text-xs text-muted-foreground">Break-even vs monthly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">$309</p>
                <p className="text-xs text-muted-foreground">Saved in year 1 vs monthly</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">$1,017</p>
                <p className="text-xs text-muted-foreground">Saved in year 2 vs monthly</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              If you plan to study for more than 7 months or tackle multiple certifications,
              lifetime access is the smartest investment.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Trust signals */}
      <section className="max-w-3xl mx-auto mb-16">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: Shield, text: '30-Day Money-Back Guarantee' },
            { icon: Star, text: '4.9/5 from 2,847 reviews' },
            { icon: Clock, text: 'Instant access after purchase' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2">
              <badge.icon className="h-4 w-4 text-green-500" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pass guarantee reference */}
      <section className="max-w-2xl mx-auto mb-16 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Lifetime access includes our{' '}
          <Link href="/guarantee" className="text-primary underline underline-offset-2 font-medium">
            Pass Guarantee
          </Link>
          . Pass the exam or get your money back.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Lock in lifetime access today</h2>
        <p className="text-muted-foreground text-sm">One payment. No subscriptions. All future certifications included.</p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Get Lifetime Access - $399 <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">30-day money-back guarantee</p>
      </section>
    </div>
  )
}
