import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, ArrowRight, CheckCircle, XCircle, ArrowLeft, Shield, BarChart3, Zap, Target,
} from 'lucide-react'
import type { Metadata } from 'next'

interface DomainData {
  name: string
  slug: string
  weight: string
  icon: typeof Shield
  color: string
  bg: string
  metaTitle: string
  metaDescription: string
  questions: {
    id: number
    text: string
    options: { id: string; text: string; isCorrect: boolean }[]
    explanation: string
  }[]
}

const domainData: Record<string, DomainData> = {
  secure: {
    name: 'Design Secure Architectures',
    slug: 'secure',
    weight: '30%',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    metaTitle: 'Free AWS SAA-C03 Security Questions - Design Secure Architectures',
    metaDescription: 'Practice free AWS SAA-C03 exam questions on Design Secure Architectures (30% of exam). IAM, encryption, VPC security, and more.',
    questions: [
      {
        id: 1,
        text: 'A company needs to ensure that all data stored in Amazon S3 is encrypted at rest. Which of the following is the MOST operationally efficient way to accomplish this?',
        options: [
          { id: 'A', text: 'Enable default encryption on the S3 bucket using SSE-S3', isCorrect: true },
          { id: 'B', text: 'Use a bucket policy to deny any uploads without encryption headers', isCorrect: false },
          { id: 'C', text: 'Encrypt each object client-side before uploading', isCorrect: false },
          { id: 'D', text: 'Use AWS Lambda to encrypt objects after they are uploaded', isCorrect: false },
        ],
        explanation: 'Enabling default encryption (SSE-S3) on the S3 bucket is the most operationally efficient approach. All objects are automatically encrypted without requiring changes to application code or bucket policies. SSE-S3 uses AES-256 encryption managed by AWS.',
      },
      {
        id: 2,
        text: 'A solutions architect needs to design a multi-account strategy using AWS Organizations. Which feature should be used to restrict access to specific AWS services across all accounts?',
        options: [
          { id: 'A', text: 'IAM policies attached to each account', isCorrect: false },
          { id: 'B', text: 'Service Control Policies (SCPs)', isCorrect: true },
          { id: 'C', text: 'AWS Config rules', isCorrect: false },
          { id: 'D', text: 'Amazon GuardDuty findings', isCorrect: false },
        ],
        explanation: 'Service Control Policies (SCPs) in AWS Organizations are the correct mechanism to set permission guardrails across all accounts. SCPs define the maximum permissions for member accounts and are applied at the organizational unit (OU) or account level.',
      },
      {
        id: 3,
        text: 'An application running on EC2 instances needs to access objects in an S3 bucket. What is the MOST secure way to grant this access?',
        options: [
          { id: 'A', text: 'Store AWS access keys in the application configuration file', isCorrect: false },
          { id: 'B', text: 'Store AWS access keys in environment variables', isCorrect: false },
          { id: 'C', text: 'Attach an IAM role to the EC2 instances with an appropriate policy', isCorrect: true },
          { id: 'D', text: 'Create an S3 bucket policy that allows access from any EC2 instance', isCorrect: false },
        ],
        explanation: 'Using an IAM role attached to EC2 instances is the most secure approach. The role provides temporary credentials that are automatically rotated, eliminating the risk of long-term credential exposure. This follows the AWS security best practice of least privilege.',
      },
      {
        id: 4,
        text: 'A company wants to allow users from a partner organization to access resources in their AWS account. Which approach follows AWS best practices?',
        options: [
          { id: 'A', text: 'Create individual IAM users for each partner employee', isCorrect: false },
          { id: 'B', text: 'Share the root account credentials securely', isCorrect: false },
          { id: 'C', text: 'Set up cross-account IAM roles that the partner can assume', isCorrect: true },
          { id: 'D', text: 'Disable MFA to simplify partner access', isCorrect: false },
        ],
        explanation: 'Cross-account IAM roles allow external entities to assume a role in your account with specific permissions. This is the recommended approach for granting cross-account access as it uses temporary credentials and follows the principle of least privilege.',
      },
      {
        id: 5,
        text: 'Which AWS service provides a centralized view of security alerts and compliance status across multiple AWS accounts?',
        options: [
          { id: 'A', text: 'Amazon Inspector', isCorrect: false },
          { id: 'B', text: 'AWS Security Hub', isCorrect: true },
          { id: 'C', text: 'Amazon Detective', isCorrect: false },
          { id: 'D', text: 'AWS CloudTrail', isCorrect: false },
        ],
        explanation: 'AWS Security Hub provides a comprehensive view of security alerts and compliance status across AWS accounts. It aggregates findings from services like GuardDuty, Inspector, and Macie, and checks against security best practices standards like CIS Benchmarks.',
      },
    ],
  },
  resilient: {
    name: 'Design Resilient Architectures',
    slug: 'resilient',
    weight: '26%',
    icon: BarChart3,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    metaTitle: 'Free AWS SAA-C03 Resilience Questions - Design Resilient Architectures',
    metaDescription: 'Practice free AWS SAA-C03 questions on Design Resilient Architectures (26% of exam). Multi-AZ, Auto Scaling, disaster recovery.',
    questions: [
      {
        id: 1,
        text: 'A company needs to design a highly available web application. The application should continue to serve traffic even if an entire Availability Zone fails. Which architecture meets this requirement?',
        options: [
          { id: 'A', text: 'Deploy EC2 instances in a single AZ behind an Application Load Balancer', isCorrect: false },
          { id: 'B', text: 'Deploy an Auto Scaling group across multiple AZs behind an Application Load Balancer', isCorrect: true },
          { id: 'C', text: 'Deploy a single large EC2 instance with enhanced networking', isCorrect: false },
          { id: 'D', text: 'Use Route 53 health checks with a single EC2 instance', isCorrect: false },
        ],
        explanation: 'An Auto Scaling group spanning multiple Availability Zones behind an ALB provides high availability. If one AZ fails, the ALB routes traffic to healthy instances in other AZs, and Auto Scaling can launch replacement instances.',
      },
      {
        id: 2,
        text: 'A company uses an Amazon RDS MySQL database. They need to minimize downtime during a database failure. Which configuration should be used?',
        options: [
          { id: 'A', text: 'Enable Multi-AZ deployment for the RDS instance', isCorrect: true },
          { id: 'B', text: 'Create a read replica in the same Availability Zone', isCorrect: false },
          { id: 'C', text: 'Use Amazon ElastiCache to cache all database queries', isCorrect: false },
          { id: 'D', text: 'Take frequent manual snapshots of the database', isCorrect: false },
        ],
        explanation: 'RDS Multi-AZ deployment maintains a synchronous standby replica in a different AZ. In case of failure, AWS automatically fails over to the standby, typically within 60-120 seconds, minimizing downtime without manual intervention.',
      },
      {
        id: 3,
        text: 'An application processes messages from an SQS queue. Occasionally, messages fail to process. What should be implemented to handle failed messages without losing them?',
        options: [
          { id: 'A', text: 'Increase the visibility timeout of the queue', isCorrect: false },
          { id: 'B', text: 'Configure a dead-letter queue (DLQ) for the source queue', isCorrect: true },
          { id: 'C', text: 'Enable long polling on the queue', isCorrect: false },
          { id: 'D', text: 'Use FIFO queue instead of standard queue', isCorrect: false },
        ],
        explanation: 'A dead-letter queue (DLQ) captures messages that fail processing after a specified number of attempts. This prevents message loss while isolating problematic messages for debugging, without blocking the processing of other messages in the queue.',
      },
      {
        id: 4,
        text: 'A company needs a disaster recovery solution with an RTO of 1 hour and RPO of 15 minutes. Which strategy is MOST cost-effective?',
        options: [
          { id: 'A', text: 'Multi-site active-active deployment', isCorrect: false },
          { id: 'B', text: 'Warm standby with scaled-down resources in the DR region', isCorrect: true },
          { id: 'C', text: 'Backup and restore from S3', isCorrect: false },
          { id: 'D', text: 'Pilot light with minimal resources in the DR region', isCorrect: false },
        ],
        explanation: 'Warm standby maintains a scaled-down but functional copy of the production environment. It can meet the 1-hour RTO by scaling up quickly and 15-minute RPO through continuous replication. It is more cost-effective than multi-site while meeting the requirements.',
      },
      {
        id: 5,
        text: 'A solutions architect needs to decouple the components of a distributed application. Which combination of AWS services provides a fully managed, serverless solution?',
        options: [
          { id: 'A', text: 'Amazon SQS and Amazon SNS', isCorrect: true },
          { id: 'B', text: 'Amazon EC2 and Amazon EBS', isCorrect: false },
          { id: 'C', text: 'AWS Direct Connect and Amazon VPC', isCorrect: false },
          { id: 'D', text: 'Amazon RDS and Amazon ElastiCache', isCorrect: false },
        ],
        explanation: 'Amazon SQS (queue-based messaging) and Amazon SNS (pub/sub messaging) are fully managed, serverless services ideal for decoupling application components. SQS handles point-to-point communication while SNS enables fan-out messaging patterns.',
      },
    ],
  },
  performant: {
    name: 'Design High-Performing Architectures',
    slug: 'performant',
    weight: '24%',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    metaTitle: 'Free AWS SAA-C03 Performance Questions - High-Performing Architectures',
    metaDescription: 'Practice free AWS SAA-C03 questions on Design High-Performing Architectures (24% of exam). Caching, CDN, serverless, optimization.',
    questions: [
      {
        id: 1,
        text: 'A web application serves static assets (images, CSS, JavaScript) to users globally. Users in Asia are experiencing slow load times. What is the MOST effective solution?',
        options: [
          { id: 'A', text: 'Deploy the application in multiple AWS Regions', isCorrect: false },
          { id: 'B', text: 'Use Amazon CloudFront to distribute content from edge locations', isCorrect: true },
          { id: 'C', text: 'Upgrade to larger EC2 instances', isCorrect: false },
          { id: 'D', text: 'Enable S3 Transfer Acceleration', isCorrect: false },
        ],
        explanation: 'Amazon CloudFront is a CDN that caches content at edge locations worldwide. By serving static assets from edge locations closest to Asian users, latency is significantly reduced. This is the most effective and cost-efficient solution for global content delivery.',
      },
      {
        id: 2,
        text: 'An application frequently reads the same data from an RDS database, causing high read latency. Which solution would improve read performance with MINIMAL application changes?',
        options: [
          { id: 'A', text: 'Add an Amazon ElastiCache layer in front of the database', isCorrect: true },
          { id: 'B', text: 'Migrate to Amazon DynamoDB', isCorrect: false },
          { id: 'C', text: 'Enable RDS Multi-AZ deployment', isCorrect: false },
          { id: 'D', text: 'Increase the RDS instance size', isCorrect: false },
        ],
        explanation: 'Amazon ElastiCache (Redis or Memcached) provides an in-memory caching layer that dramatically reduces read latency for frequently accessed data. Application changes are minimal since you only need to add cache-aside logic for reads.',
      },
      {
        id: 3,
        text: 'A company is designing an API that will handle thousands of requests per second with variable traffic patterns. Which solution provides the BEST scalability?',
        options: [
          { id: 'A', text: 'EC2 instances behind an Application Load Balancer', isCorrect: false },
          { id: 'B', text: 'AWS Lambda functions behind Amazon API Gateway', isCorrect: true },
          { id: 'C', text: 'Amazon ECS tasks with manual scaling', isCorrect: false },
          { id: 'D', text: 'A single large EC2 instance with enhanced networking', isCorrect: false },
        ],
        explanation: 'API Gateway with Lambda functions provides automatic scaling that handles variable traffic patterns without any capacity planning. Lambda scales instantly from zero to thousands of concurrent executions and you only pay for actual usage.',
      },
      {
        id: 4,
        text: 'A data analytics application needs to process large datasets stored in S3 with SQL queries. Which service provides serverless query capabilities?',
        options: [
          { id: 'A', text: 'Amazon Redshift', isCorrect: false },
          { id: 'B', text: 'Amazon Athena', isCorrect: true },
          { id: 'C', text: 'Amazon RDS', isCorrect: false },
          { id: 'D', text: 'Amazon EMR', isCorrect: false },
        ],
        explanation: 'Amazon Athena is a serverless interactive query service that lets you analyze data directly in S3 using standard SQL. There is no infrastructure to manage, and you pay only for the data scanned. It integrates with AWS Glue for data cataloging.',
      },
      {
        id: 5,
        text: 'An application needs to store and retrieve key-value data with single-digit millisecond latency at any scale. Which database service should be used?',
        options: [
          { id: 'A', text: 'Amazon RDS MySQL', isCorrect: false },
          { id: 'B', text: 'Amazon DynamoDB', isCorrect: true },
          { id: 'C', text: 'Amazon Redshift', isCorrect: false },
          { id: 'D', text: 'Amazon DocumentDB', isCorrect: false },
        ],
        explanation: 'Amazon DynamoDB is a fully managed NoSQL database that provides single-digit millisecond performance at any scale. It supports key-value and document data models with automatic scaling and built-in security.',
      },
    ],
  },
  cost: {
    name: 'Design Cost-Optimized Architectures',
    slug: 'cost',
    weight: '20%',
    icon: Target,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    metaTitle: 'Free AWS SAA-C03 Cost Optimization Questions - Cost-Optimized Architectures',
    metaDescription: 'Practice free AWS SAA-C03 questions on Design Cost-Optimized Architectures (20% of exam). Spot Instances, storage classes, right-sizing.',
    questions: [
      {
        id: 1,
        text: 'A company has a batch processing workload that can tolerate interruptions and runs for several hours. Which EC2 purchasing option provides the MOST cost savings?',
        options: [
          { id: 'A', text: 'On-Demand Instances', isCorrect: false },
          { id: 'B', text: 'Reserved Instances', isCorrect: false },
          { id: 'C', text: 'Spot Instances', isCorrect: true },
          { id: 'D', text: 'Dedicated Hosts', isCorrect: false },
        ],
        explanation: 'Spot Instances offer up to 90% discount compared to On-Demand pricing. Since the workload can tolerate interruptions (batch processing), Spot Instances are the most cost-effective choice. The application should be designed to handle instance termination gracefully.',
      },
      {
        id: 2,
        text: 'A company stores log files in S3 that are accessed frequently for the first 30 days, then rarely accessed for 1 year, then can be deleted. Which storage strategy is MOST cost-effective?',
        options: [
          { id: 'A', text: 'Store all logs in S3 Standard permanently', isCorrect: false },
          { id: 'B', text: 'Use S3 Lifecycle policies to transition from Standard to Glacier after 30 days, then expire after 1 year', isCorrect: true },
          { id: 'C', text: 'Store all logs directly in S3 Glacier', isCorrect: false },
          { id: 'D', text: 'Use S3 One Zone-IA for all logs', isCorrect: false },
        ],
        explanation: 'S3 Lifecycle policies automate cost optimization by transitioning objects between storage classes based on age. Standard for frequent access (first 30 days), Glacier for infrequent long-term storage, and automatic deletion after 1 year eliminates unnecessary storage costs.',
      },
      {
        id: 3,
        text: 'A company wants to reduce costs for an application with predictable, steady-state usage that will run for at least 3 years. Which pricing model provides the GREATEST savings?',
        options: [
          { id: 'A', text: 'On-Demand pricing', isCorrect: false },
          { id: 'B', text: 'Savings Plans (3-year commitment)', isCorrect: false },
          { id: 'C', text: 'All Upfront Reserved Instances (3-year term)', isCorrect: true },
          { id: 'D', text: 'Spot Instances', isCorrect: false },
        ],
        explanation: 'All Upfront Reserved Instances with a 3-year term provide the greatest savings (up to 72% vs On-Demand) for predictable, steady-state workloads. The full upfront payment maximizes the discount, and the 3-year term provides additional savings over 1-year.',
      },
      {
        id: 4,
        text: 'A solutions architect needs to identify underutilized EC2 instances to reduce costs. Which AWS tool provides these recommendations?',
        options: [
          { id: 'A', text: 'AWS CloudTrail', isCorrect: false },
          { id: 'B', text: 'AWS Trusted Advisor', isCorrect: false },
          { id: 'C', text: 'AWS Compute Optimizer', isCorrect: true },
          { id: 'D', text: 'Amazon CloudWatch', isCorrect: false },
        ],
        explanation: 'AWS Compute Optimizer analyzes the configuration and utilization metrics of your EC2 instances and provides recommendations for right-sizing. It uses machine learning to identify instances that are over-provisioned or under-provisioned.',
      },
      {
        id: 5,
        text: 'A company is running a development environment that is only used during business hours (8 AM - 6 PM). Which approach would reduce EC2 costs the MOST?',
        options: [
          { id: 'A', text: 'Use Spot Instances for the development environment', isCorrect: false },
          { id: 'B', text: 'Schedule instances to stop after hours using AWS Instance Scheduler', isCorrect: true },
          { id: 'C', text: 'Purchase Reserved Instances for the development environment', isCorrect: false },
          { id: 'D', text: 'Migrate to smaller instance types', isCorrect: false },
        ],
        explanation: 'Using AWS Instance Scheduler (or a similar scheduling solution) to stop instances outside business hours saves approximately 60% on EC2 costs. This is ideal for development environments that do not need to run 24/7.',
      },
    ],
  },
}

export async function generateStaticParams() {
  return [
    { domain: 'secure' },
    { domain: 'resilient' },
    { domain: 'performant' },
    { domain: 'cost' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const { domain } = await params
  const data = domainData[domain]
  if (!data) return { title: 'Not Found' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
    },
  }
}

function QuestionJsonLd({ domain }: { domain: DomainData }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `AWS SAA-C03 ${domain.name} Practice Questions`,
    about: {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Solutions Architect Associate (SAA-C03)',
    },
    educationalLevel: 'Professional',
    hasPart: domain.questions.map((q) => ({
      '@type': 'Question',
      text: q.text,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.options.find((o) => o.isCorrect)?.text,
      },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default async function DomainPracticeQuestionsPage({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const { domain: domainSlug } = await params
  const domain = domainData[domainSlug]
  if (!domain) notFound()

  const Icon = domain.icon

  return (
    <div className="py-12 sm:py-16 px-4">
      <QuestionJsonLd domain={domain} />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link href="/practice-questions" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          All Domains
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${domain.bg}`}>
            <Icon className={`h-5 w-5 ${domain.color}`} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{domain.name}</h1>
            <p className="text-sm text-muted-foreground">{domain.weight} of the SAA-C03 exam</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Practice with these 5 free sample questions. Each includes a detailed explanation to help you learn.
        </p>
      </section>

      {/* Questions */}
      <section className="max-w-3xl mx-auto space-y-6 mb-16">
        {domain.questions.map((question, idx) => (
          <Card key={question.id}>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="shrink-0 text-xs font-mono">
                  Q{idx + 1}
                </Badge>
                <h2 className="text-sm font-medium leading-relaxed">{question.text}</h2>
              </div>

              <div className="space-y-2 ml-0 sm:ml-9">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-start gap-2 p-2.5 rounded-lg text-sm ${
                      option.isCorrect
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    {option.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                    )}
                    <span className={option.isCorrect ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      <strong>{option.id}.</strong> {option.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ml-0 sm:ml-9 bg-primary/5 border border-primary/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-1">Explanation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center space-y-4 bg-muted/30 rounded-xl p-8 border">
        <BookOpen className="h-8 w-8 mx-auto text-primary" />
        <h2 className="text-xl font-bold">Want more {domain.name.toLowerCase()} questions?</h2>
        <p className="text-sm text-muted-foreground">
          Sign up for free to access hundreds more questions in this domain with spaced repetition,
          AI explanations, and progress tracking.
        </p>
        <Link href="/signup">
          <Button className="gap-1 shadow-lg shadow-primary/25">
            Sign Up to Practice More <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
