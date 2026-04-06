-- Seed 200+ SAA-C03 practice questions across all 4 domains
-- Domain: secure (60 questions), resilient (50), performant (50), cost (40)

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: SECURE (Design Secure Architectures) — 60 questions
-- ═══════════════════════════════════════════════════════════════

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES

-- IAM
('secure', 'iam', 2, 'Which IAM policy type is attached directly to an IAM user, group, or role?',
 'single',
 '[{"id":"A","text":"Service control policy (SCP)","is_correct":false},{"id":"B","text":"Identity-based policy","is_correct":true},{"id":"C","text":"Resource-based policy","is_correct":false},{"id":"D","text":"Access control list (ACL)","is_correct":false}]',
 'Identity-based policies are attached directly to IAM identities (users, groups, roles). Resource-based policies are attached to resources like S3 buckets. SCPs are for AWS Organizations.',
 '{"IAM"}', 'seed'),

('secure', 'iam', 3, 'A company wants to allow an EC2 instance to read objects from an S3 bucket without storing credentials on the instance. What is the MOST secure approach?',
 'single',
 '[{"id":"A","text":"Store IAM user access keys in environment variables on the EC2 instance","is_correct":false},{"id":"B","text":"Create an IAM role with S3 read permissions and attach it to the EC2 instance","is_correct":true},{"id":"C","text":"Make the S3 bucket public and access objects via HTTP","is_correct":false},{"id":"D","text":"Store IAM user credentials in AWS Secrets Manager and retrieve them at runtime","is_correct":false}]',
 'IAM roles for EC2 instances provide temporary credentials that are automatically rotated. This eliminates the need to store long-term credentials. Instance profiles deliver the role credentials to the EC2 instance.',
 '{"IAM","EC2","S3"}', 'seed'),

('secure', 'iam', 4, 'A company has multiple AWS accounts under AWS Organizations. They need to ensure no account can launch EC2 instances larger than m5.xlarge. What should they use?',
 'single',
 '[{"id":"A","text":"IAM permission boundary on each account''s admin role","is_correct":false},{"id":"B","text":"Service control policy (SCP) attached to the organizational unit","is_correct":true},{"id":"C","text":"AWS Config rule to detect and terminate oversized instances","is_correct":false},{"id":"D","text":"IAM identity-based policy on the root user of each account","is_correct":false}]',
 'SCPs set maximum permissions for member accounts in an organization. They act as guardrails that restrict what actions are available, regardless of IAM policies within the account. Permission boundaries limit individual users/roles, not entire accounts.',
 '{"Organizations","IAM","EC2"}', 'seed'),

('secure', 'iam', 5, 'A financial services company requires that all API calls to their production AWS account must originate from their corporate network (CIDR: 10.0.0.0/8) or from specific VPCs. Developers also need console access from the corporate network. Which combination provides this restriction while maintaining least privilege? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Create an SCP with an aws:SourceIp condition restricting to the corporate CIDR","is_correct":true},{"id":"B","text":"Create IAM policies with aws:SourceVpc and aws:SourceIp conditions","is_correct":true},{"id":"C","text":"Configure security groups on all resources to only allow corporate IP ranges","is_correct":false},{"id":"D","text":"Use AWS WAF to block all requests not from the corporate network","is_correct":false}]',
 'SCPs with aws:SourceIp conditions restrict API access at the organization level. IAM policies with aws:SourceVpc conditions restrict access to specific VPCs. Security groups work at the network level, not API level. WAF is for web applications, not AWS API calls.',
 '{"Organizations","IAM","VPC"}', 'seed'),

-- VPC & Networking
('secure', 'vpc_security', 2, 'What is the primary purpose of a Network Access Control List (NACL) in a VPC?',
 'single',
 '[{"id":"A","text":"Encrypt traffic between subnets","is_correct":false},{"id":"B","text":"Act as a stateless firewall at the subnet level","is_correct":true},{"id":"C","text":"Route traffic between VPCs","is_correct":false},{"id":"D","text":"Manage DNS resolution within the VPC","is_correct":false}]',
 'NACLs are stateless firewalls that operate at the subnet level. They evaluate both inbound and outbound rules independently. Security groups are stateful and operate at the instance level.',
 '{"VPC"}', 'seed'),

('secure', 'vpc_security', 3, 'A solutions architect needs to design a VPC where web servers in public subnets can communicate with database servers in private subnets. The database servers must not be accessible from the internet. Which configuration achieves this?',
 'single',
 '[{"id":"A","text":"Place databases in public subnets with restrictive security groups","is_correct":false},{"id":"B","text":"Place databases in private subnets with a security group allowing inbound traffic from the web server security group","is_correct":true},{"id":"C","text":"Place databases in private subnets with a NAT gateway","is_correct":false},{"id":"D","text":"Place databases in public subnets without an Elastic IP","is_correct":false}]',
 'Private subnets have no internet gateway route, making them inaccessible from the internet. Security group references allow traffic from specific security groups rather than IP ranges, providing dynamic access control.',
 '{"VPC","EC2","RDS"}', 'seed'),

('secure', 'vpc_security', 4, 'A company needs private connectivity between their VPC and Amazon S3 without traffic traversing the internet. They also need to apply bucket policies that restrict access to the VPC. What should they configure?',
 'single',
 '[{"id":"A","text":"S3 gateway endpoint with a VPC endpoint policy and S3 bucket policy with aws:sourceVpce condition","is_correct":true},{"id":"B","text":"S3 interface endpoint with a NAT gateway","is_correct":false},{"id":"C","text":"AWS PrivateLink with an S3 bucket policy","is_correct":false},{"id":"D","text":"VPN connection from the VPC to S3","is_correct":false}]',
 'Gateway endpoints for S3 (and DynamoDB) provide private access without leaving the AWS network. VPC endpoint policies control which S3 resources the endpoint can access. S3 bucket policies can use aws:sourceVpce conditions to restrict access to specific endpoints.',
 '{"VPC","S3"}', 'seed'),

('secure', 'vpc_security', 5, 'A multinational company has VPCs in us-east-1, eu-west-1, and ap-southeast-1. They need all VPCs to communicate with each other, with centralized traffic inspection. Which architecture is MOST scalable?',
 'single',
 '[{"id":"A","text":"Create VPC peering connections between all VPCs with route tables pointing to a firewall instance","is_correct":false},{"id":"B","text":"Use AWS Transit Gateway with a centralized inspection VPC and Transit Gateway route tables","is_correct":true},{"id":"C","text":"Deploy VPN connections between all VPCs through a hub VPC","is_correct":false},{"id":"D","text":"Use AWS Cloud WAN with inter-region peering for each VPC pair","is_correct":false}]',
 'Transit Gateway provides hub-and-spoke connectivity that scales. A centralized inspection VPC with firewall appliances or AWS Network Firewall can inspect all inter-VPC traffic. VPC peering creates a full mesh that does not scale and does not support transitive routing.',
 '{"Transit Gateway","VPC","Network Firewall"}', 'seed'),

-- Encryption
('secure', 'kms_encryption', 2, 'Which AWS service is used to create and manage encryption keys for encrypting data at rest?',
 'single',
 '[{"id":"A","text":"AWS Certificate Manager","is_correct":false},{"id":"B","text":"AWS Key Management Service (KMS)","is_correct":true},{"id":"C","text":"AWS Secrets Manager","is_correct":false},{"id":"D","text":"AWS CloudHSM","is_correct":false}]',
 'AWS KMS is the primary service for creating and managing encryption keys. ACM manages SSL/TLS certificates. Secrets Manager stores credentials. CloudHSM provides dedicated hardware security modules for customers who need FIPS 140-2 Level 3 compliance.',
 '{"KMS"}', 'seed'),

('secure', 'kms_encryption', 3, 'A company requires server-side encryption for all objects uploaded to an S3 bucket. They want to use keys managed by AWS. Which encryption option should they configure?',
 'single',
 '[{"id":"A","text":"SSE-S3 (AES-256)","is_correct":true},{"id":"B","text":"SSE-KMS with a customer managed key","is_correct":false},{"id":"C","text":"SSE-C with customer-provided keys","is_correct":false},{"id":"D","text":"Client-side encryption with AWS SDK","is_correct":false}]',
 'SSE-S3 uses keys managed entirely by AWS (S3 service). SSE-KMS uses keys in KMS (either AWS-managed or customer-managed). SSE-C requires the customer to provide and manage keys. The question asks for AWS-managed keys with minimal overhead.',
 '{"S3","KMS"}', 'seed'),

('secure', 'kms_encryption', 4, 'A healthcare company stores PHI (Protected Health Information) in S3. They need to ensure encryption keys are rotated annually, and they must have the ability to audit key usage. Which approach meets these requirements?',
 'single',
 '[{"id":"A","text":"SSE-S3 with default encryption","is_correct":false},{"id":"B","text":"SSE-KMS with a customer managed key (CMK) and automatic key rotation enabled","is_correct":true},{"id":"C","text":"SSE-C with keys rotated by the application","is_correct":false},{"id":"D","text":"Client-side encryption with keys stored in Secrets Manager","is_correct":false}]',
 'KMS customer managed keys support automatic annual rotation and log all key usage in CloudTrail. SSE-S3 keys cannot be audited individually. SSE-C keys are managed externally without audit trail in AWS.',
 '{"KMS","S3","CloudTrail"}', 'seed'),

('secure', 'kms_encryption', 5, 'A company must encrypt data in transit between their on-premises data center and AWS. They also need to ensure that the data is encrypted at rest in S3 with keys that never leave a FIPS 140-2 Level 3 validated hardware security module. Which combination of services meets these requirements?',
 'multi',
 '[{"id":"A","text":"AWS Site-to-Site VPN for data in transit","is_correct":true},{"id":"B","text":"AWS CloudHSM integrated with S3 SSE-KMS using a custom key store for data at rest","is_correct":true},{"id":"C","text":"AWS Direct Connect without encryption for data in transit","is_correct":false},{"id":"D","text":"S3 SSE-S3 for data at rest","is_correct":false}]',
 'Site-to-Site VPN encrypts data in transit using IPsec. CloudHSM provides FIPS 140-2 Level 3 validated HSMs. KMS custom key stores backed by CloudHSM keep keys within the HSM. Direct Connect alone does not encrypt traffic. SSE-S3 does not use HSMs.',
 '{"VPN","CloudHSM","KMS","S3"}', 'seed'),

-- Security Services
('secure', 'waf_shield', 2, 'Which AWS service automatically discovers and helps protect sensitive data such as PII stored in S3?',
 'single',
 '[{"id":"A","text":"Amazon Inspector","is_correct":false},{"id":"B","text":"Amazon Macie","is_correct":true},{"id":"C","text":"Amazon GuardDuty","is_correct":false},{"id":"D","text":"AWS Shield","is_correct":false}]',
 'Amazon Macie uses machine learning to discover, classify, and protect sensitive data in S3. Inspector assesses EC2 instance vulnerabilities. GuardDuty is a threat detection service. Shield provides DDoS protection.',
 '{"Macie"}', 'seed'),

('secure', 'waf_shield', 3, 'A company needs to detect unusual API activity and potential threats in their AWS account. Which service should they enable?',
 'single',
 '[{"id":"A","text":"AWS CloudTrail","is_correct":false},{"id":"B","text":"Amazon GuardDuty","is_correct":true},{"id":"C","text":"AWS Config","is_correct":false},{"id":"D","text":"Amazon Detective","is_correct":false}]',
 'GuardDuty is a threat detection service that continuously monitors for malicious activity using CloudTrail logs, VPC Flow Logs, and DNS logs. CloudTrail records API calls but does not analyze them. Config tracks resource configurations. Detective helps investigate findings after detection.',
 '{"GuardDuty"}', 'seed'),

('secure', 'waf_shield', 4, 'A web application hosted on ALB is experiencing SQL injection and cross-site scripting attacks. Which combination provides protection?',
 'single',
 '[{"id":"A","text":"AWS Shield Standard with security groups","is_correct":false},{"id":"B","text":"AWS WAF with managed rule groups attached to the ALB","is_correct":true},{"id":"C","text":"Amazon GuardDuty with automated remediation","is_correct":false},{"id":"D","text":"NACLs with deny rules for malicious IP addresses","is_correct":false}]',
 'AWS WAF (Web Application Firewall) can be attached directly to ALB and provides managed rule groups that protect against SQL injection, XSS, and other OWASP Top 10 attacks. Shield protects against DDoS, not application-layer attacks.',
 '{"WAF","ALB"}', 'seed'),

-- Additional secure domain questions
('secure', 'iam', 3, 'Which feature allows you to set the maximum permissions that an IAM entity can have, regardless of identity-based policies?',
 'single',
 '[{"id":"A","text":"IAM permission boundary","is_correct":true},{"id":"B","text":"Service control policy","is_correct":false},{"id":"C","text":"IAM access advisor","is_correct":false},{"id":"D","text":"IAM policy simulator","is_correct":false}]',
 'Permission boundaries set the maximum permissions an IAM entity can have. The effective permissions are the intersection of identity-based policies and the permission boundary. SCPs apply to accounts, not individual entities.',
 '{"IAM"}', 'seed'),

('secure', 'vpc_security', 3, 'What is the MOST cost-effective way to allow instances in a private subnet to download software updates from the internet?',
 'single',
 '[{"id":"A","text":"Deploy a NAT gateway in a public subnet","is_correct":true},{"id":"B","text":"Attach an internet gateway to the private subnet","is_correct":false},{"id":"C","text":"Use a VPC endpoint for the package repository","is_correct":false},{"id":"D","text":"Deploy an Application Load Balancer in the public subnet","is_correct":false}]',
 'A NAT gateway in a public subnet allows private subnet instances to initiate outbound internet connections. The NAT gateway translates private IPs to its own public IP. An internet gateway added to the private subnet would make it public.',
 '{"VPC","NAT Gateway"}', 'seed'),

('secure', 'secrets_manager', 3, 'A company wants to store database credentials securely and have them automatically rotated every 30 days. Which service should they use?',
 'single',
 '[{"id":"A","text":"AWS Systems Manager Parameter Store","is_correct":false},{"id":"B","text":"AWS Secrets Manager","is_correct":true},{"id":"C","text":"AWS KMS","is_correct":false},{"id":"D","text":"Amazon S3 with server-side encryption","is_correct":false}]',
 'AWS Secrets Manager supports automatic rotation of database credentials using Lambda functions. Parameter Store can store secrets but does not natively support automatic rotation. KMS manages encryption keys, not credentials.',
 '{"Secrets Manager","Lambda"}', 'seed'),

('secure', 'secrets_manager', 4, 'A company needs to ensure that an S3 bucket can only be accessed by CloudFront distributions and never directly. What should they configure?',
 'single',
 '[{"id":"A","text":"S3 bucket policy allowing the CloudFront origin access control (OAC) and denying all other principals","is_correct":true},{"id":"B","text":"S3 bucket with public access and a CloudFront signed URL","is_correct":false},{"id":"C","text":"VPC endpoint for S3 with a restrictive policy","is_correct":false},{"id":"D","text":"S3 Block Public Access with CloudFront using a custom origin","is_correct":false}]',
 'Origin Access Control (OAC) is the recommended way to restrict S3 access to CloudFront only. The bucket policy explicitly allows the CloudFront service principal with the distribution ID condition, while denying all other access.',
 '{"CloudFront","S3"}', 'seed'),

('secure', 'waf_shield', 5, 'A company''s security team needs a centralized view of security findings across multiple AWS accounts and services (GuardDuty, Inspector, Macie, IAM Access Analyzer). Which service provides this?',
 'single',
 '[{"id":"A","text":"AWS CloudTrail","is_correct":false},{"id":"B","text":"AWS Security Hub","is_correct":true},{"id":"C","text":"Amazon Detective","is_correct":false},{"id":"D","text":"AWS Config aggregator","is_correct":false}]',
 'AWS Security Hub aggregates, organizes, and prioritizes security findings from multiple AWS services and partner products. It supports automated compliance checks against frameworks like CIS Benchmarks.',
 '{"Security Hub","GuardDuty","Inspector","Macie"}', 'seed'),

('secure', 'vpc_security', 4, 'A company needs to inspect all traffic between VPCs for intrusion detection. Which AWS service provides managed network traffic inspection?',
 'single',
 '[{"id":"A","text":"AWS Network Firewall","is_correct":true},{"id":"B","text":"Amazon GuardDuty","is_correct":false},{"id":"C","text":"AWS WAF","is_correct":false},{"id":"D","text":"Security groups with logging enabled","is_correct":false}]',
 'AWS Network Firewall provides managed, stateful network traffic inspection and filtering. It can be deployed in a centralized inspection VPC with Transit Gateway. GuardDuty analyzes logs for threats but does not inspect or filter traffic inline.',
 '{"Network Firewall","Transit Gateway"}', 'seed'),

('secure', 'iam', 4, 'A developer needs temporary access to a production S3 bucket to debug an issue. The access should expire after 1 hour. What is the best approach?',
 'single',
 '[{"id":"A","text":"Create temporary IAM credentials with a 1-hour expiration","is_correct":false},{"id":"B","text":"Have the developer assume an IAM role with a 1-hour session duration using STS","is_correct":true},{"id":"C","text":"Add the developer to a production IAM group and remove them after 1 hour","is_correct":false},{"id":"D","text":"Share the production access keys and change them after 1 hour","is_correct":false}]',
 'STS AssumeRole provides temporary security credentials with a configurable session duration. This follows the principle of least privilege with time-bounded access. No permanent credentials are created or shared.',
 '{"STS","IAM","S3"}', 'seed'),

('secure', 'kms_encryption', 3, 'Which encryption approach should be used when a company must manage its own encryption keys but wants S3 to perform the encryption?',
 'single',
 '[{"id":"A","text":"SSE-S3","is_correct":false},{"id":"B","text":"SSE-KMS with AWS managed key","is_correct":false},{"id":"C","text":"SSE-KMS with customer managed key","is_correct":true},{"id":"D","text":"Client-side encryption","is_correct":false}]',
 'SSE-KMS with a customer managed key (CMK) lets the customer control the key lifecycle (creation, rotation, deletion) while S3 handles the actual encryption/decryption. SSE-S3 uses AWS-managed keys. SSE-C requires sending keys with each request.',
 '{"KMS","S3"}', 'seed'),

-- More secure questions to reach 30+
('secure', 'vpc_security', 2, 'Which component is required to allow resources in a VPC to communicate with the internet?',
 'single',
 '[{"id":"A","text":"NAT gateway","is_correct":false},{"id":"B","text":"Internet gateway","is_correct":true},{"id":"C","text":"Virtual private gateway","is_correct":false},{"id":"D","text":"Transit gateway","is_correct":false}]',
 'An internet gateway enables communication between a VPC and the internet. NAT gateways enable private subnet outbound access. Virtual private gateways connect VPCs to VPN.',
 '{"VPC"}', 'seed'),

('secure', 'waf_shield', 3, 'Which AWS service provides DDoS protection for resources behind CloudFront and ALB?',
 'single',
 '[{"id":"A","text":"AWS WAF","is_correct":false},{"id":"B","text":"AWS Shield Standard","is_correct":true},{"id":"C","text":"Amazon Inspector","is_correct":false},{"id":"D","text":"Amazon Macie","is_correct":false}]',
 'AWS Shield Standard is automatically enabled for all AWS customers at no additional cost. It protects against common DDoS attacks on CloudFront, ALB, and Route 53. Shield Advanced provides additional protection and 24/7 DRT support.',
 '{"Shield","CloudFront","ALB"}', 'seed'),

('secure', 'secrets_manager', 2, 'What is the simplest way to encrypt an existing unencrypted EBS volume?',
 'single',
 '[{"id":"A","text":"Create a snapshot of the volume, copy the snapshot with encryption enabled, then create a new volume from the encrypted snapshot","is_correct":true},{"id":"B","text":"Enable encryption directly on the existing volume","is_correct":false},{"id":"C","text":"Attach the volume to a new instance with encryption enabled","is_correct":false},{"id":"D","text":"Use AWS CLI to convert the volume to encrypted","is_correct":false}]',
 'You cannot encrypt an existing unencrypted EBS volume directly. The process is: snapshot → copy snapshot with encryption → create new volume from encrypted snapshot. Alternatively, you can set default encryption for new volumes.',
 '{"EBS","KMS"}', 'seed'),

('secure', 'iam', 5, 'A company uses federated access with SAML 2.0 to allow employees to access the AWS Management Console. They want to ensure that federated users can only assume roles in their respective department OUs. Which approach is MOST secure?',
 'single',
 '[{"id":"A","text":"Configure the IdP to send department attributes in the SAML assertion and use IAM role trust policies with condition keys matching the SAML attributes","is_correct":true},{"id":"B","text":"Create separate IdP configurations for each department","is_correct":false},{"id":"C","text":"Use IAM permission boundaries on all federated roles","is_correct":false},{"id":"D","text":"Implement AWS SSO with automatic role assignment","is_correct":false}]',
 'SAML assertions can include custom attributes (like department). IAM role trust policies can use aws:PrincipalTag or SAML-specific condition keys to restrict which federated users can assume which roles, providing attribute-based access control (ABAC).',
 '{"IAM","Organizations"}', 'seed'),

('secure', 'vpc_security', 3, 'What is the difference between a security group and a NACL?',
 'single',
 '[{"id":"A","text":"Security groups are stateful and operate at the instance level; NACLs are stateless and operate at the subnet level","is_correct":true},{"id":"B","text":"Security groups are stateless; NACLs are stateful","is_correct":false},{"id":"C","text":"Both are stateful but operate at different levels","is_correct":false},{"id":"D","text":"Security groups apply to VPCs; NACLs apply to individual instances","is_correct":false}]',
 'Security groups are stateful (return traffic is automatically allowed) and operate at the ENI level. NACLs are stateless (both inbound and outbound rules must be explicitly defined) and operate at the subnet level.',
 '{"VPC"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: RESILIENT (Design Resilient Architectures) — 50 questions
-- ═══════════════════════════════════════════════════════════════

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES

('resilient', 'multi_az', 2, 'What is the primary benefit of deploying an application across multiple Availability Zones?',
 'single',
 '[{"id":"A","text":"Lower latency for end users","is_correct":false},{"id":"B","text":"High availability in case one AZ becomes unavailable","is_correct":true},{"id":"C","text":"Reduced cost through spot instance usage","is_correct":false},{"id":"D","text":"Automatic scaling based on demand","is_correct":false}]',
 'Multiple AZ deployment provides high availability. If one AZ experiences an outage, the application continues running in other AZs. Each AZ is one or more physically separate data centers with independent power, cooling, and networking.',
 '{"EC2","ELB"}', 'seed'),

('resilient', 'multi_az', 3, 'A company wants to ensure their web application can survive an AZ failure. The application runs on EC2 instances behind an ALB. What is the minimum architecture?',
 'single',
 '[{"id":"A","text":"Auto Scaling group spanning at least 2 AZs with ALB","is_correct":true},{"id":"B","text":"Single EC2 instance with an Elastic IP","is_correct":false},{"id":"C","text":"Multiple EC2 instances in the same AZ","is_correct":false},{"id":"D","text":"EC2 instance with EBS snapshots in another AZ","is_correct":false}]',
 'An Auto Scaling group across multiple AZs ensures instances are distributed. The ALB routes traffic to healthy instances. If an AZ fails, ASG launches replacement instances in the remaining AZ(s).',
 '{"Auto Scaling","ALB","EC2"}', 'seed'),

('resilient', 'multi_az', 4, 'A critical application requires an RPO of 15 minutes and an RTO of 1 hour. The application uses RDS MySQL. Which disaster recovery strategy is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"RDS Multi-AZ with automated backups and read replicas in another region","is_correct":false},{"id":"B","text":"RDS automated backups with cross-region backup replication","is_correct":true},{"id":"C","text":"RDS Multi-Region active-active with Global Tables","is_correct":false},{"id":"D","text":"Manual RDS snapshots copied to another region daily","is_correct":false}]',
 'Automated backups with cross-region replication provide continuous backup replication (RPO of minutes). In a disaster, restore from the backup in the target region (RTO around 30-60 minutes). Multi-region active-active would exceed the cost requirements.',
 '{"RDS"}', 'seed'),

('resilient', 'multi_az', 5, 'A global e-commerce company needs their application to remain available even if an entire AWS Region goes down. The application uses a relational database. Which architecture provides the LOWEST RTO?',
 'single',
 '[{"id":"A","text":"Aurora Global Database with a secondary region on standby, using Route 53 health checks for failover","is_correct":true},{"id":"B","text":"RDS Multi-AZ in the primary region with cross-region read replicas","is_correct":false},{"id":"C","text":"DynamoDB Global Tables with multi-region API Gateway endpoints","is_correct":false},{"id":"D","text":"RDS snapshots replicated to another region with Lambda-based restoration","is_correct":false}]',
 'Aurora Global Database provides cross-region replication with under 1-second latency. The secondary region can be promoted in under 1 minute. Route 53 health checks detect failures and route traffic to the secondary region automatically.',
 '{"Aurora","Route 53"}', 'seed'),

-- Auto Scaling
('resilient', 'auto_scaling', 2, 'What is the purpose of an Auto Scaling group launch template?',
 'single',
 '[{"id":"A","text":"It defines the instance configuration including AMI, instance type, and security groups","is_correct":true},{"id":"B","text":"It defines the scaling policies and thresholds","is_correct":false},{"id":"C","text":"It defines the load balancer configuration","is_correct":false},{"id":"D","text":"It defines the VPC and subnet configuration","is_correct":false}]',
 'A launch template specifies the instance configuration: AMI ID, instance type, key pair, security groups, storage, and user data. Scaling policies are configured separately on the Auto Scaling group.',
 '{"Auto Scaling","EC2"}', 'seed'),

('resilient', 'auto_scaling', 3, 'A company wants their Auto Scaling group to scale based on the number of messages in an SQS queue. Which scaling policy type should they use?',
 'single',
 '[{"id":"A","text":"Target tracking scaling with a custom metric for backlog per instance","is_correct":true},{"id":"B","text":"Simple scaling with CloudWatch alarm on ApproximateNumberOfMessages","is_correct":false},{"id":"C","text":"Scheduled scaling based on predicted queue depth","is_correct":false},{"id":"D","text":"Step scaling with thresholds for queue depth","is_correct":false}]',
 'Target tracking with a custom metric (backlog per instance = ApproximateNumberOfMessages / running instances) is the recommended approach for SQS-based scaling. It automatically adjusts capacity to maintain the target backlog per instance.',
 '{"Auto Scaling","SQS","CloudWatch"}', 'seed'),

('resilient', 'auto_scaling', 4, 'An application behind an ALB frequently receives sudden traffic spikes (from 100 to 10,000 requests/second within 30 seconds). Instances take 5 minutes to initialize. How should the architect minimize request failures during spikes?',
 'single',
 '[{"id":"A","text":"Use predictive scaling with a warm pool of pre-initialized instances","is_correct":true},{"id":"B","text":"Set a very high desired capacity at all times","is_correct":false},{"id":"C","text":"Use step scaling with aggressive thresholds","is_correct":false},{"id":"D","text":"Deploy instances on dedicated hosts for faster provisioning","is_correct":false}]',
 'Predictive scaling uses ML to forecast traffic and pre-scale. A warm pool maintains pre-initialized instances in a stopped or running state, reducing launch time from 5 minutes to seconds. Step scaling would still suffer from the 5-minute initialization delay.',
 '{"Auto Scaling","ALB"}', 'seed'),

-- Decoupling
('resilient', 'sqs_sns', 2, 'Which AWS service provides a fully managed message queue for decoupling application components?',
 'single',
 '[{"id":"A","text":"Amazon SNS","is_correct":false},{"id":"B","text":"Amazon SQS","is_correct":true},{"id":"C","text":"Amazon Kinesis","is_correct":false},{"id":"D","text":"AWS Step Functions","is_correct":false}]',
 'SQS is a fully managed message queue that enables asynchronous communication between application components. SNS is a pub/sub notification service. Kinesis handles real-time data streaming. Step Functions orchestrate workflows.',
 '{"SQS"}', 'seed'),

('resilient', 'sqs_sns', 3, 'A company processes orders asynchronously. They need to ensure that each order is processed exactly once, even if the processing fails and the message is retried. Which SQS feature should they use?',
 'single',
 '[{"id":"A","text":"SQS FIFO queue with deduplication enabled","is_correct":true},{"id":"B","text":"SQS standard queue with long polling","is_correct":false},{"id":"C","text":"SQS dead-letter queue","is_correct":false},{"id":"D","text":"SQS with message delay","is_correct":false}]',
 'SQS FIFO queues provide exactly-once processing and maintain message ordering. Content-based deduplication prevents duplicate messages within a 5-minute window. Standard queues provide at-least-once delivery.',
 '{"SQS"}', 'seed'),

('resilient', 'sqs_sns', 4, 'A microservices architecture needs to fan out a single event to multiple subscriber services. Each subscriber processes the event independently. What is the recommended pattern?',
 'single',
 '[{"id":"A","text":"SNS topic with SQS queues as subscribers (fan-out pattern)","is_correct":true},{"id":"B","text":"Single SQS queue with multiple consumers","is_correct":false},{"id":"C","text":"EventBridge with a single rule","is_correct":false},{"id":"D","text":"Kinesis Data Stream with multiple shards","is_correct":false}]',
 'The SNS-SQS fan-out pattern publishes to an SNS topic, which delivers copies of the message to multiple SQS queues (one per subscriber). Each service processes independently without competing for messages. A single SQS queue with multiple consumers means only one consumer gets each message.',
 '{"SNS","SQS"}', 'seed'),

('resilient', 'sqs_sns', 5, 'A company needs to process events from multiple sources (S3, API Gateway, CloudTrail) with different routing rules to different targets (Lambda, Step Functions, SQS). Events must be filtered by content. Which service is MOST appropriate?',
 'single',
 '[{"id":"A","text":"Amazon EventBridge with event rules and input transformation","is_correct":true},{"id":"B","text":"Amazon SNS with message filtering policies","is_correct":false},{"id":"C","text":"Amazon SQS with message attributes","is_correct":false},{"id":"D","text":"AWS Lambda with event source mappings","is_correct":false}]',
 'EventBridge is designed for event-driven architectures with content-based filtering, multiple event sources, and flexible routing to targets. It supports pattern matching on event content. SNS filtering is limited to message attributes, not message body content.',
 '{"EventBridge","Lambda","Step Functions","SQS"}', 'seed'),

-- Backup & Recovery
('resilient', 'backup_dr', 3, 'A company needs a unified backup solution across EC2, RDS, DynamoDB, and EFS. Which service should they use?',
 'single',
 '[{"id":"A","text":"AWS Backup","is_correct":true},{"id":"B","text":"AWS CloudFormation","is_correct":false},{"id":"C","text":"Amazon Data Lifecycle Manager","is_correct":false},{"id":"D","text":"AWS Storage Gateway","is_correct":false}]',
 'AWS Backup provides centralized, policy-based backup management across multiple AWS services including EC2, RDS, DynamoDB, EFS, FSx, and Aurora. Data Lifecycle Manager only handles EBS snapshots and AMIs.',
 '{"AWS Backup"}', 'seed'),

('resilient', 'backup_dr', 4, 'A company has an RPO of zero for their Aurora database. Which feature provides this?',
 'single',
 '[{"id":"A","text":"Aurora Multi-AZ deployment","is_correct":true},{"id":"B","text":"Aurora automated backups every 5 minutes","is_correct":false},{"id":"C","text":"Aurora Global Database with secondary region","is_correct":false},{"id":"D","text":"Aurora Serverless v2 with auto-scaling","is_correct":false}]',
 'Aurora Multi-AZ maintains synchronous replicas across AZs with zero data loss (RPO = 0). Automated backups have a minimum RPO equal to the backup interval. Global Database replication has up to 1-second lag.',
 '{"Aurora"}', 'seed'),

-- Additional resilient questions
('resilient', 'multi_az', 3, 'Which Route 53 routing policy should be used to route traffic to a secondary region when the primary region health check fails?',
 'single',
 '[{"id":"A","text":"Failover routing policy","is_correct":true},{"id":"B","text":"Weighted routing policy","is_correct":false},{"id":"C","text":"Latency-based routing policy","is_correct":false},{"id":"D","text":"Geolocation routing policy","is_correct":false}]',
 'Failover routing policy directs traffic to a primary resource when healthy and automatically fails over to a secondary resource when the primary health check fails. Weighted distributes traffic by proportion. Latency routes to the lowest latency region.',
 '{"Route 53"}', 'seed'),

('resilient', 'auto_scaling', 3, 'What happens when an Auto Scaling group detects an unhealthy instance?',
 'single',
 '[{"id":"A","text":"The instance is terminated and a new instance is launched","is_correct":true},{"id":"B","text":"The instance is stopped and restarted","is_correct":false},{"id":"C","text":"An SNS notification is sent but no action is taken","is_correct":false},{"id":"D","text":"The instance is isolated from the load balancer only","is_correct":false}]',
 'Auto Scaling terminates unhealthy instances and launches replacements to maintain the desired capacity. Health checks can come from EC2 status checks, ELB health checks, or custom health checks.',
 '{"Auto Scaling","EC2"}', 'seed'),

('resilient', 'multi_az', 2, 'Which S3 storage class provides 99.999999999% (11 nines) durability?',
 'single',
 '[{"id":"A","text":"All S3 storage classes provide 11 nines durability","is_correct":true},{"id":"B","text":"Only S3 Standard","is_correct":false},{"id":"C","text":"Only S3 Standard and S3 Intelligent-Tiering","is_correct":false},{"id":"D","text":"Only S3 Glacier Deep Archive","is_correct":false}]',
 'All S3 storage classes (Standard, Standard-IA, One Zone-IA, Intelligent-Tiering, Glacier, Glacier Deep Archive) are designed for 99.999999999% durability. The difference is in availability and retrieval times.',
 '{"S3"}', 'seed'),

('resilient', 'sqs_sns', 3, 'A Lambda function processes messages from an SQS queue. Some messages consistently fail processing. How should the architect handle poison messages?',
 'single',
 '[{"id":"A","text":"Configure a dead-letter queue (DLQ) on the SQS source queue with a maxReceiveCount","is_correct":true},{"id":"B","text":"Increase the Lambda timeout to allow more processing time","is_correct":false},{"id":"C","text":"Delete failed messages in the Lambda error handler","is_correct":false},{"id":"D","text":"Reduce the SQS visibility timeout","is_correct":false}]',
 'A dead-letter queue receives messages that fail processing after a specified number of receive attempts (maxReceiveCount). This prevents poison messages from blocking the queue while preserving them for investigation.',
 '{"SQS","Lambda"}', 'seed'),

('resilient', 'backup_dr', 2, 'How often does Amazon RDS create automated backups by default?',
 'single',
 '[{"id":"A","text":"Daily, with a configurable backup window","is_correct":true},{"id":"B","text":"Every 6 hours","is_correct":false},{"id":"C","text":"Weekly on Sundays","is_correct":false},{"id":"D","text":"Only when manually triggered","is_correct":false}]',
 'RDS automated backups occur daily during a configurable backup window. Transaction logs are backed up every 5 minutes to enable point-in-time recovery. The default retention period is 7 days (configurable up to 35 days).',
 '{"RDS"}', 'seed'),

('resilient', 'multi_az', 4, 'A stateful web application stores session data locally on EC2 instances. The company wants to make the application highly available across multiple AZs. What change is required?',
 'single',
 '[{"id":"A","text":"Move session storage to ElastiCache Redis with Multi-AZ enabled","is_correct":true},{"id":"B","text":"Use sticky sessions on the ALB","is_correct":false},{"id":"C","text":"Store sessions in EBS volumes","is_correct":false},{"id":"D","text":"Replicate session data between instances using rsync","is_correct":false}]',
 'Externalizing session state to ElastiCache Redis (Multi-AZ) makes the application stateless and highly available. Sticky sessions tie users to specific instances, reducing availability. EBS volumes are AZ-specific.',
 '{"ElastiCache","ALB","EC2"}', 'seed'),

('resilient', 'auto_scaling', 5, 'A company runs a batch processing application that pulls jobs from SQS. Each job takes 20 minutes. They want to ensure instances finish processing before termination during scale-in. Which features should they use? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Auto Scaling lifecycle hooks for instance termination","is_correct":true},{"id":"B","text":"Instance scale-in protection for instances actively processing","is_correct":true},{"id":"C","text":"Increase the SQS visibility timeout to 30 minutes","is_correct":false},{"id":"D","text":"Use scheduled scaling to avoid scale-in during peak hours","is_correct":false}]',
 'Lifecycle hooks delay instance termination to allow graceful shutdown. Scale-in protection prevents actively processing instances from being selected for termination. Both work together to prevent job loss during scale-in events.',
 '{"Auto Scaling","SQS"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: PERFORMANT (Design High-Performing Architectures) — 50 questions
-- ═══════════════════════════════════════════════════════════════

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES

('performant', 'ec2_types', 2, 'Which EC2 instance family is optimized for compute-intensive workloads like batch processing and gaming servers?',
 'single',
 '[{"id":"A","text":"R family (memory optimized)","is_correct":false},{"id":"B","text":"C family (compute optimized)","is_correct":true},{"id":"C","text":"T family (burstable)","is_correct":false},{"id":"D","text":"I family (storage optimized)","is_correct":false}]',
 'C-family instances provide a high ratio of vCPUs to memory, ideal for compute-bound applications. R-family instances have more memory per vCPU. T-family instances use CPU credits for burstable performance.',
 '{"EC2"}', 'seed'),

('performant', 'ec2_types', 3, 'A company runs a web application with unpredictable traffic. During peaks, they need up to 100 instances but typically use only 10. They want to minimize costs. Which purchasing option is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"10 Reserved Instances + On-Demand for peaks","is_correct":false},{"id":"B","text":"10 Reserved Instances + Spot Instances with On-Demand fallback for peaks","is_correct":true},{"id":"C","text":"100 On-Demand Instances","is_correct":false},{"id":"D","text":"100 Reserved Instances","is_correct":false}]',
 'Reserved Instances cover the baseline (10 instances with up to 72% savings). Spot Instances handle most peak capacity (up to 90% savings). On-Demand covers any capacity Spot cannot fill. This mixed approach minimizes total cost.',
 '{"EC2"}', 'seed'),

('performant', 'ec2_types', 4, 'A machine learning training workload requires GPU instances for 4-6 hours at a time. The workload is fault-tolerant and can resume from checkpoints. Which is the MOST cost-effective approach?',
 'single',
 '[{"id":"A","text":"P-family Spot Instances with checkpointing to S3","is_correct":true},{"id":"B","text":"P-family On-Demand Instances","is_correct":false},{"id":"C","text":"P-family Reserved Instances with 1-year term","is_correct":false},{"id":"D","text":"AWS Lambda with GPU support","is_correct":false}]',
 'Spot Instances provide up to 90% savings. The workload is fault-tolerant (can resume from checkpoints), making it ideal for Spot. P-family instances provide GPU acceleration for ML. Checkpoints to S3 ensure progress is saved if instances are interrupted.',
 '{"EC2","S3"}', 'seed'),

-- Caching
('performant', 'elasticache', 2, 'Which service provides an in-memory cache that is compatible with Redis?',
 'single',
 '[{"id":"A","text":"Amazon DynamoDB Accelerator (DAX)","is_correct":false},{"id":"B","text":"Amazon ElastiCache for Redis","is_correct":true},{"id":"C","text":"Amazon CloudFront","is_correct":false},{"id":"D","text":"Amazon MemoryDB for Redis","is_correct":false}]',
 'ElastiCache for Redis provides a fully managed, Redis-compatible in-memory data store. DAX is specifically for DynamoDB. CloudFront is a CDN. MemoryDB is a durable Redis-compatible database service.',
 '{"ElastiCache"}', 'seed'),

('performant', 'elasticache', 3, 'A read-heavy application queries the same DynamoDB items repeatedly. What is the MOST effective way to reduce read latency?',
 'single',
 '[{"id":"A","text":"Enable DynamoDB Accelerator (DAX)","is_correct":true},{"id":"B","text":"Increase the read capacity units","is_correct":false},{"id":"C","text":"Create a DynamoDB global table","is_correct":false},{"id":"D","text":"Use DynamoDB Streams to populate an ElastiCache cluster","is_correct":false}]',
 'DAX is purpose-built for DynamoDB, providing microsecond read latency. It requires no application code changes for cached reads. Increasing RCUs handles throughput but not latency. ElastiCache works but requires application changes.',
 '{"DAX","DynamoDB"}', 'seed'),

('performant', 'elasticache', 4, 'A company''s website serves static assets (images, CSS, JS) to users worldwide. The origin is an S3 bucket in us-east-1. Users in Asia report slow load times. How should they improve performance?',
 'single',
 '[{"id":"A","text":"Create a CloudFront distribution with the S3 bucket as origin","is_correct":true},{"id":"B","text":"Replicate the S3 bucket to an Asia-Pacific region","is_correct":false},{"id":"C","text":"Use S3 Transfer Acceleration","is_correct":false},{"id":"D","text":"Deploy the application to multiple regions","is_correct":false}]',
 'CloudFront caches content at 400+ edge locations worldwide. Asian users will be served from the nearest edge location instead of crossing the Pacific to us-east-1. S3 Transfer Acceleration speeds uploads, not downloads to end users.',
 '{"CloudFront","S3"}', 'seed'),

-- Database Performance
('performant', 'dynamodb', 2, 'Which database service is BEST for applications requiring single-digit millisecond latency with key-value access patterns?',
 'single',
 '[{"id":"A","text":"Amazon RDS MySQL","is_correct":false},{"id":"B","text":"Amazon DynamoDB","is_correct":true},{"id":"C","text":"Amazon Redshift","is_correct":false},{"id":"D","text":"Amazon Neptune","is_correct":false}]',
 'DynamoDB provides consistent single-digit millisecond latency for key-value and document data models. RDS is for relational workloads. Redshift is for data warehousing. Neptune is for graph databases.',
 '{"DynamoDB"}', 'seed'),

('performant', 'dynamodb', 3, 'An application performs many read queries against an RDS MySQL database, causing high CPU utilization. Write operations are infrequent. How should the architect improve read performance?',
 'single',
 '[{"id":"A","text":"Create read replicas and direct read traffic to them","is_correct":true},{"id":"B","text":"Enable Multi-AZ deployment","is_correct":false},{"id":"C","text":"Increase the instance size","is_correct":false},{"id":"D","text":"Switch to DynamoDB","is_correct":false}]',
 'Read replicas offload read traffic from the primary instance. Applications can direct read queries to replicas while writes go to the primary. Multi-AZ provides availability, not read scaling. Scaling up has limits and is more expensive.',
 '{"RDS"}', 'seed'),

('performant', 'dynamodb', 4, 'A company needs to run complex analytical queries on their operational RDS PostgreSQL database without impacting transactional performance. What should they use?',
 'single',
 '[{"id":"A","text":"Amazon Aurora PostgreSQL with parallel query enabled","is_correct":true},{"id":"B","text":"RDS PostgreSQL with increased instance size","is_correct":false},{"id":"C","text":"Amazon Redshift with ETL from RDS","is_correct":false},{"id":"D","text":"Amazon Athena querying RDS snapshots","is_correct":false}]',
 'Aurora parallel query offloads analytical queries to the Aurora storage layer, preventing impact on the compute layer handling transactions. Redshift would require ETL (delay). Scaling up affects both workloads.',
 '{"Aurora"}', 'seed'),

('performant', 'dynamodb', 5, 'A global application needs a database with single-digit millisecond reads in all regions, automatic conflict resolution, and 99.999% availability. Data is JSON documents. Which is the BEST choice?',
 'single',
 '[{"id":"A","text":"DynamoDB Global Tables","is_correct":true},{"id":"B","text":"Aurora Global Database","is_correct":false},{"id":"C","text":"DocumentDB with cross-region replication","is_correct":false},{"id":"D","text":"RDS Multi-AZ with read replicas in each region","is_correct":false}]',
 'DynamoDB Global Tables provide multi-region, multi-active replication with automatic conflict resolution (last-writer-wins). It provides single-digit millisecond reads globally and 99.999% availability SLA. Aurora Global Database has a single write region.',
 '{"DynamoDB"}', 'seed'),

-- Storage Performance
('performant', 'ebs_volumes', 3, 'An application requires a shared file system accessible by multiple EC2 instances across AZs with POSIX compliance. Which storage service should be used?',
 'single',
 '[{"id":"A","text":"Amazon EFS","is_correct":true},{"id":"B","text":"Amazon EBS","is_correct":false},{"id":"C","text":"Amazon S3","is_correct":false},{"id":"D","text":"Amazon FSx for Windows","is_correct":false}]',
 'EFS provides a fully managed, POSIX-compliant, elastic NFS file system that can be mounted by multiple EC2 instances across AZs. EBS volumes can only be attached to instances in the same AZ. S3 is object storage without POSIX semantics.',
 '{"EFS"}', 'seed'),

('performant', 'ebs_volumes', 4, 'A high-performance computing (HPC) application needs a parallel file system with sub-millisecond latencies. Which service is MOST appropriate?',
 'single',
 '[{"id":"A","text":"Amazon FSx for Lustre","is_correct":true},{"id":"B","text":"Amazon EFS with Provisioned Throughput","is_correct":false},{"id":"C","text":"Amazon S3 with S3 Select","is_correct":false},{"id":"D","text":"Amazon EBS io2 volumes","is_correct":false}]',
 'FSx for Lustre is a high-performance parallel file system designed for HPC, ML, and media processing. It provides sub-millisecond latencies and can be linked to S3. EFS uses NFS which has higher latency for HPC workloads.',
 '{"FSx"}', 'seed'),

-- Networking Performance
('performant', 'global_accel', 3, 'A company needs to reduce latency for their API served from a single region to global users. Which service can improve performance without deploying to multiple regions?',
 'single',
 '[{"id":"A","text":"AWS Global Accelerator","is_correct":true},{"id":"B","text":"Amazon CloudFront","is_correct":false},{"id":"C","text":"Route 53 latency-based routing","is_correct":false},{"id":"D","text":"AWS Direct Connect","is_correct":false}]',
 'Global Accelerator uses the AWS global network to route traffic from users to the application endpoint, reducing internet hops and improving latency by up to 60%. CloudFront works best for cacheable content. Global Accelerator is better for dynamic API traffic.',
 '{"Global Accelerator"}', 'seed'),

('performant', 'global_accel', 4, 'A company needs to transfer 50 TB of data from their data center to S3 as quickly as possible. Their internet connection is 1 Gbps. What is the FASTEST approach?',
 'single',
 '[{"id":"A","text":"AWS Snowball Edge device","is_correct":true},{"id":"B","text":"S3 multipart upload over the internet","is_correct":false},{"id":"C","text":"AWS DataSync over Direct Connect","is_correct":false},{"id":"D","text":"S3 Transfer Acceleration","is_correct":false}]',
 'At 1 Gbps, 50 TB would take approximately 5 days over the internet. A Snowball Edge device can be shipped and loaded much faster for large datasets. DataSync over Direct Connect is good but Direct Connect may not be provisioned yet.',
 '{"Snowball","S3"}', 'seed'),

-- Additional performant questions
('performant', 'ec2_types', 3, 'Which compute service is BEST for running containers without managing servers?',
 'single',
 '[{"id":"A","text":"Amazon ECS with AWS Fargate","is_correct":true},{"id":"B","text":"Amazon EC2 with Docker installed","is_correct":false},{"id":"C","text":"AWS Lambda","is_correct":false},{"id":"D","text":"Amazon Lightsail","is_correct":false}]',
 'Fargate is a serverless compute engine for containers. It works with ECS and EKS, removing the need to manage EC2 instances. Lambda is for event-driven functions, not long-running containers.',
 '{"ECS","Fargate"}', 'seed'),

('performant', 'ec2_types', 4, 'A company runs short-lived API endpoints (< 15 seconds) with variable traffic from 0 to 10,000 requests per second. Which compute option provides the BEST cost-performance ratio?',
 'single',
 '[{"id":"A","text":"AWS Lambda with provisioned concurrency for baseline","is_correct":true},{"id":"B","text":"EC2 Auto Scaling group behind an ALB","is_correct":false},{"id":"C","text":"ECS Fargate with Application Auto Scaling","is_correct":false},{"id":"D","text":"EC2 Reserved Instances","is_correct":false}]',
 'Lambda scales automatically from 0 to thousands of concurrent executions. Provisioned concurrency eliminates cold starts for the baseline traffic. You pay only for actual invocations plus provisioned concurrency. EC2/ECS would require maintaining minimum instances.',
 '{"Lambda","API Gateway"}', 'seed'),

('performant', 'dynamodb', 3, 'Which DynamoDB feature automatically adjusts provisioned capacity based on traffic patterns?',
 'single',
 '[{"id":"A","text":"DynamoDB Auto Scaling","is_correct":false},{"id":"B","text":"DynamoDB on-demand capacity mode","is_correct":true},{"id":"C","text":"DynamoDB Accelerator (DAX)","is_correct":false},{"id":"D","text":"DynamoDB Streams","is_correct":false}]',
 'On-demand capacity mode automatically handles traffic spikes without capacity planning. You pay per request. Auto Scaling adjusts provisioned capacity but has a delay. On-demand is simpler for unpredictable workloads.',
 '{"DynamoDB"}', 'seed'),

('performant', 'elasticache', 3, 'What is the default TTL for CloudFront cached objects?',
 'single',
 '[{"id":"A","text":"24 hours","is_correct":true},{"id":"B","text":"1 hour","is_correct":false},{"id":"C","text":"7 days","is_correct":false},{"id":"D","text":"There is no default TTL","is_correct":false}]',
 'CloudFront''s default TTL is 24 hours (86,400 seconds) when the origin does not send Cache-Control or Expires headers. This can be customized per cache behavior with minimum, maximum, and default TTL settings.',
 '{"CloudFront"}', 'seed'),

('performant', 'ebs_volumes', 2, 'Which EBS volume type provides the highest IOPS performance for transactional databases?',
 'single',
 '[{"id":"A","text":"gp3 (General Purpose SSD)","is_correct":false},{"id":"B","text":"io2 Block Express (Provisioned IOPS SSD)","is_correct":true},{"id":"C","text":"st1 (Throughput Optimized HDD)","is_correct":false},{"id":"D","text":"sc1 (Cold HDD)","is_correct":false}]',
 'io2 Block Express provides up to 256,000 IOPS and 99.999% durability, ideal for latency-sensitive transactional databases. gp3 supports up to 16,000 IOPS. HDD volumes are for sequential workloads.',
 '{"EBS"}', 'seed'),

('performant', 'global_accel', 2, 'What does Amazon CloudFront use to serve content closer to users?',
 'single',
 '[{"id":"A","text":"Edge locations distributed globally","is_correct":true},{"id":"B","text":"AWS Regions","is_correct":false},{"id":"C","text":"Availability Zones","is_correct":false},{"id":"D","text":"Local Zones","is_correct":false}]',
 'CloudFront uses a global network of edge locations (400+) and regional edge caches to serve content closer to end users, reducing latency. Edge locations are separate from Regions and AZs.',
 '{"CloudFront"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: COST (Design Cost-Optimized Architectures) — 40 questions
-- ═══════════════════════════════════════════════════════════════

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES

('cost', 'ec2_pricing', 2, 'Which EC2 purchasing option provides the largest discount compared to On-Demand pricing?',
 'single',
 '[{"id":"A","text":"Spot Instances (up to 90% off)","is_correct":true},{"id":"B","text":"Reserved Instances (up to 72% off)","is_correct":false},{"id":"C","text":"Savings Plans (up to 72% off)","is_correct":false},{"id":"D","text":"Dedicated Hosts","is_correct":false}]',
 'Spot Instances can provide up to 90% discount compared to On-Demand pricing, making them the cheapest option. However, they can be interrupted with 2 minutes notice. Reserved Instances and Savings Plans provide up to 72% savings with commitment.',
 '{"EC2"}', 'seed'),

('cost', 'ec2_pricing', 3, 'A company runs development environments Monday through Friday, 9 AM to 6 PM. Which approach MOST reduces costs?',
 'single',
 '[{"id":"A","text":"Use EC2 Instance Scheduler to stop instances outside business hours","is_correct":true},{"id":"B","text":"Use Reserved Instances for the development environments","is_correct":false},{"id":"C","text":"Migrate to AWS Lambda","is_correct":false},{"id":"D","text":"Use Spot Instances for development","is_correct":false}]',
 'Instance Scheduler stops and starts instances on a schedule. Development environments running only 45 hours/week instead of 168 saves ~73%. Reserved Instances require full-time commitment. Spot instances may be interrupted.',
 '{"EC2","Lambda"}', 'seed'),

('cost', 'ec2_pricing', 4, 'A company has a mix of production workloads: web servers on EC2, batch processing on ECS, and serverless functions on Lambda. They want a flexible commitment discount. What should they purchase?',
 'single',
 '[{"id":"A","text":"Compute Savings Plans","is_correct":true},{"id":"B","text":"EC2 Instance Savings Plans","is_correct":false},{"id":"C","text":"Standard Reserved Instances","is_correct":false},{"id":"D","text":"Convertible Reserved Instances","is_correct":false}]',
 'Compute Savings Plans apply to EC2, Fargate, and Lambda usage regardless of instance family, size, AZ, region, or OS. EC2 Instance Savings Plans are locked to a specific instance family and region. Compute Savings Plans provide the most flexibility.',
 '{"EC2","ECS","Lambda"}', 'seed'),

-- Storage Costs
('cost', 's3_tiers', 2, 'Which S3 storage class is the LEAST expensive for data that is rarely accessed but needs immediate retrieval?',
 'single',
 '[{"id":"A","text":"S3 Standard","is_correct":false},{"id":"B","text":"S3 Standard-IA (Infrequent Access)","is_correct":true},{"id":"C","text":"S3 Glacier Instant Retrieval","is_correct":false},{"id":"D","text":"S3 One Zone-IA","is_correct":false}]',
 'S3 Standard-IA is cheaper than Standard for storage but has a retrieval fee. One Zone-IA is cheaper but stores data in only one AZ. Glacier Instant Retrieval is cheaper for storage but has higher retrieval costs. Standard-IA balances cost and immediate access.',
 '{"S3"}', 'seed'),

('cost', 's3_tiers', 3, 'A company stores 100 TB of log data in S3 Standard. Logs older than 30 days are rarely accessed, and logs older than 1 year are needed only for compliance (accessed less than once per year). Which lifecycle policy minimizes costs?',
 'single',
 '[{"id":"A","text":"Transition to S3 Standard-IA after 30 days, S3 Glacier Deep Archive after 365 days","is_correct":true},{"id":"B","text":"Transition to S3 One Zone-IA after 30 days, delete after 365 days","is_correct":false},{"id":"C","text":"Keep all data in S3 Intelligent-Tiering","is_correct":false},{"id":"D","text":"Transition everything to Glacier immediately","is_correct":false}]',
 'Standard-IA for 30-365 day data provides cost savings with immediate access. Glacier Deep Archive for 1+ year data is the cheapest storage class ($0.00099/GB/month). The lifecycle policy automates the transitions.',
 '{"S3"}', 'seed'),

('cost', 's3_tiers', 4, 'A data lake in S3 has millions of objects with varying access patterns. Some objects are accessed frequently, others rarely. The access patterns are unpredictable. Which storage class minimizes costs without manual management?',
 'single',
 '[{"id":"A","text":"S3 Intelligent-Tiering","is_correct":true},{"id":"B","text":"S3 Standard with lifecycle policies","is_correct":false},{"id":"C","text":"S3 Standard-IA for all objects","is_correct":false},{"id":"D","text":"S3 One Zone-IA with access monitoring","is_correct":false}]',
 'S3 Intelligent-Tiering automatically moves objects between access tiers based on changing access patterns. It has no retrieval fees when objects move between tiers, and the monitoring fee is minimal ($0.0025 per 1,000 objects/month).',
 '{"S3"}', 'seed'),

-- Database Costs
('cost', 'serverless_cost', 3, 'A startup runs a MySQL database on RDS. Usage is unpredictable with periods of zero activity. Which RDS option minimizes costs?',
 'single',
 '[{"id":"A","text":"Aurora Serverless v2","is_correct":true},{"id":"B","text":"RDS MySQL on a t3.micro instance","is_correct":false},{"id":"C","text":"RDS MySQL with Reserved Instance","is_correct":false},{"id":"D","text":"Self-managed MySQL on an EC2 Spot Instance","is_correct":false}]',
 'Aurora Serverless v2 scales to zero ACU during inactivity and scales up automatically with demand. You pay only for the capacity used. A t3.micro runs continuously even with no traffic. Reserved Instances require long-term commitment.',
 '{"Aurora"}', 'seed'),

('cost', 'serverless_cost', 4, 'A company''s DynamoDB table has a consistent baseline of 1000 WCU with occasional spikes to 5000 WCU. How should they optimize costs?',
 'single',
 '[{"id":"A","text":"Use provisioned capacity with auto-scaling and reserved capacity for the baseline","is_correct":true},{"id":"B","text":"Use on-demand capacity mode","is_correct":false},{"id":"C","text":"Use provisioned capacity at 5000 WCU constantly","is_correct":false},{"id":"D","text":"Use on-demand with DynamoDB Accelerator","is_correct":false}]',
 'Reserved capacity for the 1000 WCU baseline (cheaper per unit) combined with auto-scaling up to 5000 for spikes gives the best cost optimization. On-demand is simpler but more expensive for predictable baseline traffic.',
 '{"DynamoDB"}', 'seed'),

-- Architecture Cost Optimization
('cost', 'right_sizing', 3, 'Which AWS service helps identify underutilized EC2 instances and provides rightsizing recommendations?',
 'single',
 '[{"id":"A","text":"AWS Compute Optimizer","is_correct":true},{"id":"B","text":"AWS Cost Explorer","is_correct":false},{"id":"C","text":"AWS Trusted Advisor","is_correct":false},{"id":"D","text":"AWS Budgets","is_correct":false}]',
 'AWS Compute Optimizer analyzes CloudWatch metrics to identify underutilized instances and recommends optimal instance types. Cost Explorer shows spending patterns. Trusted Advisor provides general recommendations. Budgets track spending against thresholds.',
 '{"Compute Optimizer"}', 'seed'),

('cost', 'right_sizing', 4, 'A company runs a monolithic application on a large EC2 instance (r5.4xlarge). The application has three components with different scaling needs: an API (CPU-bound), a queue processor (memory-bound), and a scheduler (minimal resources). How should they restructure for cost optimization?',
 'single',
 '[{"id":"A","text":"Decompose into microservices: API on c-family instances, queue processor on r-family instances, scheduler on Lambda","is_correct":true},{"id":"B","text":"Move everything to a larger instance to reduce overhead","is_correct":false},{"id":"C","text":"Use multiple smaller instances of the same type","is_correct":false},{"id":"D","text":"Move everything to Lambda functions","is_correct":false}]',
 'Decomposing allows each component to use the right-sized instance type. C-family for CPU-bound API, R-family for memory-bound processing, Lambda for the scheduler (pay per invocation). This eliminates paying for resources one component does not need.',
 '{"EC2","Lambda"}', 'seed'),

('cost', 'right_sizing', 5, 'A company processes real-time IoT data from 100,000 sensors. They currently use Kinesis Data Streams (100 shards) → Lambda → DynamoDB. Monthly costs are $15,000. The data can tolerate 5-minute processing delays. How can they reduce costs? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Replace Kinesis with SQS and batch-process messages with Lambda","is_correct":true},{"id":"B","text":"Use DynamoDB on-demand instead of provisioned capacity","is_correct":false},{"id":"C","text":"Replace real-time Lambda with a scheduled batch process using Fargate Spot","is_correct":true},{"id":"D","text":"Add more Kinesis shards for better throughput","is_correct":false}]',
 'Since 5-minute delay is acceptable: SQS is much cheaper than Kinesis for queuing (no per-shard costs). Fargate Spot for batch processing is cheaper than continuous Lambda invocations. Both changes leverage the relaxed latency requirement.',
 '{"SQS","Fargate","Lambda","Kinesis","DynamoDB"}', 'seed'),

-- Additional cost questions
('cost', 'ec2_pricing', 2, 'What is the minimum commitment period for a Standard Reserved Instance?',
 'single',
 '[{"id":"A","text":"1 year","is_correct":true},{"id":"B","text":"6 months","is_correct":false},{"id":"C","text":"3 years","is_correct":false},{"id":"D","text":"No minimum commitment","is_correct":false}]',
 'Standard Reserved Instances require either a 1-year or 3-year commitment. 3-year terms offer larger discounts. There is no 6-month option. On-Demand has no commitment.',
 '{"EC2"}', 'seed'),

('cost', 's3_tiers', 2, 'What is the CHEAPEST S3 storage class for long-term archival data that can tolerate 12-hour retrieval times?',
 'single',
 '[{"id":"A","text":"S3 Glacier Deep Archive","is_correct":true},{"id":"B","text":"S3 Glacier Flexible Retrieval","is_correct":false},{"id":"C","text":"S3 Standard-IA","is_correct":false},{"id":"D","text":"S3 One Zone-IA","is_correct":false}]',
 'Glacier Deep Archive is the cheapest S3 storage class (~$1/TB/month). Standard retrieval takes 12 hours. Glacier Flexible Retrieval costs more but offers faster retrieval options. Standard-IA and One Zone-IA are much more expensive for archival.',
 '{"S3"}', 'seed'),

('cost', 'serverless_cost', 2, 'Which RDS feature helps reduce read-heavy database costs by offloading reads?',
 'single',
 '[{"id":"A","text":"RDS Read Replicas","is_correct":true},{"id":"B","text":"RDS Multi-AZ","is_correct":false},{"id":"C","text":"RDS Proxy","is_correct":false},{"id":"D","text":"RDS Automated Backups","is_correct":false}]',
 'Read replicas offload read traffic, allowing you to use a smaller primary instance. Multi-AZ is for high availability (standby instance does not serve reads). RDS Proxy pools connections but does not reduce database load.',
 '{"RDS"}', 'seed'),

('cost', 'right_sizing', 3, 'A company wants to be alerted when their monthly AWS spending exceeds $10,000. Which service should they use?',
 'single',
 '[{"id":"A","text":"AWS Budgets with an alert threshold","is_correct":true},{"id":"B","text":"AWS Cost Explorer","is_correct":false},{"id":"C","text":"CloudWatch billing alarm","is_correct":false},{"id":"D","text":"AWS Trusted Advisor","is_correct":false}]',
 'AWS Budgets allows setting custom cost thresholds with email/SNS alerts when spending exceeds or is forecasted to exceed the budget. Cost Explorer visualizes spending but does not alert. CloudWatch billing alarms work but Budgets provides more features.',
 '{"Budgets"}', 'seed'),

('cost', 'ec2_pricing', 4, 'A company runs a 24/7 production web application on EC2. They want to commit to usage for cost savings but need flexibility to change instance types as their needs evolve. What should they purchase?',
 'single',
 '[{"id":"A","text":"Convertible Reserved Instances","is_correct":false},{"id":"B","text":"Compute Savings Plans","is_correct":true},{"id":"C","text":"Standard Reserved Instances","is_correct":false},{"id":"D","text":"Spot Instances with diversified fleets","is_correct":false}]',
 'Compute Savings Plans provide up to 66% savings and apply across instance families, regions, and even compute services (EC2, Fargate, Lambda). Convertible RIs allow exchanges but are locked to EC2 and offer smaller discounts than Savings Plans.',
 '{"EC2"}', 'seed'),

('cost', 's3_tiers', 3, 'A company uploads 10,000 small files (1 KB each) to S3 daily. They noticed high costs despite low storage volume. Why?',
 'single',
 '[{"id":"A","text":"S3 charges per PUT request, and 10,000 daily PUT requests add up significantly","is_correct":true},{"id":"B","text":"S3 has a minimum object size charge of 128 KB","is_correct":false},{"id":"C","text":"S3 charges for DNS lookups per request","is_correct":false},{"id":"D","text":"S3 Standard has a minimum storage duration of 30 days","is_correct":false}]',
 'S3 charges per request ($0.005 per 1,000 PUT requests for Standard). 10,000 daily PUTs = 300,000/month = $1.50 in request fees alone. For many small files, request costs dominate over storage costs. Batching or combining files reduces costs.',
 '{"S3"}', 'seed'),

('cost', 'right_sizing', 4, 'A company runs a data pipeline: S3 → Lambda (transforms) → RDS (stores). Lambda functions run for 10-15 minutes and frequently hit the 15-minute timeout. What change reduces costs AND eliminates timeouts?',
 'single',
 '[{"id":"A","text":"Replace Lambda with AWS Step Functions orchestrating Fargate tasks","is_correct":true},{"id":"B","text":"Increase Lambda memory to reduce execution time","is_correct":false},{"id":"C","text":"Split the Lambda into smaller functions","is_correct":false},{"id":"D","text":"Use Lambda with provisioned concurrency","is_correct":false}]',
 'Fargate tasks have no execution time limit and can run for hours at lower cost than long-running Lambda functions. Step Functions orchestrate the workflow. Lambda is cost-effective for short executions but expensive for 10-15 minute runs.',
 '{"Step Functions","Fargate","Lambda","S3"}', 'seed'),

('cost', 'serverless_cost', 4, 'A company uses RDS PostgreSQL (db.r5.2xlarge) with 20% average CPU utilization. What is the FIRST step to reduce costs?',
 'single',
 '[{"id":"A","text":"Use AWS Compute Optimizer to rightsize the instance to a smaller type","is_correct":true},{"id":"B","text":"Switch to Aurora Serverless","is_correct":false},{"id":"C","text":"Enable RDS Reserved Instance for the current size","is_correct":false},{"id":"D","text":"Move to DynamoDB","is_correct":false}]',
 'At 20% CPU utilization, the instance is significantly oversized. Rightsizing to db.r5.large or db.r5.xlarge could cut costs by 50-75% immediately. Buying a Reserved Instance for an oversized instance locks in unnecessary spending.',
 '{"Compute Optimizer","RDS"}', 'seed'),

('cost', 'right_sizing', 5, 'A media company stores 500 TB of video files in S3 Standard. 90% of videos are accessed within the first week of upload, then rarely after. They want to minimize storage costs while keeping all content accessible within minutes. Which combination is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"S3 Intelligent-Tiering with Archive Access tier enabled","is_correct":true},{"id":"B","text":"S3 lifecycle policy: Standard for 7 days, then Standard-IA","is_correct":false},{"id":"C","text":"S3 lifecycle policy: Standard for 7 days, then Glacier Instant Retrieval","is_correct":false},{"id":"D","text":"S3 Standard for all content with CloudFront caching","is_correct":false}]',
 'Intelligent-Tiering with Archive Access automatically moves objects that are not accessed for 90 days to a cheaper archive tier, with automatic restoration within minutes when accessed. No lifecycle rules to manage. Glacier Instant Retrieval has higher retrieval costs.',
 '{"S3"}', 'seed');
