import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users, CheckCircle, ArrowRight, BarChart3, Target, Shield, Trophy, Zap, Mail,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team & Corporate Plans - Bulk AWS Certification Prep',
  description:
    'Get your entire team AWS certified with CertForge. Team analytics, shared question pools, bulk discounts starting at $12/seat/month.',
  openGraph: {
    title: 'Team Plans | CertForge',
    description: 'Bulk discounts for teams. Admin dashboard, progress tracking, and team analytics for AWS certification prep.',
  },
}

export default function TeamsPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <Users className="h-3 w-3 text-blue-500" />
          Team & Corporate Plans
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Get your entire team{' '}
          <span className="text-primary">AWS certified</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Centralized admin dashboard, team progress tracking, bulk discounts, and
          everything your team needs to pass the AWS Solutions Architect exam together.
        </p>
      </section>

      {/* Pricing tiers */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">Team Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Small Team',
              seats: '5-10 seats',
              price: '$15',
              per: '/seat/mo',
              savings: 'Save 49% vs individual',
              features: [
                'All Premium features',
                'Admin dashboard',
                'Team progress tracking',
                'Shared question pools',
                'Email support',
              ],
              cta: 'Get Started',
              popular: false,
            },
            {
              name: 'Business',
              seats: '11-50 seats',
              price: '$12',
              per: '/seat/mo',
              savings: 'Save 59% vs individual',
              features: [
                'Everything in Small Team',
                'Team analytics & reports',
                'Challenge each other',
                'Dedicated account manager',
                'SSO integration',
              ],
              cta: 'Get Started',
              popular: true,
            },
            {
              name: 'Enterprise',
              seats: '50+ seats',
              price: 'Custom',
              per: '',
              savings: 'Volume discounts available',
              features: [
                'Everything in Business',
                'Custom question pools',
                'API access',
                'SLA guarantee',
                'Invoice billing',
                'Custom integrations',
              ],
              cta: 'Contact Sales',
              popular: false,
            },
          ].map((tier) => (
            <Card
              key={tier.name}
              className={tier.popular ? 'border-primary relative' : ''}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs shadow-lg shadow-primary/20">Most Popular</Badge>
                </div>
              )}
              <CardContent className="pt-6 space-y-5">
                <div>
                  <p className="font-semibold">{tier.name}</p>
                  <p className="text-xs text-muted-foreground">{tier.seats}</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">
                    {tier.price}
                    <span className="text-sm text-muted-foreground font-normal">{tier.per}</span>
                  </p>
                  <p className="text-xs text-green-500 font-medium mt-1">{tier.savings}</p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.name === 'Enterprise' ? (
                  <a href="mailto:teams@certforge.dev">
                    <Button variant="outline" className="w-full">{tier.cta}</Button>
                  </a>
                ) : (
                  <Link href="/signup">
                    <Button className={tier.popular ? 'w-full shadow-lg shadow-primary/25' : 'w-full'} variant={tier.popular ? 'default' : 'outline'}>
                      {tier.cta}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10">Team Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: 'Team Analytics', desc: 'See how each team member is progressing across all 4 domains. Identify who needs extra support.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: Target, title: 'Shared Question Pools', desc: 'Create custom question sets focused on your team\'s specific AWS usage and architecture patterns.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { icon: Trophy, title: 'Team Challenges', desc: 'Challenge teammates to mock exam showdowns. Friendly competition drives better results.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Shield, title: 'Admin Dashboard', desc: 'Manage seats, track progress, and generate reports from a centralized admin panel.', color: 'text-green-500', bg: 'bg-green-500/10' },
            { icon: Zap, title: 'Bulk Onboarding', desc: 'Invite your team with a single link. Everyone gets set up and studying in minutes.', color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: Users, title: 'Progress Tracking', desc: 'Track certification readiness across your organization. Know exactly when each member is exam-ready.', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          ].map((feature) => (
            <Card key={feature.title} className="hover:border-primary/30 transition-colors">
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
      </section>

      {/* Contact form */}
      <section className="max-w-lg mx-auto mb-16">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Our Team Sales
            </h2>
            <p className="text-sm text-muted-foreground">
              Have questions about team plans? Reach out and we will get back to you within one business day.
            </p>
            <form action="mailto:teams@certforge.dev" method="POST" encType="text/plain" className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                name="company"
                placeholder="Company name"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                name="seats"
                placeholder="Number of seats needed"
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                name="message"
                placeholder="Any additional details..."
                rows={3}
                className="rounded-lg border bg-background px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <Button type="submit" className="w-full">Send Inquiry</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to certify your team?</h2>
        <p className="text-muted-foreground text-sm">
          Start with a small team plan and scale as needed. Every seat includes full Premium access.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
