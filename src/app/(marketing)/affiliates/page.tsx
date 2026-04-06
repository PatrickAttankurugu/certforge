import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign, CheckCircle, ArrowRight, Share2, Users, TrendingUp, MousePointer, BarChart3,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program - Earn 30% Recurring Commission',
  description:
    'Join the CertForge affiliate program. Earn 30% recurring commission for every customer you refer. 60-day cookie. Monthly payouts.',
  openGraph: {
    title: 'Affiliate Program | CertForge',
    description: 'Earn 30% recurring commission with the CertForge affiliate program.',
  },
}

export default function AffiliatesPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <DollarSign className="h-3 w-3 text-green-500" />
          Affiliate Program
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Earn <span className="text-primary">30% recurring commission</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Recommend CertForge to your audience and earn 30% of every payment for as long
          as they stay subscribed. 60-day cookie window. Monthly payouts.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '30%', label: 'Recurring Commission' },
            { value: '60 days', label: 'Cookie Duration' },
            { value: '$50+', label: 'Avg Monthly / Referral' },
            { value: 'Monthly', label: 'Payout Schedule' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', icon: CheckCircle, title: 'Apply', desc: 'Fill out the application form below. We review and approve within 24 hours.' },
            { step: '2', icon: Share2, title: 'Get Your Link', desc: 'Receive your unique referral link and marketing materials.' },
            { step: '3', icon: MousePointer, title: 'Share', desc: 'Share CertForge with your audience through your blog, YouTube, social media, or newsletter.' },
            { step: '4', icon: DollarSign, title: 'Earn', desc: 'Earn 30% of every payment your referrals make. Recurring for the life of their subscription.' },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 mx-auto">
                {item.step}
              </div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-center mb-8">Affiliate Dashboard Preview</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: MousePointer, label: 'Clicks', value: '2,847', color: 'text-blue-500' },
                { icon: Users, label: 'Conversions', value: '142', color: 'text-green-500' },
                { icon: DollarSign, label: 'Earnings', value: '$4,260', color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Conv. Rate', value: '4.98%', color: 'text-purple-500' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="h-32 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Earnings chart available after sign-up</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Application form */}
      <section className="max-w-lg mx-auto mb-16">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold">Apply to the Affiliate Program</h2>
            <p className="text-sm text-muted-foreground">
              We review applications within 24 hours. Blog owners, YouTubers, newsletter writers, and educators welcome.
            </p>
            <form action="mailto:affiliates@certforge.dev" method="POST" encType="text/plain" className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                required
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="url"
                name="website"
                placeholder="Website or social profile URL"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                name="audience_size"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Audience size</option>
                <option value="under-1k">Under 1,000</option>
                <option value="1k-10k">1,000 - 10,000</option>
                <option value="10k-50k">10,000 - 50,000</option>
                <option value="50k-100k">50,000 - 100,000</option>
                <option value="100k+">100,000+</option>
              </select>
              <textarea
                name="promotion_plan"
                placeholder="How do you plan to promote CertForge?"
                rows={3}
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <Button type="submit" className="w-full">Submit Application</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Start earning today</h2>
        <p className="text-muted-foreground text-sm">
          Join hundreds of affiliates already earning recurring income with CertForge.
        </p>
      </section>
    </div>
  )
}
