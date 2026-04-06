import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Gift, CheckCircle, ArrowRight, Sparkles, Star, Heart,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Subscriptions - Give the Gift of AWS Certification',
  description:
    'Gift a CertForge premium subscription to a friend or colleague. Help them pass the AWS SAA-C03. 3, 6, and 12-month options available.',
  openGraph: {
    title: 'Gift Subscriptions | CertForge',
    description: 'Give the gift of AWS certification. Premium subscription gift cards from $87.',
  },
}

const giftOptions = [
  {
    duration: '3 Months',
    price: '$87',
    priceDetail: '$29/mo value',
    savings: '',
    popular: false,
  },
  {
    duration: '6 Months',
    price: '$149',
    priceDetail: '$24.83/mo value',
    savings: 'Save $25',
    popular: true,
  },
  {
    duration: '12 Months',
    price: '$249',
    priceDetail: '$20.75/mo value',
    savings: 'Save $99',
    popular: false,
  },
]

export default function GiftPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <Gift className="h-3 w-3 text-pink-500" />
          Gift Subscriptions
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Give the gift of{' '}
          <span className="text-primary">AWS certification</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Know someone preparing for the AWS Solutions Architect exam? Gift them premium access to
          CertForge with AI-powered study tools, unlimited practice, and mock exams.
        </p>
      </section>

      {/* Gift options */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftOptions.map((option) => (
            <Card
              key={option.duration}
              className={option.popular ? 'border-primary relative' : ''}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs shadow-lg shadow-primary/20">
                    <Heart className="h-3 w-3 mr-1" /> Most Gifted
                  </Badge>
                </div>
              )}
              <CardContent className="pt-6 space-y-5">
                <div>
                  <p className="font-semibold">{option.duration}</p>
                  <p className="text-xs text-muted-foreground">Premium access</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">{option.price}</p>
                  <p className="text-xs text-muted-foreground">{option.priceDetail}</p>
                  {option.savings && (
                    <p className="text-xs text-green-500 font-medium mt-1">{option.savings}</p>
                  )}
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Unlimited questions</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Unlimited mock exams</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />AI Tutor access</li>
                  <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />Custom gift message</li>
                </ul>
                <Button
                  className={option.popular ? 'w-full shadow-lg shadow-primary/25' : 'w-full'}
                  variant={option.popular ? 'default' : 'outline'}
                >
                  Gift {option.duration}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Gift card preview */}
      <section className="max-w-lg mx-auto mb-16">
        <h2 className="text-xl font-bold text-center mb-8">Preview Your Gift</h2>
        <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/30">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CertForge</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">A gift for you</p>
              <p className="text-lg font-semibold">6 Months Premium Access</p>
            </div>
            <div className="bg-card/80 rounded-lg p-4 text-sm text-muted-foreground italic max-w-xs mx-auto">
              &ldquo;You are going to crush the AWS exam! This is your secret weapon. Good luck!&rdquo;
            </div>
            <p className="text-xs text-muted-foreground">From: Sarah K.</p>
          </CardContent>
        </Card>
      </section>

      {/* Gift form */}
      <section className="max-w-lg mx-auto mb-16">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Send a Gift
            </h2>
            <form className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Recipient&apos;s email</label>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Your name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Gift message (optional)</label>
                <textarea
                  placeholder="Add a personal message..."
                  rows={3}
                  className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Plan duration</label>
                <select className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="3">3 Months - $87</option>
                  <option value="6">6 Months - $149</option>
                  <option value="12">12 Months - $249</option>
                </select>
              </div>
              <Button className="w-full gap-1">
                <Gift className="h-4 w-4" />
                Purchase Gift
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Trust */}
      <section className="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> 4.9/5 rating</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Instant delivery</span>
          <span className="flex items-center gap-1"><Gift className="h-4 w-4 text-pink-500" /> Custom messages</span>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Give the gift that advances careers</h2>
        <p className="text-muted-foreground text-sm">
          Help someone you care about earn their AWS certification.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Browse Gift Options <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
