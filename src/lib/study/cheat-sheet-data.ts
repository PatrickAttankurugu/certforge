// ─── AWS Service Comparison Cheat Sheets ───────────────────────

export interface ComparisonRow {
  feature: string
  values: string[]
}

export interface CheatSheet {
  id: string
  title: string
  description: string
  services: string[]
  rows: ComparisonRow[]
  tags: string[]
}

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'storage',
    title: 'S3 vs EBS vs EFS',
    description: 'Object storage vs block storage vs file storage — when to use each.',
    services: ['S3', 'EBS', 'EFS'],
    tags: ['storage', 'resilient', 'cost'],
    rows: [
      { feature: 'Type', values: ['Object storage', 'Block storage', 'File storage (NFS)'] },
      { feature: 'Scope', values: ['Regional (global namespace)', 'Single AZ (by default)', 'Regional (multi-AZ)'] },
      { feature: 'Access', values: ['HTTP/HTTPS API', 'Attached to one EC2 instance', 'Mount on multiple EC2 instances'] },
      { feature: 'Max Size', values: ['Unlimited (5 TB per object)', 'Up to 64 TiB per volume', 'Petabyte scale'] },
      { feature: 'Performance', values: ['High throughput, higher latency', 'Low latency, provisioned IOPS', 'Bursting or provisioned throughput'] },
      { feature: 'Durability', values: ['99.999999999% (11 nines)', 'Replicated within AZ', 'Replicated across AZs'] },
      { feature: 'Cost Model', values: ['Pay per GB stored + requests', 'Pay per provisioned GB', 'Pay per GB stored'] },
      { feature: 'Use Case', values: ['Static assets, backups, data lakes', 'Boot volumes, databases, transactional workloads', 'Shared file systems, CMS, ML training data'] },
      { feature: 'Encryption', values: ['SSE-S3, SSE-KMS, SSE-C, client-side', 'AES-256 (EBS encryption)', 'In-transit and at-rest with KMS'] },
      { feature: 'Lifecycle', values: ['Lifecycle policies to Glacier/IA', 'Snapshots to S3', 'No built-in tiering'] },
    ],
  },
  {
    id: 'database',
    title: 'RDS vs DynamoDB vs Aurora',
    description: 'Relational vs NoSQL vs cloud-native relational — choosing your database.',
    services: ['RDS', 'DynamoDB', 'Aurora'],
    tags: ['database', 'resilient', 'performant'],
    rows: [
      { feature: 'Type', values: ['Managed relational (MySQL, PostgreSQL, etc.)', 'Managed NoSQL (key-value/document)', 'Cloud-native relational (MySQL/PostgreSQL compatible)'] },
      { feature: 'Scaling', values: ['Vertical (instance resize) + read replicas', 'Horizontal (auto-scales throughput)', 'Auto-scaling storage + up to 15 read replicas'] },
      { feature: 'Max Storage', values: ['64 TiB', 'Unlimited', '128 TiB (auto-grows)'] },
      { feature: 'Availability', values: ['Multi-AZ standby', 'Multi-AZ by default, global tables', '6 copies across 3 AZs'] },
      { feature: 'Performance', values: ['Provisioned IOPS for high throughput', 'Single-digit ms latency at any scale', 'Up to 5x MySQL, 3x PostgreSQL throughput'] },
      { feature: 'Cost Model', values: ['Pay per instance hour + storage', 'Pay per RCU/WCU or on-demand', 'Pay per instance hour + I/O + storage'] },
      { feature: 'Schema', values: ['Strict schema (SQL)', 'Schema-less (flexible)', 'Strict schema (SQL)'] },
      { feature: 'Transactions', values: ['Full ACID', 'ACID transactions (limited)', 'Full ACID'] },
      { feature: 'Backup', values: ['Automated backups + snapshots', 'On-demand + PITR', 'Continuous backup to S3'] },
      { feature: 'Best For', values: ['Traditional apps, lift-and-shift', 'High-scale, low-latency, serverless', 'High-performance relational workloads'] },
    ],
  },
  {
    id: 'messaging',
    title: 'SQS vs SNS vs EventBridge',
    description: 'Queue vs pub/sub vs event bus — decoupling patterns.',
    services: ['SQS', 'SNS', 'EventBridge'],
    tags: ['messaging', 'resilient', 'performant'],
    rows: [
      { feature: 'Pattern', values: ['Queue (point-to-point)', 'Pub/Sub (fan-out)', 'Event bus (event-driven)'] },
      { feature: 'Delivery', values: ['Pull-based (consumers poll)', 'Push-based (to subscribers)', 'Push-based (to targets)'] },
      { feature: 'Ordering', values: ['FIFO queues available', 'FIFO topics available', 'Ordered within partition key'] },
      { feature: 'Subscribers', values: ['1 consumer group per queue', 'Up to 12.5M subscribers', 'Up to 5 targets per rule'] },
      { feature: 'Filtering', values: ['No (consumer filters)', 'Message filtering policies', 'Content-based rules (100+ sources)'] },
      { feature: 'Retention', values: ['Up to 14 days', 'No retention (instant delivery)', 'Up to 24 hours replay'] },
      { feature: 'Dead Letter', values: ['DLQ support', 'DLQ via SQS subscription', 'DLQ for failed targets'] },
      { feature: 'Max Message', values: ['256 KB (Extended: 2 GB via S3)', '256 KB', '256 KB'] },
      { feature: 'Cost', values: ['Per request', 'Per publish + delivery', 'Per event ingested'] },
      { feature: 'Best For', values: ['Decoupling, work queues, buffering', 'Fan-out notifications, alerts', 'Event-driven architectures, SaaS integration'] },
    ],
  },
  {
    id: 'compute',
    title: 'Lambda vs ECS vs EKS',
    description: 'Serverless vs containers vs Kubernetes — compute options.',
    services: ['Lambda', 'ECS', 'EKS'],
    tags: ['compute', 'performant', 'cost'],
    rows: [
      { feature: 'Type', values: ['Serverless functions', 'Managed container orchestration', 'Managed Kubernetes'] },
      { feature: 'Scaling', values: ['Auto (0 to 1000+ concurrent)', 'Auto Scaling via service', 'Cluster Autoscaler / Karpenter'] },
      { feature: 'Cold Start', values: ['Yes (ms to seconds)', 'No (tasks always running)', 'No (pods always running)'] },
      { feature: 'Max Runtime', values: ['15 minutes', 'No limit', 'No limit'] },
      { feature: 'Pricing', values: ['Per invocation + duration', 'Per EC2/Fargate resources', 'Cluster fee + EC2/Fargate resources'] },
      { feature: 'Ops Overhead', values: ['Minimal (no servers)', 'Low-medium (AWS manages control plane)', 'Medium-high (K8s expertise needed)'] },
      { feature: 'Portability', values: ['AWS-specific', 'Docker containers (semi-portable)', 'Kubernetes (highly portable)'] },
      { feature: 'Networking', values: ['VPC optional', 'VPC required (awsvpc mode)', 'VPC required'] },
      { feature: 'Storage', values: ['/tmp (10 GB) + EFS', 'EBS, EFS, bind mounts', 'EBS (CSI), EFS, any K8s storage'] },
      { feature: 'Best For', values: ['Event-driven, glue code, APIs', 'Microservices, long-running tasks', 'Complex multi-service apps, hybrid/multi-cloud'] },
    ],
  },
  {
    id: 'cdn',
    title: 'CloudFront vs Global Accelerator',
    description: 'Content delivery vs network acceleration — global performance.',
    services: ['CloudFront', 'Global Accelerator'],
    tags: ['networking', 'performant'],
    rows: [
      { feature: 'Type', values: ['CDN (content delivery network)', 'Network layer accelerator'] },
      { feature: 'Caching', values: ['Yes (edge caching)', 'No caching (proxies TCP/UDP)'] },
      { feature: 'Protocols', values: ['HTTP/HTTPS, WebSocket', 'TCP, UDP'] },
      { feature: 'IP Address', values: ['Dynamic (use CNAME)', 'Static Anycast IPs'] },
      { feature: 'Edge Locations', values: ['400+ PoPs worldwide', 'Uses AWS edge network'] },
      { feature: 'Health Checks', values: ['Origin failover', 'Endpoint health checks + failover'] },
      { feature: 'DDoS', values: ['AWS Shield Standard included', 'AWS Shield Standard included'] },
      { feature: 'Lambda@Edge', values: ['Yes (customize at edge)', 'No'] },
      { feature: 'Cost', values: ['Per request + data transfer', 'Fixed hourly + data transfer premium'] },
      { feature: 'Best For', values: ['Static/dynamic web content, APIs, streaming', 'Non-HTTP apps, gaming, IoT, static IP needs'] },
    ],
  },
  {
    id: 'network-security',
    title: 'Security Groups vs NACLs',
    description: 'Instance-level vs subnet-level network security controls.',
    services: ['Security Groups', 'NACLs'],
    tags: ['security', 'secure', 'networking'],
    rows: [
      { feature: 'Level', values: ['Instance (ENI) level', 'Subnet level'] },
      { feature: 'State', values: ['Stateful (return traffic auto-allowed)', 'Stateless (must allow return traffic)'] },
      { feature: 'Rules', values: ['Allow rules only', 'Allow and Deny rules'] },
      { feature: 'Evaluation', values: ['All rules evaluated together', 'Rules evaluated in order (by number)'] },
      { feature: 'Default', values: ['Deny all inbound, allow all outbound', 'Allow all inbound and outbound'] },
      { feature: 'Association', values: ['Assigned to ENI/instance', 'Applied to all instances in subnet'] },
      { feature: 'Rule Targets', values: ['IP, CIDR, or another security group', 'IP or CIDR only'] },
      { feature: 'Changes', values: ['Applied immediately', 'Applied immediately'] },
      { feature: 'Limit', values: ['Up to 5 per ENI (adjustable)', '1 per subnet'] },
      { feature: 'Best For', values: ['Fine-grained instance access control', 'Subnet-wide deny rules, defense in depth'] },
    ],
  },
]
