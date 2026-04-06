import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Award, CheckCircle, ArrowRight, Clock, Bell, Cloud, Shield, Zap, Server,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cloud Certifications - AWS, Azure, GCP Exam Prep',
  description:
    'CertForge supports AWS SAA-C03 today with Azure and GCP certifications coming soon. Get notified when your certification launches.',
  openGraph: {
    title: 'Certifications | CertForge',
    description: 'AWS SAA-C03 available now. AWS Pro, Developer, SysOps, Azure, and GCP coming soon.',
  },
}

interface Certification {
  name: string
  code: string
  provider: 'aws' | 'azure' | 'gcp'
  difficulty: 'Associate' | 'Professional' | 'Foundational'
  description: string
  status: 'available' | 'coming-soon'
  icon: typeof Cloud
  color: string
  bg: string
}

const certifications: Certification[] = [
  {
    name: 'AWS Solutions Architect Associate',
    code: 'SAA-C03',
    provider: 'aws',
    difficulty: 'Associate',
    description: 'Design and deploy scalable, highly available, and fault-tolerant systems on AWS. The most popular cloud certification worldwide.',
    status: 'available',
    icon: Cloud,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    name: 'AWS Solutions Architect Professional',
    code: 'SAP-C02',
    provider: 'aws',
    difficulty: 'Professional',
    description: 'Advanced design of distributed applications and systems on AWS. For experienced cloud architects seeking the highest AWS credential.',
    status: 'coming-soon',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    name: 'AWS Developer Associate',
    code: 'DVA-C02',
    provider: 'aws',
    difficulty: 'Associate',
    description: 'Develop, deploy, and debug cloud-based applications using AWS. Covers Lambda, DynamoDB, API Gateway, and more.',
    status: 'coming-soon',
    icon: Zap,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    name: 'AWS SysOps Administrator',
    code: 'SOA-C02',
    provider: 'aws',
    difficulty: 'Associate',
    description: 'Deploy, manage, and operate scalable, highly available systems on AWS. Focus on monitoring, security, and automation.',
    status: 'coming-soon',
    icon: Server,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    name: 'Microsoft Azure Fundamentals',
    code: 'AZ-900',
    provider: 'azure',
    difficulty: 'Foundational',
    description: 'Entry-level Azure certification covering cloud concepts, core services, security, privacy, compliance, and pricing.',
    status: 'coming-soon',
    icon: Cloud,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    name: 'Microsoft Azure Administrator',
    code: 'AZ-104',
    provider: 'azure',
    difficulty: 'Associate',
    description: 'Manage Azure subscriptions, implement storage solutions, configure virtual networks, and manage identities.',
    status: 'coming-soon',
    icon: Shield,
    color: 'text-cyan-600',
    bg: 'bg-cyan-600/10',
  },
  {
    name: 'Google Cloud Associate Cloud Engineer',
    code: 'ACE',
    provider: 'gcp',
    difficulty: 'Associate',
    description: 'Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.',
    status: 'coming-soon',
    icon: Cloud,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
]

export default function CertificationsPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
          <Award className="h-3 w-3 text-primary" />
          Multi-Cloud Certification Prep
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          One platform for{' '}
          <span className="text-primary">every cloud certification</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          CertForge is expanding beyond AWS. Get AI-powered study tools for AWS, Azure,
          and GCP certifications - all with the same proven spaced repetition system.
        </p>
      </section>

      {/* Available */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Available Now
        </h2>
        {certifications.filter((c) => c.status === 'available').map((cert) => (
          <Card key={cert.code} className="border-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cert.bg} shrink-0`}>
                  <cert.icon className={`h-7 w-7 ${cert.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <Badge variant="secondary" className="text-xs">{cert.code}</Badge>
                    <Badge className="text-xs bg-green-500">Available</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Award className="h-3 w-3" />{cert.difficulty}</span>
                    <span>2,400+ questions</span>
                    <span>94% pass rate</span>
                  </div>
                </div>
                <Link href="/signup">
                  <Button className="gap-1 shrink-0">
                    Start Studying <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Coming Soon */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.filter((c) => c.status === 'coming-soon').map((cert) => (
            <Card key={cert.code} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cert.bg} shrink-0`}>
                    <cert.icon className={`h-5 w-5 ${cert.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{cert.name}</h3>
                      <Badge variant="outline" className="text-xs">{cert.code}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cert.difficulty}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <Bell className="h-3 w-3" />
                  Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold">Start with AWS SAA-C03 today</h2>
        <p className="text-muted-foreground text-sm">
          Begin your cloud certification journey with our most popular exam prep.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
            Start Studying Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
