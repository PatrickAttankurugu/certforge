import type { DomainId } from '@/types/study'

export interface Lab {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
  domainId: DomainId
  relatedTopics: string[]
  awsServices: string[]
  isPremium: boolean
  guideUrl: string
  steps: string[]
}

export const LABS: Lab[] = [
  {
    id: 'vpc-public-private',
    title: 'Setting Up a VPC with Public and Private Subnets',
    description:
      'Build a production-style VPC from scratch with public and private subnets across two availability zones. Configure route tables, internet gateway, and NAT gateway for secure outbound access.',
    difficulty: 'beginner',
    estimatedMinutes: 45,
    domainId: 'secure',
    relatedTopics: ['VPC', 'Subnets', 'Route Tables', 'NAT Gateway', 'Internet Gateway'],
    awsServices: ['Amazon VPC', 'EC2'],
    isPremium: false,
    guideUrl: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html',
    steps: [
      'Create a new VPC with a /16 CIDR block',
      'Create two public subnets in different AZs',
      'Create two private subnets in different AZs',
      'Create and attach an Internet Gateway',
      'Create a NAT Gateway in a public subnet',
      'Configure route tables for public and private subnets',
      'Launch EC2 instances to test connectivity',
    ],
  },
  {
    id: 's3-bucket-policies',
    title: 'Configuring S3 Bucket Policies and Access Controls',
    description:
      'Learn to secure S3 buckets using bucket policies, ACLs, and IAM policies. Implement cross-account access, public read restrictions, and encryption requirements.',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    domainId: 'secure',
    relatedTopics: ['S3', 'IAM', 'Bucket Policies', 'Encryption'],
    awsServices: ['Amazon S3', 'IAM'],
    isPremium: false,
    guideUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html',
    steps: [
      'Create an S3 bucket with default settings',
      'Block all public access using bucket settings',
      'Write a bucket policy that allows read from a specific IAM role',
      'Enable default encryption with SSE-S3',
      'Configure a policy requiring encrypted uploads only',
      'Test access from allowed and denied identities',
    ],
  },
  {
    id: 'auto-scaling-group',
    title: 'Creating Auto Scaling Groups with Launch Templates',
    description:
      'Set up an Auto Scaling group with dynamic scaling policies. Configure health checks, scaling policies based on CPU utilization, and integrate with an Application Load Balancer.',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    domainId: 'resilient',
    relatedTopics: ['Auto Scaling', 'EC2', 'ELB', 'Launch Templates', 'CloudWatch'],
    awsServices: ['EC2 Auto Scaling', 'ELB', 'CloudWatch'],
    isPremium: false,
    guideUrl: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html',
    steps: [
      'Create a Launch Template with a user data script',
      'Create an Application Load Balancer with a target group',
      'Create an Auto Scaling group with min 2, max 6 instances',
      'Configure a target tracking scaling policy for 70% CPU',
      'Set up health checks on the ALB target group',
      'Simulate load to trigger scale-out events',
      'Verify instances are added and removed automatically',
    ],
  },
  {
    id: 'rds-multi-az',
    title: 'Setting Up RDS Multi-AZ Deployment',
    description:
      'Deploy an RDS MySQL instance with Multi-AZ failover. Configure automated backups, read replicas, and test failover scenarios to understand high availability patterns.',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    domainId: 'resilient',
    relatedTopics: ['RDS', 'Multi-AZ', 'Backups', 'Read Replicas', 'High Availability'],
    awsServices: ['Amazon RDS', 'CloudWatch'],
    isPremium: true,
    guideUrl: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
    steps: [
      'Create a DB subnet group across two AZs',
      'Launch an RDS MySQL instance with Multi-AZ enabled',
      'Configure automated backups with a 7-day retention',
      'Create a read replica in a different AZ',
      'Connect to the primary instance and insert test data',
      'Trigger a failover using the Reboot with failover option',
      'Verify the read replica has the latest data',
    ],
  },
  {
    id: 'lambda-api-gateway',
    title: 'Lambda + API Gateway Integration',
    description:
      'Build a serverless REST API using Lambda functions and API Gateway. Implement CRUD operations, configure CORS, add API keys, and set up usage plans.',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    domainId: 'performant',
    relatedTopics: ['Lambda', 'API Gateway', 'Serverless', 'IAM Roles'],
    awsServices: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'IAM'],
    isPremium: true,
    guideUrl: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html',
    steps: [
      'Create a DynamoDB table for storing items',
      'Write a Lambda function for CRUD operations',
      'Create an API Gateway REST API',
      'Configure Lambda proxy integration for each method',
      'Enable CORS on all endpoints',
      'Create an API key and usage plan',
      'Deploy to a stage and test with curl/Postman',
    ],
  },
  {
    id: 'cloudfront-distribution',
    title: 'CloudFront Distribution with S3 Origin',
    description:
      'Set up a CloudFront distribution to serve static content from S3. Configure Origin Access Control, custom error pages, cache behaviors, and geo-restrictions.',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    domainId: 'performant',
    relatedTopics: ['CloudFront', 'S3', 'CDN', 'Caching', 'Edge Locations'],
    awsServices: ['Amazon CloudFront', 'Amazon S3', 'ACM'],
    isPremium: true,
    guideUrl: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html',
    steps: [
      'Create an S3 bucket with static website content',
      'Create a CloudFront distribution with the S3 origin',
      'Configure Origin Access Control (OAC)',
      'Update the S3 bucket policy for CloudFront access',
      'Set up custom error pages for 404 responses',
      'Configure cache behaviors and TTL settings',
      'Test content delivery from edge locations',
    ],
  },
  {
    id: 'cost-explorer-budgets',
    title: 'AWS Cost Explorer and Budgets Setup',
    description:
      'Learn to monitor and control costs using AWS Cost Explorer and Budgets. Create custom cost allocation tags, set up budget alerts, and analyze spending patterns.',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    domainId: 'cost',
    relatedTopics: ['Cost Management', 'Budgets', 'Cost Explorer', 'Tagging'],
    awsServices: ['AWS Cost Explorer', 'AWS Budgets', 'AWS Organizations'],
    isPremium: false,
    guideUrl: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html',
    steps: [
      'Enable Cost Explorer in your AWS account',
      'Create cost allocation tags for your resources',
      'Analyze costs by service, region, and tag',
      'Create a monthly budget with a threshold alert',
      'Set up an SNS notification for budget alerts',
      'Generate a cost and usage report',
    ],
  },
  {
    id: 'spot-instances-savings',
    title: 'Using Spot Instances and Savings Plans',
    description:
      'Deploy workloads on Spot Instances for up to 90% cost savings. Learn to handle interruptions gracefully and combine with On-Demand and Reserved capacity.',
    difficulty: 'advanced',
    estimatedMinutes: 50,
    domainId: 'cost',
    relatedTopics: ['EC2 Pricing', 'Spot Instances', 'Savings Plans', 'Reserved Instances'],
    awsServices: ['Amazon EC2', 'EC2 Auto Scaling', 'CloudWatch'],
    isPremium: true,
    guideUrl: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html',
    steps: [
      'Check Spot Instance pricing history for your instance type',
      'Create a Spot Fleet request with diversified allocation',
      'Configure an Auto Scaling group with mixed instance types',
      'Set up Spot Instance interruption handling with CloudWatch',
      'Compare costs between On-Demand, Reserved, and Spot',
      'Calculate potential savings with a Savings Plan',
    ],
  },
]
