import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, ArrowRight, Shield, BarChart3, Zap, Target, CheckCircle,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AWS SAA-C03 Practice Questions - All 4 Domains',
  description:
    'Practice free AWS Solutions Architect Associate (SAA-C03) exam questions across all 4 domains. Test your knowledge with expert-written questions and detailed explanations.',
  keywords: [
    'AWS SAA-C03 practice questions', 'free AWS practice test', 'AWS Solutions Architect questions',
    'AWS certification practice', 'SAA-C03 sample questions', 'AWS exam prep free',
  ],
  openGraph: {
    title: 'Free AWS SAA-C03 Practice Questions | CertForge',
    description: 'Practice free exam questions across all 4 SAA-C03 domains. Expert-written with detailed explanations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AWS SAA-C03 Practice Questions | CertForge',
    description: 'Practice free exam questions across all 4 SAA-C03 domains.',
  },
}

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free AWS SAA-C03 Practice Questions',
    description: 'Practice free AWS Solutions Architect Associate exam questions across all 4 domains.',
    url: 'https://certforge.dev/practice-questions',
    isPartOf: { '@type': 'WebSite', name: 'CertForge', url: 'https://certforge.dev' },
    about: {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Solutions Architect Associate (SAA-C03)',
      credentialCategory: 'Professional Certification',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

const domains = [
  {
    slug: 'secure',
    name: 'Design Secure Architectures',
    weight: '30%',
    questions: '720+',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'IAM, encryption, VPC security, AWS Organizations, and access control policies.',
  },
  {
    slug: 'resilient',
    name: 'Design Resilient Architectures',
    weight: '26%',
    questions: '624+',
    icon: BarChart3,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Multi-AZ, Auto Scaling, decoupled architectures, disaster recovery, and backups.',
  },
  {
    slug: 'performant',
    name: 'Design High-Performing Architectures',
    weight: '24%',
    questions: '576+',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Caching, CDN, database optimization, serverless compute, and data transfer.',
  },
  {
    slug: 'cost',
    name: 'Design Cost-Optimized Architectures',
    weight: '20%',
    questions: '480+',
    icon: Target,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Spot Instances, Reserved Instances, S3 storage classes, and right-sizing strategies.',
  },
]

export default function PracticeQuestionsPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <JsonLd />

      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <BookOpen className="h-3 w-3 text-primary" />
          Free Practice Questions
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Free AWS SAA-C03{' '}
          <span className="text-primary">Practice Questions</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Test your knowledge with free sample questions from all 4 domains of the
          AWS Solutions Architect Associate (SAA-C03) exam. Each question includes a
          detailed explanation.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-8">Choose a Domain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain) => (
            <Link key={domain.slug} href={`/practice-questions/${domain.slug}`}>
              <Card className={`h-full hover:${domain.borderColor} hover:shadow-lg transition-all duration-300 group`}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${domain.bg} shrink-0`}>
                      <domain.icon className={`h-5 w-5 ${domain.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {domain.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{domain.weight} of exam</Badge>
                        <span className="text-xs text-muted-foreground">{domain.questions} questions</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{domain.description}</p>
                  <p className="text-xs text-primary font-medium">5 free sample questions available</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4 bg-muted/30 rounded-xl p-8 border">
        <h2 className="text-xl font-bold">Want unlimited practice questions?</h2>
        <p className="text-sm text-muted-foreground">
          Sign up for free to access 10 questions per day with FSRS spaced repetition.
          Upgrade to Premium for unlimited questions and AI explanations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button className="gap-1 shadow-lg shadow-primary/25">
              Sign Up Free <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/#pricing">
            <Button variant="outline">View Pricing</Button>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> No credit card</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> 2,400+ questions</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> AI explanations</span>
        </div>
      </section>
    </div>
  )
}
