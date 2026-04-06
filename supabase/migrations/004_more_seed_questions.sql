-- ═══════════════════════════════════════════════════════════════
-- Migration 004: Additional SAA-C03 Practice Questions
-- Adds 112 more questions to reach 200+ total
-- Distribution: secure(32), resilient(30), performant(30), cost(20)
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: SECURE (32 additional questions)
-- ═══════════════════════════════════════════════════════════════

-- IAM (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'iam', 3, 'A company wants to grant a third-party auditing firm temporary access to read CloudTrail logs in their AWS account. The third party has their own AWS account. What is the MOST secure way to provide access?',
 'single',
 '[{"id":"A","text":"Create an IAM user with access keys and share the credentials securely","is_correct":false},{"id":"B","text":"Create a cross-account IAM role with a trust policy allowing the third-party account to assume it","is_correct":true},{"id":"C","text":"Add the third party''s account ID to the S3 bucket policy for the CloudTrail bucket","is_correct":false},{"id":"D","text":"Share the root account credentials with multi-factor authentication enabled","is_correct":false}]',
 'Cross-account IAM roles are the recommended approach for granting access to external AWS accounts. The trust policy specifies which external account can assume the role, and the permissions policy limits what the role can do. This avoids sharing long-term credentials.',
 '{"IAM","CloudTrail","S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'iam', 4, 'A developer needs permissions to deploy Lambda functions and create API Gateway endpoints, but must not be able to modify IAM roles or policies. Which approach enforces this using least privilege?',
 'single',
 '[{"id":"A","text":"Attach the PowerUserAccess managed policy to the developer''s IAM user","is_correct":false},{"id":"B","text":"Create a custom IAM policy granting lambda:* and apigateway:* actions, and attach a permissions boundary that denies iam:* actions","is_correct":true},{"id":"C","text":"Add the developer to the Administrators group and use an SCP to deny IAM actions","is_correct":false},{"id":"D","text":"Create a custom policy granting full access and rely on AWS CloudTrail for compliance","is_correct":false}]',
 'Permissions boundaries set the maximum permissions that an identity-based policy can grant. Combining a targeted policy with a permissions boundary that explicitly denies IAM modifications enforces least privilege. PowerUserAccess is too broad.',
 '{"IAM","Lambda","API Gateway"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'iam', 5, 'A company is implementing a CI/CD pipeline that deploys infrastructure using CloudFormation. They want to ensure the pipeline can only create resources defined in approved templates and cannot escalate its own privileges. Which TWO actions should the solutions architect take? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Use a CloudFormation service role with specific permissions and attach a permissions boundary to it","is_correct":true},{"id":"B","text":"Apply an SCP that denies iam:CreateRole and iam:AttachRolePolicy for the pipeline account unless a permissions boundary is included","is_correct":true},{"id":"C","text":"Grant the pipeline role AdministratorAccess so CloudFormation can create any resource","is_correct":false},{"id":"D","text":"Use AWS Config rules to detect and delete unauthorized resources after deployment","is_correct":false}]',
 'A CloudFormation service role limits what resources the stack can create. Permissions boundaries prevent privilege escalation by requiring all new roles to include a boundary. SCPs can enforce that iam:CreateRole calls include a ConditionKey for permissions boundaries. Detective controls like Config are insufficient for prevention.',
 '{"CloudFormation","IAM","Organizations"}', 'seed');

-- Cognito (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cognito', 2, 'A company is building a mobile application and needs to allow users to sign in with their Google or Facebook accounts. Which AWS service provides this capability?',
 'single',
 '[{"id":"A","text":"AWS IAM Identity Center","is_correct":false},{"id":"B","text":"Amazon Cognito user pools","is_correct":true},{"id":"C","text":"AWS Directory Service","is_correct":false},{"id":"D","text":"Amazon GuardDuty","is_correct":false}]',
 'Amazon Cognito user pools support federation with social identity providers like Google, Facebook, and Apple. User pools handle user registration, authentication, and token management. IAM Identity Center is for workforce access, not customer-facing applications.',
 '{"Cognito"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cognito', 3, 'A web application uses Amazon Cognito user pools for authentication. The company wants to give authenticated users access to upload files to a specific S3 prefix based on their user ID. What should the solutions architect use?',
 'single',
 '[{"id":"A","text":"S3 bucket policies with Cognito user pool ARN conditions","is_correct":false},{"id":"B","text":"Amazon Cognito identity pools with IAM role mapping and policy variables","is_correct":true},{"id":"C","text":"Lambda authorizers attached to the S3 API endpoint","is_correct":false},{"id":"D","text":"S3 pre-signed URLs generated by a backend service","is_correct":false}]',
 'Cognito identity pools provide temporary AWS credentials to authenticated users. IAM policies can use the ${cognito-identity.amazonaws.com:sub} variable to restrict S3 access to a per-user prefix (e.g., s3:prefix/${cognito-identity.amazonaws.com:sub}/*).',
 '{"Cognito","S3","IAM"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cognito', 4, 'An application requires that users must verify their email address before signing in and that passwords meet a minimum length of 12 characters. Where should these requirements be configured?',
 'single',
 '[{"id":"A","text":"In the application''s backend validation code","is_correct":false},{"id":"B","text":"In the Cognito user pool password policy and email verification settings","is_correct":true},{"id":"C","text":"In an AWS WAF rule attached to the authentication endpoint","is_correct":false},{"id":"D","text":"In a Lambda function triggered before authentication","is_correct":false}]',
 'Cognito user pools have built-in password policy settings (minimum length, character requirements) and can enforce email verification before allowing sign-in. These are configured at the user pool level, not in application code or WAF.',
 '{"Cognito"}', 'seed');

-- KMS/Encryption (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'kms_encryption', 3, 'A company wants to encrypt an existing unencrypted EBS volume attached to a running EC2 instance. What is the correct procedure?',
 'single',
 '[{"id":"A","text":"Enable encryption on the existing volume through the EC2 console","is_correct":false},{"id":"B","text":"Create a snapshot, copy the snapshot with encryption enabled, then create an encrypted volume from the copied snapshot","is_correct":true},{"id":"C","text":"Detach the volume and use the AWS CLI to encrypt it in place","is_correct":false},{"id":"D","text":"Create an encrypted AMI from the instance and launch a new instance","is_correct":false}]',
 'You cannot encrypt an existing unencrypted EBS volume directly. The process is: create a snapshot of the unencrypted volume, copy that snapshot with encryption enabled, then create a new encrypted volume from the encrypted snapshot. Finally, replace the unencrypted volume.',
 '{"EBS","KMS","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'kms_encryption', 4, 'A company needs to share encrypted AMIs across AWS accounts in different regions. The AMIs are encrypted with a customer managed KMS key. Which steps are required? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Modify the KMS key policy to grant the target account permission to use the key","is_correct":true},{"id":"B","text":"Copy the AMI to the target region and re-encrypt it with a KMS key in that region","is_correct":true},{"id":"C","text":"Disable encryption on the AMI before sharing it across accounts","is_correct":false},{"id":"D","text":"Use AWS RAM (Resource Access Manager) to share the KMS key","is_correct":false}]',
 'To share encrypted AMIs cross-account, the KMS key policy must allow the target account to use the key for decryption. When copying across regions, you must re-encrypt with a KMS key in the destination region since KMS keys are region-specific.',
 '{"KMS","EC2","AMI"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'kms_encryption', 5, 'A company requires all data encryption keys to be generated and stored within FIPS 140-2 Level 3 certified hardware. They also want to integrate with AWS services like S3 and RDS for encryption at rest. Which approach meets these requirements?',
 'single',
 '[{"id":"A","text":"Use AWS KMS with AWS managed keys","is_correct":false},{"id":"B","text":"Use AWS CloudHSM and create a custom key store in KMS backed by the CloudHSM cluster","is_correct":true},{"id":"C","text":"Use SSE-C encryption with customer-provided keys","is_correct":false},{"id":"D","text":"Use AWS KMS with imported key material","is_correct":false}]',
 'AWS CloudHSM provides FIPS 140-2 Level 3 validated HSMs. A KMS custom key store backed by CloudHSM allows you to generate keys in the HSMs while still integrating with AWS services through KMS. Standard KMS uses FIPS 140-2 Level 2 validated HSMs.',
 '{"CloudHSM","KMS","S3","RDS"}', 'seed');

-- VPC Security (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'vpc_security', 3, 'A company runs a three-tier web application. They want to ensure the application tier can only receive traffic from the web tier load balancer and the database tier only accepts traffic from the application tier. What should the solutions architect configure?',
 'single',
 '[{"id":"A","text":"Network ACLs that reference security group IDs for each tier","is_correct":false},{"id":"B","text":"Security groups that reference the security group ID of the tier that should be allowed access","is_correct":true},{"id":"C","text":"Route table entries that restrict traffic flow between subnets","is_correct":false},{"id":"D","text":"AWS Network Firewall rules between each subnet tier","is_correct":false}]',
 'Security groups can reference other security groups as the source. The app tier security group allows inbound from the ALB security group. The database security group allows inbound from the app tier security group. NACLs cannot reference security group IDs.',
 '{"VPC","EC2","RDS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'vpc_security', 4, 'An application in a private subnet needs to access the Amazon DynamoDB API without using an internet gateway or NAT gateway. How should this be implemented?',
 'single',
 '[{"id":"A","text":"Create a VPC interface endpoint for DynamoDB","is_correct":false},{"id":"B","text":"Create a VPC gateway endpoint for DynamoDB and add a route to the private subnet route table","is_correct":true},{"id":"C","text":"Use VPC peering with the DynamoDB VPC","is_correct":false},{"id":"D","text":"Configure AWS PrivateLink for DynamoDB","is_correct":false}]',
 'DynamoDB and S3 support gateway endpoints, which are added as targets in route tables. Gateway endpoints do not require a NAT gateway or internet gateway. Interface endpoints (powered by PrivateLink) are used for most other AWS services.',
 '{"VPC","DynamoDB"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'vpc_security', 3, 'A company wants to log all network traffic flowing through their VPC for compliance auditing. Which service should they enable?',
 'single',
 '[{"id":"A","text":"AWS CloudTrail","is_correct":false},{"id":"B","text":"VPC Flow Logs","is_correct":true},{"id":"C","text":"Amazon Inspector","is_correct":false},{"id":"D","text":"AWS Config","is_correct":false}]',
 'VPC Flow Logs capture information about IP traffic going to and from network interfaces in a VPC. They can be published to CloudWatch Logs or S3. CloudTrail logs API calls, not network traffic. Inspector assesses vulnerabilities.',
 '{"VPC","CloudWatch"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'vpc_security', 5, 'A company must inspect all inbound and outbound traffic for their VPC, including traffic between subnets, for intrusion detection. Which architecture provides comprehensive inspection?',
 'single',
 '[{"id":"A","text":"Deploy a NAT gateway and enable VPC Flow Logs for monitoring","is_correct":false},{"id":"B","text":"Deploy AWS Network Firewall in a dedicated firewall subnet and route all traffic through it using VPC route tables","is_correct":true},{"id":"C","text":"Enable GuardDuty and configure automatic remediation with Lambda","is_correct":false},{"id":"D","text":"Use security group rules to allow only known-good traffic patterns","is_correct":false}]',
 'AWS Network Firewall is a managed service for deploying stateful and stateless network inspection. By placing it in a dedicated subnet and modifying route tables to send all traffic through it, both north-south and east-west traffic can be inspected. GuardDuty is a threat detection service, not inline inspection.',
 '{"Network Firewall","VPC"}', 'seed');

-- WAF/Shield (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'waf_shield', 2, 'A company wants to protect their public-facing web application from common web exploits such as SQL injection and cross-site scripting. Which AWS service should they use?',
 'single',
 '[{"id":"A","text":"AWS Shield Standard","is_correct":false},{"id":"B","text":"AWS WAF","is_correct":true},{"id":"C","text":"Amazon Macie","is_correct":false},{"id":"D","text":"AWS Firewall Manager","is_correct":false}]',
 'AWS WAF (Web Application Firewall) protects web applications from common web exploits by letting you define rules that filter traffic based on conditions like SQL injection patterns and XSS patterns. Shield protects against DDoS attacks.',
 '{"WAF"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'waf_shield', 3, 'A company hosts a high-traffic e-commerce site behind a CloudFront distribution. They experience a volumetric DDoS attack. Which combination provides automatic DDoS protection and 24/7 access to the AWS DDoS Response Team? (Select TWO)',
 'multi',
 '[{"id":"A","text":"AWS Shield Advanced","is_correct":true},{"id":"B","text":"AWS WAF with rate-based rules","is_correct":true},{"id":"C","text":"Amazon GuardDuty with automated Lambda remediation","is_correct":false},{"id":"D","text":"AWS Network Firewall with intrusion prevention rules","is_correct":false}]',
 'Shield Advanced provides enhanced DDoS protection, 24/7 access to the DDoS Response Team (DRT), cost protection during attacks, and advanced attack diagnostics. WAF rate-based rules can automatically block IPs that exceed a request threshold, helping mitigate application-layer DDoS.',
 '{"Shield","WAF","CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'waf_shield', 4, 'A company has multiple AWS accounts and wants to centrally manage WAF rules across all accounts and ensure compliance. Which service should they use?',
 'single',
 '[{"id":"A","text":"AWS Config with custom rules","is_correct":false},{"id":"B","text":"AWS Firewall Manager","is_correct":true},{"id":"C","text":"AWS Organizations with SCPs","is_correct":false},{"id":"D","text":"AWS CloudFormation StackSets","is_correct":false}]',
 'AWS Firewall Manager enables centralized management of WAF rules, Shield Advanced protections, security groups, and Network Firewall rules across multiple accounts in an AWS Organization. It automatically applies rules to new resources.',
 '{"Firewall Manager","WAF","Organizations"}', 'seed');

-- Secrets Manager (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'secrets_manager', 2, 'A developer is hardcoding database credentials in application source code. What AWS service should be used instead to securely store and retrieve these credentials?',
 'single',
 '[{"id":"A","text":"AWS Systems Manager Parameter Store with SecureString","is_correct":false},{"id":"B","text":"AWS Secrets Manager","is_correct":true},{"id":"C","text":"AWS KMS","is_correct":false},{"id":"D","text":"Amazon S3 with server-side encryption","is_correct":false}]',
 'AWS Secrets Manager is designed specifically for managing secrets like database credentials, API keys, and tokens. It provides automatic rotation, fine-grained access control, and audit logging. Parameter Store SecureString is an alternative but lacks built-in rotation for database credentials.',
 '{"Secrets Manager"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'secrets_manager', 3, 'A company stores their RDS MySQL credentials in AWS Secrets Manager. They want the credentials to be rotated every 30 days without application downtime. What should they configure?',
 'single',
 '[{"id":"A","text":"A CloudWatch Events rule that triggers a Lambda function to change the password every 30 days","is_correct":false},{"id":"B","text":"Enable automatic rotation in Secrets Manager with a rotation interval of 30 days using the alternating users strategy","is_correct":true},{"id":"C","text":"An AWS Config rule that detects credentials older than 30 days and triggers remediation","is_correct":false},{"id":"D","text":"A Step Functions workflow that rotates credentials and updates all application configurations","is_correct":false}]',
 'Secrets Manager supports automatic rotation with Lambda functions. The alternating users strategy maintains two sets of credentials and alternates between them, ensuring zero-downtime rotation. Secrets Manager provides built-in Lambda rotation functions for RDS databases.',
 '{"Secrets Manager","RDS","Lambda"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'secrets_manager', 4, 'A company has applications in multiple AWS regions that need to access the same database secret. They want low-latency access to the secret in each region. What should they configure?',
 'single',
 '[{"id":"A","text":"Create separate secrets in each region and synchronize them with a Lambda function","is_correct":false},{"id":"B","text":"Configure Secrets Manager secret replication to the required regions","is_correct":true},{"id":"C","text":"Store the secret in a DynamoDB global table and read from the local region","is_correct":false},{"id":"D","text":"Use S3 Cross-Region Replication to replicate an encrypted file containing the secret","is_correct":false}]',
 'AWS Secrets Manager supports multi-region secret replication. A secret is designated as a primary and automatically replicated to specified regions. Applications in each region access the local replica for low-latency reads. Rotation is performed on the primary and propagated.',
 '{"Secrets Manager"}', 'seed');

-- CloudTrail (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cloudtrail', 2, 'A company needs to record all API calls made in their AWS account for security auditing. Which service should they enable?',
 'single',
 '[{"id":"A","text":"AWS Config","is_correct":false},{"id":"B","text":"AWS CloudTrail","is_correct":true},{"id":"C","text":"Amazon CloudWatch Logs","is_correct":false},{"id":"D","text":"VPC Flow Logs","is_correct":false}]',
 'AWS CloudTrail records API calls made in an AWS account. It logs the identity of the caller, the time, the source IP, the request parameters, and the response. AWS Config tracks resource configuration changes, not API calls.',
 '{"CloudTrail"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cloudtrail', 3, 'A security team wants to be alerted within minutes when a root account login occurs. Which approach achieves this with the LEAST operational overhead?',
 'single',
 '[{"id":"A","text":"Enable CloudTrail and create a CloudWatch Logs metric filter for root login events, then create a CloudWatch alarm with SNS notification","is_correct":true},{"id":"B","text":"Write a Lambda function that queries CloudTrail logs every minute","is_correct":false},{"id":"C","text":"Enable AWS Config and create a custom rule for root account usage","is_correct":false},{"id":"D","text":"Enable GuardDuty and subscribe to all HIGH severity findings","is_correct":false}]',
 'CloudTrail can deliver logs to CloudWatch Logs. A metric filter on the ConsoleLogin event with userIdentity type Root triggers a CloudWatch alarm, which sends an SNS notification. This is near-real-time and fully managed.',
 '{"CloudTrail","CloudWatch","SNS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'cloudtrail', 4, 'A company wants to ensure CloudTrail log files have not been tampered with after delivery to S3. Which feature should be enabled?',
 'single',
 '[{"id":"A","text":"S3 Object Lock with governance mode","is_correct":false},{"id":"B","text":"CloudTrail log file integrity validation","is_correct":true},{"id":"C","text":"S3 versioning on the CloudTrail bucket","is_correct":false},{"id":"D","text":"AWS KMS encryption of CloudTrail logs","is_correct":false}]',
 'CloudTrail log file integrity validation uses SHA-256 hashing and RSA digital signatures. It creates a digest file each hour with hashes of the log files. You can validate whether logs have been modified or deleted after delivery. S3 Object Lock prevents deletion but does not detect tampering.',
 '{"CloudTrail","S3"}', 'seed');

-- S3 Security (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 's3_security', 3, 'A company accidentally made an S3 bucket public and wants to prevent any bucket in the account from ever being made public. What is the MOST effective account-level control?',
 'single',
 '[{"id":"A","text":"Enable S3 Block Public Access at the account level","is_correct":true},{"id":"B","text":"Create an IAM policy that denies s3:PutBucketPolicy","is_correct":false},{"id":"C","text":"Use AWS Config to detect public buckets and auto-remediate","is_correct":false},{"id":"D","text":"Enable Amazon Macie on all S3 buckets","is_correct":false}]',
 'S3 Block Public Access settings at the account level override any bucket-level policies or ACLs that would grant public access. This is a preventative control, unlike AWS Config which is detective. Macie discovers sensitive data but does not block public access.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 's3_security', 4, 'A company needs to grant time-limited access to a specific S3 object to an external partner who does not have an AWS account. Which method is MOST appropriate?',
 'single',
 '[{"id":"A","text":"Make the object public temporarily","is_correct":false},{"id":"B","text":"Generate an S3 pre-signed URL with an expiration time","is_correct":true},{"id":"C","text":"Create an IAM user for the partner with temporary credentials","is_correct":false},{"id":"D","text":"Enable S3 Transfer Acceleration and share the endpoint","is_correct":false}]',
 'S3 pre-signed URLs grant temporary access to a specific object without requiring an AWS account. The URL includes authentication information and an expiration time. Making the object public exposes it to everyone, not just the partner.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 's3_security', 5, 'A financial company stores sensitive documents in S3. They need to automatically discover and classify personally identifiable information (PII) in existing and new objects. Findings must be sent to a security dashboard. Which approach meets these requirements?',
 'single',
 '[{"id":"A","text":"Enable S3 server access logging and parse logs with Lambda","is_correct":false},{"id":"B","text":"Use Amazon Macie to run sensitive data discovery jobs and integrate findings with Security Hub","is_correct":true},{"id":"C","text":"Use Amazon Comprehend to analyze all S3 objects for PII entities","is_correct":false},{"id":"D","text":"Enable S3 Intelligent-Tiering analytics to classify objects","is_correct":false}]',
 'Amazon Macie uses machine learning and pattern matching to discover and classify sensitive data in S3, including PII. Macie findings can be sent to AWS Security Hub for centralized security management and dashboarding. Comprehend is for NLP, not security classification.',
 '{"Macie","S3","Security Hub"}', 'seed');

-- Organizations/SCP (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'org_scp', 3, 'A company wants to prevent any AWS account in their organization from leaving the organization. Which control should they implement?',
 'single',
 '[{"id":"A","text":"An IAM policy on the root user of each account denying organizations:LeaveOrganization","is_correct":false},{"id":"B","text":"An SCP attached to the root OU that denies organizations:LeaveOrganization","is_correct":true},{"id":"C","text":"An AWS Config rule that monitors for LeaveOrganization API calls","is_correct":false},{"id":"D","text":"Remove the root user password from all member accounts","is_correct":false}]',
 'SCPs can deny specific API actions across all accounts in an OU. By attaching an SCP at the root OU that denies organizations:LeaveOrganization, no member account (including the management account) can leave. IAM policies on root users can be overridden.',
 '{"Organizations"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'org_scp', 4, 'A company wants to restrict all AWS accounts in the development OU to only use resources in us-east-1 and eu-west-1. Which SCP statement achieves this?',
 'single',
 '[{"id":"A","text":"A Deny statement with a StringNotEquals condition on aws:RequestedRegion for us-east-1 and eu-west-1","is_correct":true},{"id":"B","text":"An Allow statement specifying only us-east-1 and eu-west-1 in the resource ARN","is_correct":false},{"id":"C","text":"A Deny statement with a StringEquals condition on aws:Region for all other regions","is_correct":false},{"id":"D","text":"An Allow statement with a condition key of aws:SourceRegion","is_correct":false}]',
 'SCPs use deny statements with aws:RequestedRegion condition to restrict which regions can be used. The StringNotEquals condition with a list of allowed regions effectively denies actions in all other regions. Note: exclude global services like IAM, Organizations, and CloudFront from the deny.',
 '{"Organizations"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'org_scp', 5, 'A company has an AWS Organization with OUs for Production, Development, and Sandbox. They want to ensure that the Production OU has strict guardrails while the Sandbox OU allows experimentation but prevents creation of Reserved Instances. How should SCPs be structured? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Attach restrictive SCPs to the Production OU that limit services and actions to approved patterns","is_correct":true},{"id":"B","text":"Attach an SCP to the Sandbox OU that denies ec2:PurchaseReservedInstancesOffering and savingsplans:CreateSavingsPlan","is_correct":true},{"id":"C","text":"Remove the FullAWSAccess SCP from the root and add it only to the Sandbox OU","is_correct":false},{"id":"D","text":"Use IAM policies instead of SCPs for sandbox accounts since SCPs are only for production","is_correct":false}]',
 'SCPs can be tailored per OU. Production gets restrictive SCPs allowing only approved services and actions. Sandbox gets a permissive SCP but with specific denies for financial commitments like Reserved Instances and Savings Plans. Removing FullAWSAccess from root would deny everything by default.',
 '{"Organizations"}', 'seed');

-- Certificate Manager (2 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'certificate_mgr', 2, 'A company needs to provision SSL/TLS certificates for their CloudFront distribution. Which service should they use to obtain certificates at no cost?',
 'single',
 '[{"id":"A","text":"AWS Certificate Manager (ACM)","is_correct":true},{"id":"B","text":"AWS KMS","is_correct":false},{"id":"C","text":"Third-party certificate authority through AWS Marketplace","is_correct":false},{"id":"D","text":"AWS CloudHSM","is_correct":false}]',
 'ACM provides free public SSL/TLS certificates for use with AWS services like CloudFront, ALB, and API Gateway. ACM handles certificate renewal automatically. For CloudFront, certificates must be requested in us-east-1.',
 '{"ACM","CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'certificate_mgr', 4, 'A company needs to use SSL/TLS certificates on EC2 instances running Nginx. They want certificates to renew automatically. Which solution meets these requirements?',
 'single',
 '[{"id":"A","text":"Place an Application Load Balancer in front of the EC2 instances and use ACM certificates on the ALB","is_correct":true},{"id":"B","text":"Export ACM certificates and install them on the EC2 instances","is_correct":false},{"id":"C","text":"Use ACM Private CA to issue certificates and deploy them via Systems Manager","is_correct":false},{"id":"D","text":"Install Let''s Encrypt certificates directly on the EC2 instances","is_correct":false}]',
 'ACM certificates cannot be exported or installed directly on EC2 instances. The recommended pattern is to terminate TLS at an ALB using ACM certificates. The ALB handles certificate renewal automatically. ACM Private CA can issue certificates for EC2 but adds complexity and cost.',
 '{"ACM","ALB","EC2"}', 'seed');

-- WAF/Shield additional (2 questions already above, adding more topic coverage)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 'waf_shield', 5, 'A company is experiencing a sophisticated application-layer DDoS attack that mimics legitimate HTTP requests. The attack bypasses rate-based WAF rules because requests come from thousands of different IP addresses. Which approach BEST mitigates this attack?',
 'single',
 '[{"id":"A","text":"Increase the CloudFront origin connection timeout","is_correct":false},{"id":"B","text":"Use AWS WAF Bot Control with targeted protections to detect and challenge automated traffic patterns","is_correct":true},{"id":"C","text":"Scale the application horizontally with Auto Scaling","is_correct":false},{"id":"D","text":"Enable AWS Shield Standard on all public-facing resources","is_correct":false}]',
 'WAF Bot Control uses machine learning to detect automated traffic patterns even when distributed across many IPs. Targeted protections analyze request patterns, browser fingerprints, and behavioral signals to distinguish bots from legitimate users. Shield Standard only mitigates network/transport-layer attacks.',
 '{"WAF","CloudFront","Shield"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('secure', 's3_security', 3, 'A company needs to enforce that all objects uploaded to an S3 bucket use server-side encryption. How should the bucket be configured?',
 'single',
 '[{"id":"A","text":"Enable default encryption on the bucket","is_correct":false},{"id":"B","text":"Add a bucket policy that denies s3:PutObject requests without the x-amz-server-side-encryption header","is_correct":true},{"id":"C","text":"Enable S3 Versioning to automatically encrypt objects","is_correct":false},{"id":"D","text":"Attach a NACL to the S3 VPC endpoint to block unencrypted traffic","is_correct":false}]',
 'A bucket policy with a condition checking for the x-amz-server-side-encryption header denies unencrypted uploads. Default encryption applies encryption to objects that do not specify it, but does not reject unencrypted upload requests. For strict enforcement, both a bucket policy and default encryption should be used.',
 '{"S3","KMS"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: RESILIENT (30 additional questions)
-- ═══════════════════════════════════════════════════════════════

-- Multi-AZ (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'multi_az', 2, 'A company runs a critical web application on a single EC2 instance in us-east-1a. How should the architecture be modified for high availability?',
 'single',
 '[{"id":"A","text":"Enable Enhanced Monitoring on the EC2 instance","is_correct":false},{"id":"B","text":"Deploy instances across multiple Availability Zones behind an Application Load Balancer","is_correct":true},{"id":"C","text":"Use a larger instance type with higher availability SLA","is_correct":false},{"id":"D","text":"Create an AMI and store it in S3 for quick recovery","is_correct":false}]',
 'Distributing instances across multiple Availability Zones protects against AZ failures. An ALB distributes traffic across healthy instances in multiple AZs. A single instance, regardless of size, is a single point of failure.',
 '{"EC2","ALB"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'multi_az', 3, 'A company deploys an RDS MySQL database for a production application. The application requires minimal downtime in case of infrastructure failure. Which configuration provides automatic failover?',
 'single',
 '[{"id":"A","text":"RDS read replica in a different AZ","is_correct":false},{"id":"B","text":"RDS Multi-AZ deployment","is_correct":true},{"id":"C","text":"RDS with automated backups and point-in-time recovery","is_correct":false},{"id":"D","text":"RDS with enhanced monitoring and auto-restart","is_correct":false}]',
 'RDS Multi-AZ maintains a synchronous standby replica in a different AZ. Failover is automatic and typically completes within 60-120 seconds. Read replicas use asynchronous replication and require manual promotion. Automated backups help with data recovery but not automatic failover.',
 '{"RDS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'multi_az', 4, 'A company needs a relational database that can survive the loss of an entire AWS Region and resume operations in the secondary region within minutes. Which solution meets this requirement?',
 'single',
 '[{"id":"A","text":"RDS Multi-AZ with automated backups copied to another region","is_correct":false},{"id":"B","text":"Amazon Aurora Global Database with a secondary region","is_correct":true},{"id":"C","text":"RDS read replica in another region with manual promotion","is_correct":false},{"id":"D","text":"DynamoDB global tables with multi-region replication","is_correct":false}]',
 'Aurora Global Database replicates data to secondary regions with less than one second of lag. In a disaster, the secondary region can be promoted to read-write in under a minute. Cross-region RDS replicas require manual promotion and have higher replication lag.',
 '{"Aurora","RDS"}', 'seed');

-- Auto Scaling (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'auto_scaling', 2, 'A company wants to ensure their application automatically adds EC2 instances when CPU utilization exceeds 70%. Which service provides this capability?',
 'single',
 '[{"id":"A","text":"AWS Lambda","is_correct":false},{"id":"B","text":"Amazon EC2 Auto Scaling with a target tracking scaling policy","is_correct":true},{"id":"C","text":"Amazon CloudWatch alarms with EC2 actions","is_correct":false},{"id":"D","text":"AWS Elastic Beanstalk","is_correct":false}]',
 'EC2 Auto Scaling with target tracking scaling policies automatically adjusts the number of instances to maintain a target metric value (e.g., 70% CPU utilization). It adds instances when utilization is above target and removes them when below.',
 '{"Auto Scaling","EC2","CloudWatch"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'auto_scaling', 3, 'An application experiences predictable traffic spikes every weekday from 9 AM to 5 PM. The company wants to pre-scale capacity before the spike and reduce capacity after hours. Which scaling approach is MOST appropriate?',
 'single',
 '[{"id":"A","text":"Reactive scaling with simple scaling policies","is_correct":false},{"id":"B","text":"Scheduled scaling actions that increase desired capacity before 9 AM and decrease after 5 PM","is_correct":true},{"id":"C","text":"Manual scaling by an operations team","is_correct":false},{"id":"D","text":"Predictive scaling only","is_correct":false}]',
 'Scheduled scaling allows you to set a schedule for capacity changes based on predictable patterns. Pre-scaling before 9 AM avoids performance issues during the initial traffic surge. Reactive scaling introduces a delay while instances launch.',
 '{"Auto Scaling","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'auto_scaling', 4, 'An Auto Scaling group launches instances that take 5 minutes to initialize and register with the target group. During scaling events, the ALB health checks mark new instances as unhealthy and they get terminated before completing initialization. How should this be fixed?',
 'single',
 '[{"id":"A","text":"Increase the ALB health check interval to 10 minutes","is_correct":false},{"id":"B","text":"Configure a health check grace period on the Auto Scaling group that exceeds the initialization time","is_correct":true},{"id":"C","text":"Disable health checks on the Auto Scaling group","is_correct":false},{"id":"D","text":"Use a Network Load Balancer instead of an ALB","is_correct":false}]',
 'The health check grace period tells Auto Scaling to wait before checking health after an instance launches. Setting this to more than 5 minutes prevents premature termination of initializing instances. Increasing the ALB health check interval alone does not solve the issue because the Auto Scaling group checks health independently.',
 '{"Auto Scaling","ALB","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'auto_scaling', 5, 'A company runs a microservices application on EC2. Each service has different scaling requirements. The team wants to scale based on the number of messages in an SQS queue per instance. Which approach achieves this? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Create a custom CloudWatch metric that calculates queue depth divided by the number of running instances","is_correct":true},{"id":"B","text":"Use a target tracking scaling policy with the custom backlog-per-instance metric","is_correct":true},{"id":"C","text":"Use a simple scaling policy triggered by the ApproximateNumberOfMessagesVisible metric","is_correct":false},{"id":"D","text":"Configure SQS to directly trigger Auto Scaling events","is_correct":false}]',
 'Scaling based on queue backlog per instance requires a custom CloudWatch metric (messages / instances). A target tracking policy then maintains a target backlog per instance. Using the raw queue depth without per-instance normalization does not account for current fleet size.',
 '{"Auto Scaling","SQS","CloudWatch"}', 'seed');

-- ELB (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'elb', 3, 'A company hosts a web application that uses WebSocket connections for real-time chat. They need a load balancer that supports WebSocket protocol natively. Which type should they choose?',
 'single',
 '[{"id":"A","text":"Classic Load Balancer","is_correct":false},{"id":"B","text":"Application Load Balancer","is_correct":true},{"id":"C","text":"Network Load Balancer","is_correct":false},{"id":"D","text":"Gateway Load Balancer","is_correct":false}]',
 'Application Load Balancers natively support WebSocket connections. ALBs operate at Layer 7 and can handle the WebSocket upgrade from HTTP. NLBs work at Layer 4 and can pass through WebSocket traffic but don''t natively manage the protocol.',
 '{"ALB"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'elb', 4, 'A company needs to route traffic to EC2 instances using static IP addresses. Clients use IP-based allowlists and cannot use DNS names. Which load balancer should the solutions architect recommend?',
 'single',
 '[{"id":"A","text":"Application Load Balancer with an Elastic IP per subnet","is_correct":false},{"id":"B","text":"Network Load Balancer with an Elastic IP per AZ","is_correct":true},{"id":"C","text":"Classic Load Balancer with Elastic IP assignment","is_correct":false},{"id":"D","text":"Gateway Load Balancer with static IP routing","is_correct":false}]',
 'Network Load Balancers support assigning one Elastic IP address per Availability Zone, providing static IP addresses. ALBs use dynamic IP addresses that change. For clients requiring IP allowlisting, NLB is the appropriate choice.',
 '{"NLB","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'elb', 3, 'A company has an ALB that distributes traffic to EC2 instances in two Availability Zones. One AZ has 4 instances and the other has 2 instances. Users report uneven response times. What ALB feature should be enabled to distribute traffic more evenly?',
 'single',
 '[{"id":"A","text":"Sticky sessions","is_correct":false},{"id":"B","text":"Cross-zone load balancing","is_correct":true},{"id":"C","text":"Connection draining","is_correct":false},{"id":"D","text":"Path-based routing","is_correct":false}]',
 'Cross-zone load balancing distributes traffic evenly across all registered instances in all AZs, regardless of AZ. Without it, each AZ receives an equal share of traffic, meaning the AZ with 2 instances would have each instance receiving more traffic than the AZ with 4 instances.',
 '{"ALB","EC2"}', 'seed');

-- SQS/SNS (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'sqs_sns', 3, 'A company processes orders through a web application. During peak hours, the order processing service becomes overwhelmed and drops requests. Which architecture improvement provides the MOST resilient solution?',
 'single',
 '[{"id":"A","text":"Scale the order processing service to a larger instance type","is_correct":false},{"id":"B","text":"Place an SQS queue between the web application and the order processing service to buffer requests","is_correct":true},{"id":"C","text":"Add a CloudFront distribution in front of the web application","is_correct":false},{"id":"D","text":"Deploy the order processing service in multiple regions","is_correct":false}]',
 'SQS decouples the web application from the processing service. Messages are stored durably in the queue until the processor retrieves them. This prevents message loss during traffic spikes and allows the processor to consume messages at its own pace.',
 '{"SQS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'sqs_sns', 4, 'A company needs to fan out a single event to multiple downstream services. Each service must process every event independently. If a service is temporarily unavailable, it should not miss any events. Which pattern should be implemented?',
 'single',
 '[{"id":"A","text":"Send the event directly to each service via HTTP","is_correct":false},{"id":"B","text":"Publish the event to an SNS topic that has an SQS queue subscribed for each downstream service","is_correct":true},{"id":"C","text":"Write the event to a DynamoDB table and have each service poll for new items","is_correct":false},{"id":"D","text":"Use an SQS FIFO queue with multiple consumers","is_correct":false}]',
 'The SNS-SQS fanout pattern publishes events to an SNS topic with an SQS queue for each consumer. Each queue independently receives a copy of every message. If a service is down, messages accumulate in its queue until it recovers. SQS FIFO queues allow only one consumer group.',
 '{"SNS","SQS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'sqs_sns', 5, 'An order processing system uses SQS. Some messages fail processing repeatedly due to data issues. The team needs to isolate these failed messages for analysis without blocking the queue. Which approach should they implement?',
 'single',
 '[{"id":"A","text":"Increase the visibility timeout to allow more processing time","is_correct":false},{"id":"B","text":"Configure a dead-letter queue (DLQ) with a maxReceiveCount and create a CloudWatch alarm on DLQ message count","is_correct":true},{"id":"C","text":"Delete failed messages and log the error to CloudWatch Logs","is_correct":false},{"id":"D","text":"Use a FIFO queue to ensure messages are processed in order","is_correct":false}]',
 'A dead-letter queue receives messages that exceed the maxReceiveCount (number of failed processing attempts). This isolates problematic messages for investigation without blocking the main queue. A CloudWatch alarm on the DLQ alerts the team when failures occur.',
 '{"SQS","CloudWatch"}', 'seed');

-- Route 53 (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'route53', 3, 'A company has an active-passive disaster recovery setup with primary infrastructure in us-east-1 and standby in eu-west-1. They want DNS to automatically route traffic to the standby region if the primary becomes unhealthy. Which Route 53 routing policy should they use?',
 'single',
 '[{"id":"A","text":"Weighted routing with equal weights","is_correct":false},{"id":"B","text":"Failover routing with health checks","is_correct":true},{"id":"C","text":"Latency-based routing","is_correct":false},{"id":"D","text":"Geolocation routing","is_correct":false}]',
 'Route 53 failover routing directs traffic to the primary resource when it''s healthy and automatically fails over to the secondary resource when the primary fails health checks. This is the standard DNS-based active-passive failover pattern.',
 '{"Route 53"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'route53', 4, 'A global application runs in us-east-1, eu-west-1, and ap-southeast-1. Users should be routed to the nearest healthy region. If a region fails, traffic should be redistributed to the remaining regions. Which Route 53 configuration achieves this?',
 'single',
 '[{"id":"A","text":"Simple routing with multiple values","is_correct":false},{"id":"B","text":"Latency-based routing with health checks and failover to the remaining regions","is_correct":true},{"id":"C","text":"Geolocation routing with a default record","is_correct":false},{"id":"D","text":"Multivalue answer routing with health checks","is_correct":false}]',
 'Latency-based routing directs users to the region with the lowest network latency. When combined with health checks, Route 53 removes unhealthy regions from responses and routes to the next-best region. Geolocation routing is based on user location, not network performance.',
 '{"Route 53"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'route53', 4, 'A company wants to implement blue-green deployments using Route 53. They need to gradually shift traffic from the current (blue) environment to the new (green) environment. Which approach allows controlled traffic shifting?',
 'single',
 '[{"id":"A","text":"Failover routing with health checks","is_correct":false},{"id":"B","text":"Weighted routing, gradually increasing the green environment''s weight","is_correct":true},{"id":"C","text":"Geoproximity routing with bias","is_correct":false},{"id":"D","text":"Simple routing with both environment endpoints","is_correct":false}]',
 'Weighted routing distributes traffic based on assigned weights. Start with 100% blue / 0% green, then gradually shift (e.g., 90/10, 50/50, 0/100). This enables canary-style traffic shifting and easy rollback by adjusting weights.',
 '{"Route 53"}', 'seed');

-- Backup/DR (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'backup_dr', 3, 'A company has an RTO of 4 hours and RPO of 1 hour for their core application. Which disaster recovery strategy is MOST cost-effective while meeting these requirements?',
 'single',
 '[{"id":"A","text":"Multi-site active-active across two regions","is_correct":false},{"id":"B","text":"Warm standby with a scaled-down version of the environment in the secondary region","is_correct":true},{"id":"C","text":"Backup and restore from S3 in the secondary region","is_correct":false},{"id":"D","text":"Pilot light with only critical core services running in the secondary region","is_correct":false}]',
 'Warm standby maintains a scaled-down but fully functional environment that can be quickly scaled up. It meets an RTO of hours and RPO of minutes to hours. Backup and restore has the longest RTO (hours to days). Multi-site is most expensive. Pilot light may not meet the 4-hour RTO for complex applications.',
 '{"EC2","RDS","Route 53"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'backup_dr', 4, 'A company wants to centrally manage backup policies for EC2, RDS, DynamoDB, and EFS across multiple AWS accounts. Which service should they use?',
 'single',
 '[{"id":"A","text":"AWS Systems Manager Maintenance Windows","is_correct":false},{"id":"B","text":"AWS Backup with backup policies managed through AWS Organizations","is_correct":true},{"id":"C","text":"Individual service-level backup configurations in each account","is_correct":false},{"id":"D","text":"AWS CloudFormation StackSets for backup configuration","is_correct":false}]',
 'AWS Backup provides a centralized backup service that works across multiple AWS services. When integrated with AWS Organizations, backup policies can be applied across all accounts. This ensures consistent backup compliance without managing individual service backups.',
 '{"AWS Backup","Organizations"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'backup_dr', 3, 'A company needs to protect against accidental deletion of S3 objects that store critical business data. Which TWO features should they enable? (Select TWO)',
 'multi',
 '[{"id":"A","text":"S3 Versioning","is_correct":true},{"id":"B","text":"S3 MFA Delete","is_correct":true},{"id":"C","text":"S3 Transfer Acceleration","is_correct":false},{"id":"D","text":"S3 Intelligent-Tiering","is_correct":false}]',
 'S3 Versioning preserves all versions of objects, allowing recovery of previously overwritten or deleted objects. MFA Delete requires multi-factor authentication to permanently delete object versions or change the versioning state. Together they provide strong protection against accidental and malicious deletion.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'backup_dr', 5, 'A company requires an RPO of near zero and an RTO of less than 1 minute for their primary database. Which database solution meets these requirements?',
 'single',
 '[{"id":"A","text":"RDS Multi-AZ with synchronous replication","is_correct":false},{"id":"B","text":"Amazon Aurora Multi-AZ with Aurora Replicas and automatic failover","is_correct":true},{"id":"C","text":"DynamoDB with on-demand backups","is_correct":false},{"id":"D","text":"RDS with cross-region read replicas","is_correct":false}]',
 'Aurora maintains six copies of data across three AZs with continuous backup to S3. Aurora Replicas share the same storage volume, providing near-zero RPO. Automatic failover to a replica typically completes in under 30 seconds. RDS Multi-AZ failover takes 60-120 seconds.',
 '{"Aurora"}', 'seed');

-- RDS/Aurora (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'rds_aurora', 3, 'A company runs a read-heavy application on RDS PostgreSQL. The primary database is becoming a bottleneck for read queries. How should the architect offload read traffic?',
 'single',
 '[{"id":"A","text":"Increase the instance size of the primary database","is_correct":false},{"id":"B","text":"Create one or more RDS read replicas and direct read traffic to the replica endpoints","is_correct":true},{"id":"C","text":"Enable Multi-AZ deployment to distribute read traffic","is_correct":false},{"id":"D","text":"Migrate to Amazon Redshift for better read performance","is_correct":false}]',
 'RDS read replicas offload read traffic from the primary database. Applications can direct read queries to the read replica endpoint. Multi-AZ standbys cannot serve read traffic (they are for failover only). Redshift is for analytics, not OLTP workloads.',
 '{"RDS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'rds_aurora', 4, 'An Amazon Aurora MySQL cluster experiences a primary instance failure. The cluster has two Aurora Replicas with different priorities. How does Aurora handle the failover?',
 'single',
 '[{"id":"A","text":"Aurora launches a new instance and restores from the latest backup","is_correct":false},{"id":"B","text":"Aurora promotes the replica with the highest priority (lowest tier number) to primary","is_correct":true},{"id":"C","text":"Aurora promotes the replica with the most recent data","is_correct":false},{"id":"D","text":"Aurora switches to a Multi-AZ standby instance","is_correct":false}]',
 'Aurora failover promotes an existing replica to primary. The replica with the highest priority (lowest priority tier, e.g., tier-0 over tier-1) is chosen first. If priorities are equal, Aurora promotes the replica with the largest size. Since Aurora Replicas share the same storage, data is already current.',
 '{"Aurora"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'rds_aurora', 5, 'A company runs an Aurora PostgreSQL database that supports both OLTP transactions and complex reporting queries. The reporting queries are degrading transaction performance. How should the architect separate these workloads while keeping report data current?',
 'single',
 '[{"id":"A","text":"Create a cross-region read replica and run reports against it","is_correct":false},{"id":"B","text":"Use Aurora parallel query to offload analytical queries to the shared storage layer","is_correct":true},{"id":"C","text":"Migrate reporting to Amazon Redshift with daily ETL jobs","is_correct":false},{"id":"D","text":"Add more Aurora Replicas and use a custom endpoint for reporting","is_correct":false}]',
 'Aurora Parallel Query pushes analytical query processing down to the shared storage layer, reducing the load on the database instance. Data is always current because it reads from the same storage. Replicas help but share compute resources. Redshift with daily ETL introduces data latency.',
 '{"Aurora"}', 'seed');

-- S3 Replication (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 's3_replication', 3, 'A company wants to replicate S3 objects from us-east-1 to eu-west-1 for disaster recovery. Which feature should they configure?',
 'single',
 '[{"id":"A","text":"S3 Transfer Acceleration","is_correct":false},{"id":"B","text":"S3 Cross-Region Replication (CRR)","is_correct":true},{"id":"C","text":"S3 Lifecycle policies","is_correct":false},{"id":"D","text":"S3 Batch Operations","is_correct":false}]',
 'S3 Cross-Region Replication automatically and asynchronously copies objects from a source bucket in one region to a destination bucket in a different region. Versioning must be enabled on both buckets. Transfer Acceleration speeds up uploads but does not replicate objects.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 's3_replication', 4, 'A company enables S3 Cross-Region Replication on an existing bucket with 500,000 objects. They notice that existing objects are not replicated. How should they replicate the existing objects?',
 'single',
 '[{"id":"A","text":"Delete and re-upload all existing objects","is_correct":false},{"id":"B","text":"Use S3 Batch Replication to replicate existing objects","is_correct":true},{"id":"C","text":"Disable and re-enable replication to trigger a full sync","is_correct":false},{"id":"D","text":"Use the AWS CLI to copy objects to the destination bucket","is_correct":false}]',
 'S3 replication only applies to new objects uploaded after the rule is enabled. S3 Batch Replication allows you to replicate existing objects, objects that previously failed replication, and objects replicated under a prior rule. It uses S3 Batch Operations under the hood.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 's3_replication', 4, 'A company needs S3 objects replicated to a destination bucket in the same region for compliance. The replicated objects must use a different storage class and be owned by a different AWS account. Which replication features are needed? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Same-Region Replication (SRR) with storage class override","is_correct":true},{"id":"B","text":"Replica ownership override to change the object owner to the destination account","is_correct":true},{"id":"C","text":"S3 Transfer Acceleration to speed up replication","is_correct":false},{"id":"D","text":"S3 Object Lock to protect replicated objects","is_correct":false}]',
 'Same-Region Replication supports replication within the same region. Storage class override changes the class of replicated objects. Replica ownership override transfers ownership to the destination bucket owner, which is required when replicating across accounts and the destination account needs full control.',
 '{"S3"}', 'seed');

-- Step Functions (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'step_functions', 3, 'A company has a multi-step order processing workflow: validate order, charge payment, reserve inventory, and send confirmation. If any step fails, the entire transaction must be rolled back. Which service is BEST suited?',
 'single',
 '[{"id":"A","text":"Amazon SQS with multiple queues","is_correct":false},{"id":"B","text":"AWS Step Functions with error handling and compensation logic","is_correct":true},{"id":"C","text":"AWS Lambda with chained invocations","is_correct":false},{"id":"D","text":"Amazon EventBridge with event rules","is_correct":false}]',
 'Step Functions provides built-in error handling with Catch and Retry states. A saga pattern can be implemented where each step has a compensating action (e.g., refund payment, release inventory). Chained Lambda calls lack orchestration visibility and error handling.',
 '{"Step Functions","Lambda"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'step_functions', 4, 'A data pipeline processes files uploaded to S3. It involves 5 independent transformation steps followed by a final aggregation step. The transformations can run concurrently. Which Step Functions feature optimizes this workflow?',
 'single',
 '[{"id":"A","text":"Choice state to select which transformation to run","is_correct":false},{"id":"B","text":"Parallel state to run all transformations simultaneously, followed by the aggregation step","is_correct":true},{"id":"C","text":"Map state iterating over a list of transformations","is_correct":false},{"id":"D","text":"Wait state between each transformation","is_correct":false}]',
 'The Parallel state runs multiple branches of execution simultaneously. All branches must succeed before the workflow continues. This is ideal for independent transformations that need to complete before aggregation. The Map state is for processing items in an array.',
 '{"Step Functions","S3","Lambda"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'step_functions', 3, 'A company needs a workflow that waits for a human approval step before proceeding with a deployment. The approval can take up to 7 days. Which Step Functions feature supports this?',
 'single',
 '[{"id":"A","text":"Wait state with a fixed duration of 7 days","is_correct":false},{"id":"B","text":"Task state with a callback pattern using a task token","is_correct":true},{"id":"C","text":"Choice state that checks an approval flag in DynamoDB","is_correct":false},{"id":"D","text":"Lambda function that polls for approval status","is_correct":false}]',
 'The callback pattern uses a task token. Step Functions pauses execution and generates a token that is sent to the approver (e.g., via SNS). When the approver responds, a SendTaskSuccess or SendTaskFailure call with the token resumes the workflow. This avoids polling.',
 '{"Step Functions","SNS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('resilient', 'step_functions', 5, 'A company processes millions of records daily through a Step Functions workflow. Each record requires a Lambda invocation. They are hitting the Step Functions state transition limit. Which approach resolves this while maintaining orchestration?',
 'single',
 '[{"id":"A","text":"Switch to Step Functions Express Workflows for high-volume processing","is_correct":true},{"id":"B","text":"Split the records into batches and run multiple Standard Workflow executions","is_correct":false},{"id":"C","text":"Replace Step Functions with SQS and Lambda","is_correct":false},{"id":"D","text":"Request a service quota increase for state transitions","is_correct":false}]',
 'Express Workflows support up to 100,000 state transitions per second and are designed for high-volume, short-duration workloads. Standard Workflows are limited to 5,000 state transitions per second per account. Express Workflows are more cost-effective for high-volume processing.',
 '{"Step Functions","Lambda"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: PERFORMANT (30 additional questions)
-- ═══════════════════════════════════════════════════════════════

-- EC2 Types (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ec2_types', 2, 'A company runs a memory-intensive in-memory caching application. Which EC2 instance family is MOST appropriate?',
 'single',
 '[{"id":"A","text":"C-family (compute optimized)","is_correct":false},{"id":"B","text":"R-family (memory optimized)","is_correct":true},{"id":"C","text":"T-family (burstable)","is_correct":false},{"id":"D","text":"M-family (general purpose)","is_correct":false}]',
 'R-family instances are memory optimized, providing high memory-to-CPU ratios. They are ideal for in-memory databases, caching, and real-time big data analytics. C-family is compute optimized. T-family provides burstable CPU.',
 '{"EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ec2_types', 3, 'A machine learning team needs to train deep learning models using GPU acceleration. Which EC2 instance family should they select?',
 'single',
 '[{"id":"A","text":"R-family (memory optimized)","is_correct":false},{"id":"B","text":"P-family (accelerated computing with GPU)","is_correct":true},{"id":"C","text":"I-family (storage optimized)","is_correct":false},{"id":"D","text":"Hpc-family (high performance computing)","is_correct":false}]',
 'P-family instances (e.g., p4d, p5) are equipped with NVIDIA GPUs optimized for machine learning training and inference. They provide high GPU memory and compute capability. The Hpc family is for tightly coupled HPC workloads, not GPU-accelerated ML.',
 '{"EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ec2_types', 4, 'A company runs a development environment with varying CPU usage patterns. Most of the time, the instances use less than 20% CPU but occasionally spike to 100% for short periods. Which instance type provides the MOST cost-effective solution?',
 'single',
 '[{"id":"A","text":"M5.large (general purpose)","is_correct":false},{"id":"B","text":"T3.large (burstable) with unlimited mode disabled","is_correct":true},{"id":"C","text":"C5.large (compute optimized)","is_correct":false},{"id":"D","text":"R5.large (memory optimized)","is_correct":false}]',
 'T3 burstable instances earn CPU credits during low-usage periods and spend them during spikes. With baseline usage under 20%, the instance accumulates credits for burst periods. This is significantly cheaper than fixed-performance instances for variable workloads. Unlimited mode should be disabled to avoid unexpected charges.',
 '{"EC2"}', 'seed');

-- EBS Volumes (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ebs_volumes', 3, 'A database application requires consistent low-latency performance with up to 64,000 IOPS. Which EBS volume type should be used?',
 'single',
 '[{"id":"A","text":"gp3 (General Purpose SSD)","is_correct":false},{"id":"B","text":"io2 Block Express (Provisioned IOPS SSD)","is_correct":true},{"id":"C","text":"st1 (Throughput Optimized HDD)","is_correct":false},{"id":"D","text":"sc1 (Cold HDD)","is_correct":false}]',
 'io2 Block Express volumes support up to 256,000 IOPS and are designed for the most demanding I/O-intensive workloads. gp3 volumes support up to 16,000 IOPS. For 64,000 IOPS, io2 is required. st1 and sc1 are HDD volumes with much lower IOPS.',
 '{"EBS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ebs_volumes', 4, 'A company needs a shared file system with sub-millisecond latency for a high-performance computing workload running on multiple EC2 instances. Which storage solution meets this requirement?',
 'single',
 '[{"id":"A","text":"Amazon EFS with Max I/O performance mode","is_correct":false},{"id":"B","text":"Amazon FSx for Lustre","is_correct":true},{"id":"C","text":"EBS io2 volumes with Multi-Attach","is_correct":false},{"id":"D","text":"S3 with S3 Select for fast queries","is_correct":false}]',
 'FSx for Lustre is a high-performance parallel file system designed for HPC workloads. It provides sub-millisecond latencies, high throughput, and can be shared across thousands of EC2 instances. EBS Multi-Attach is limited to the same AZ and a few instances.',
 '{"FSx","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'ebs_volumes', 3, 'A data analytics application needs to process large sequential datasets with high throughput. Cost is a primary concern and random I/O performance is not required. Which EBS volume type is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"gp3 (General Purpose SSD)","is_correct":false},{"id":"B","text":"st1 (Throughput Optimized HDD)","is_correct":true},{"id":"C","text":"io2 (Provisioned IOPS SSD)","is_correct":false},{"id":"D","text":"gp2 (General Purpose SSD)","is_correct":false}]',
 'st1 (Throughput Optimized HDD) provides low-cost, high-throughput storage ideal for sequential workloads like data warehousing and log processing. It offers up to 500 MiB/s throughput at a fraction of the cost of SSD volumes. It is not suitable for random I/O patterns.',
 '{"EBS"}', 'seed');

-- S3 Performance (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 's3_performance', 3, 'A company uploads 10 GB files to S3 from a remote office with limited bandwidth. Uploads frequently time out. How should they improve upload reliability?',
 'single',
 '[{"id":"A","text":"Use S3 Transfer Acceleration with multipart upload","is_correct":true},{"id":"B","text":"Increase the S3 bucket size limit","is_correct":false},{"id":"C","text":"Use S3 Batch Operations to upload files","is_correct":false},{"id":"D","text":"Enable S3 versioning to retry failed uploads","is_correct":false}]',
 'Multipart upload breaks large files into parts that can be uploaded in parallel and retried independently. S3 Transfer Acceleration uses CloudFront edge locations to speed up transfers over long distances. Together they significantly improve upload speed and reliability for large files.',
 '{"S3","CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 's3_performance', 4, 'A media company serves millions of read requests per second from S3. They experience occasional HTTP 503 Slow Down errors. How should they improve performance?',
 'single',
 '[{"id":"A","text":"Enable S3 Requester Pays to reduce load","is_correct":false},{"id":"B","text":"Distribute objects across multiple prefixes to parallelize requests","is_correct":true},{"id":"C","text":"Switch to S3 Intelligent-Tiering for better performance","is_correct":false},{"id":"D","text":"Enable S3 Object Lock to cache frequently accessed objects","is_correct":false}]',
 'S3 supports 5,500 GET requests per second per prefix. By distributing objects across multiple prefixes (e.g., using hash-based prefix naming), the aggregate throughput scales linearly. 503 errors indicate the request rate exceeds the prefix limit.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 's3_performance', 5, 'An application retrieves specific columns from large CSV files stored in S3. Currently, it downloads the entire file and parses it in the application. How can the application reduce latency and data transfer costs?',
 'single',
 '[{"id":"A","text":"Convert files to Parquet format and use S3 Select to query specific columns","is_correct":true},{"id":"B","text":"Use S3 Byte-Range Fetches to download specific byte offsets","is_correct":false},{"id":"C","text":"Move the files to EFS for faster random access","is_correct":false},{"id":"D","text":"Use CloudFront to cache the files closer to the application","is_correct":false}]',
 'S3 Select enables applications to retrieve only specific columns and rows from objects using SQL expressions. Parquet format is columnar, making column-based queries highly efficient. This reduces data transferred from S3 by up to 400% and improves query performance.',
 '{"S3"}', 'seed');

-- CloudFront (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'cloudfront', 2, 'A company serves static website content from an S3 bucket to users worldwide. Users in distant regions experience slow load times. Which service improves performance?',
 'single',
 '[{"id":"A","text":"S3 Transfer Acceleration","is_correct":false},{"id":"B","text":"Amazon CloudFront","is_correct":true},{"id":"C","text":"AWS Global Accelerator","is_correct":false},{"id":"D","text":"Amazon Route 53 latency-based routing","is_correct":false}]',
 'CloudFront caches content at edge locations worldwide. Users are served from the nearest edge location, significantly reducing latency. S3 Transfer Acceleration speeds up uploads to S3, not downloads to end users. Global Accelerator optimizes TCP/UDP traffic routing to AWS endpoints.',
 '{"CloudFront","S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'cloudfront', 3, 'A company uses CloudFront to serve dynamic API responses that vary by user. They notice high origin load because dynamic content is not cached. How can they improve cache hit ratio for the API?',
 'single',
 '[{"id":"A","text":"Increase the CloudFront TTL to 24 hours","is_correct":false},{"id":"B","text":"Configure CloudFront to forward only the necessary headers and query strings as cache keys","is_correct":true},{"id":"C","text":"Enable CloudFront Origin Shield","is_correct":false},{"id":"D","text":"Use Lambda@Edge to serve all responses from the edge","is_correct":false}]',
 'By default, CloudFront may forward unnecessary headers and query strings, creating unique cache keys for identical content. Minimizing the forwarded headers and query strings to only those that affect the response increases the cache hit ratio. Origin Shield adds a caching layer but doesn''t fix the cache key issue.',
 '{"CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'cloudfront', 4, 'A company serves content through CloudFront and wants to restrict access so only authenticated users can view certain content. The authentication is handled by an existing identity provider. Which CloudFront feature enables this?',
 'single',
 '[{"id":"A","text":"CloudFront Origin Access Control","is_correct":false},{"id":"B","text":"CloudFront signed URLs or signed cookies","is_correct":true},{"id":"C","text":"AWS WAF rules on the CloudFront distribution","is_correct":false},{"id":"D","text":"CloudFront field-level encryption","is_correct":false}]',
 'CloudFront signed URLs and signed cookies allow you to control who can access your content. The application authenticates users via the identity provider and then generates signed URLs/cookies. Unsigned requests are denied. OAC controls access between CloudFront and the origin, not end users.',
 '{"CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'cloudfront', 5, 'A global e-commerce site uses CloudFront with an ALB origin. During flash sales, the origin receives a spike of requests for the same product page, causing origin overload. Which TWO CloudFront features reduce origin load during these events? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Enable Origin Shield to consolidate origin requests through an additional caching layer","is_correct":true},{"id":"B","text":"Configure cache behaviors with appropriate TTLs and stale-while-revalidate headers","is_correct":true},{"id":"C","text":"Switch to a Network Load Balancer for better performance","is_correct":false},{"id":"D","text":"Enable CloudFront real-time logging to monitor traffic","is_correct":false}]',
 'Origin Shield adds a centralized caching layer that reduces duplicate origin requests from multiple edge locations. The stale-while-revalidate Cache-Control directive allows CloudFront to serve cached content while asynchronously revalidating in the background, reducing origin load during spikes.',
 '{"CloudFront","ALB"}', 'seed');

-- ElastiCache (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'elasticache', 3, 'A web application frequently queries the same data from RDS, causing high database load. The data changes infrequently. Which caching strategy reduces database load with the LEAST application changes?',
 'single',
 '[{"id":"A","text":"Use RDS read replicas","is_correct":false},{"id":"B","text":"Implement a lazy-loading (cache-aside) pattern with ElastiCache Redis","is_correct":true},{"id":"C","text":"Enable RDS query cache","is_correct":false},{"id":"D","text":"Use DynamoDB Accelerator (DAX)","is_correct":false}]',
 'The lazy-loading (cache-aside) pattern checks ElastiCache first; on cache miss, it queries the database and populates the cache. This reduces database load for frequently read, infrequently changing data. DAX is only for DynamoDB. RDS read replicas still query the database engine.',
 '{"ElastiCache","RDS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'elasticache', 4, 'A company needs a caching layer that supports complex data structures, pub/sub messaging, and automatic failover. Which ElastiCache engine and configuration should they use?',
 'single',
 '[{"id":"A","text":"ElastiCache Memcached with Auto Discovery","is_correct":false},{"id":"B","text":"ElastiCache Redis with cluster mode and Multi-AZ enabled","is_correct":true},{"id":"C","text":"ElastiCache Memcached in multiple AZs","is_correct":false},{"id":"D","text":"ElastiCache Redis in standalone mode","is_correct":false}]',
 'Redis supports complex data structures (lists, sets, sorted sets, hashes), pub/sub messaging, and Lua scripting. With cluster mode and Multi-AZ, it provides automatic failover and horizontal scaling. Memcached is simpler and lacks pub/sub and complex data structures.',
 '{"ElastiCache"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'elasticache', 5, 'A session management system stores user sessions in ElastiCache Redis. The company needs to ensure sessions are not lost during node failures while minimizing latency impact. Which configuration achieves this? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Enable Multi-AZ with automatic failover and at least one replica per shard","is_correct":true},{"id":"B","text":"Enable Redis append-only file (AOF) persistence","is_correct":true},{"id":"C","text":"Use Memcached with consistent hashing for session distribution","is_correct":false},{"id":"D","text":"Store sessions in S3 as a backup and restore on failure","is_correct":false}]',
 'Multi-AZ with replicas ensures automatic failover to a replica if the primary fails. AOF persistence provides durability by logging every write operation, allowing data recovery even if all nodes fail. Together they provide both high availability and durability for session data.',
 '{"ElastiCache"}', 'seed');

-- DynamoDB (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'dynamodb', 2, 'An application needs a NoSQL database that provides single-digit millisecond response times at any scale. Which AWS service should be used?',
 'single',
 '[{"id":"A","text":"Amazon RDS","is_correct":false},{"id":"B","text":"Amazon DynamoDB","is_correct":true},{"id":"C","text":"Amazon Redshift","is_correct":false},{"id":"D","text":"Amazon Neptune","is_correct":false}]',
 'DynamoDB is a fully managed NoSQL database that provides single-digit millisecond performance at any scale. It automatically manages the underlying infrastructure, partitioning, and replication. RDS is relational. Redshift is for analytics. Neptune is for graph data.',
 '{"DynamoDB"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'dynamodb', 3, 'An application reads the same DynamoDB items millions of times per day. The data does not change frequently. How can read performance be improved while reducing cost?',
 'single',
 '[{"id":"A","text":"Increase provisioned read capacity units","is_correct":false},{"id":"B","text":"Use DynamoDB Accelerator (DAX) for in-memory caching","is_correct":true},{"id":"C","text":"Enable DynamoDB Streams for faster reads","is_correct":false},{"id":"D","text":"Use strongly consistent reads for better performance","is_correct":false}]',
 'DAX is a fully managed, in-memory caching layer for DynamoDB that provides microsecond read latency. It transparently caches reads, reducing the number of requests to DynamoDB and lowering costs. Increasing capacity units does not reduce latency. Strongly consistent reads are slower and more expensive.',
 '{"DynamoDB","DAX"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'dynamodb', 4, 'A DynamoDB table has a partition key of "user_id" and receives uneven traffic. A small number of popular users generate most of the traffic, causing hot partitions. Which approach helps distribute the load?',
 'single',
 '[{"id":"A","text":"Add a random suffix to the partition key to spread writes across partitions","is_correct":true},{"id":"B","text":"Change the table to on-demand capacity mode","is_correct":false},{"id":"C","text":"Create a global secondary index on a different attribute","is_correct":false},{"id":"D","text":"Enable DynamoDB auto-scaling","is_correct":false}]',
 'Adding a random suffix (e.g., user_id#1, user_id#2) distributes writes for hot keys across multiple partitions. This technique is called write sharding. On-demand mode adapts to traffic patterns but does not solve hot partition issues caused by a skewed access pattern.',
 '{"DynamoDB"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'dynamodb', 5, 'A company needs to run complex aggregation queries across a DynamoDB table with billions of items. The queries involve filtering on non-key attributes and calculating sums and averages. DynamoDB scan operations are too slow and expensive. Which approach is MOST appropriate?',
 'single',
 '[{"id":"A","text":"Create multiple global secondary indexes to support each query pattern","is_correct":false},{"id":"B","text":"Export DynamoDB data to S3 and query it with Amazon Athena","is_correct":true},{"id":"C","text":"Use DynamoDB PartiQL for complex SQL queries","is_correct":false},{"id":"D","text":"Increase the provisioned read capacity to handle scan operations faster","is_correct":false}]',
 'DynamoDB is optimized for key-value access patterns, not analytical queries. Exporting data to S3 (via DynamoDB export or DynamoDB Streams) and querying with Athena provides serverless analytics at lower cost. PartiQL translates to DynamoDB operations and has the same limitations. GSIs help with specific access patterns, not arbitrary aggregations.',
 '{"DynamoDB","S3","Athena"}', 'seed');

-- EFS/FSx (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'efs_fsx', 3, 'A company has multiple EC2 instances in different Availability Zones that need to share the same file system for a content management application. Which storage solution is MOST appropriate?',
 'single',
 '[{"id":"A","text":"EBS volumes with Multi-Attach","is_correct":false},{"id":"B","text":"Amazon EFS","is_correct":true},{"id":"C","text":"S3 with S3 Mountpoint","is_correct":false},{"id":"D","text":"Instance store volumes","is_correct":false}]',
 'Amazon EFS provides a fully managed NFS file system that can be mounted concurrently by thousands of EC2 instances across multiple AZs. EBS Multi-Attach is limited to the same AZ and specific instance types. S3 is object storage, not a POSIX-compliant file system.',
 '{"EFS","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'efs_fsx', 4, 'A Windows-based application running on EC2 requires a shared file system with SMB protocol support and Active Directory integration. Which solution should the architect recommend?',
 'single',
 '[{"id":"A","text":"Amazon EFS","is_correct":false},{"id":"B","text":"Amazon FSx for Windows File Server","is_correct":true},{"id":"C","text":"Amazon FSx for Lustre","is_correct":false},{"id":"D","text":"S3 with a file gateway from AWS Storage Gateway","is_correct":false}]',
 'FSx for Windows File Server provides fully managed Windows-native file storage with SMB protocol, NTFS, Active Directory integration, and DFS namespaces. EFS uses NFS protocol and is designed for Linux workloads. FSx for Lustre is for HPC.',
 '{"FSx","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'efs_fsx', 4, 'A company uses Amazon EFS for a file-sharing workload. The files are accessed frequently for the first 30 days and rarely after that. How can they reduce storage costs while maintaining access to all files?',
 'single',
 '[{"id":"A","text":"Manually move older files to S3 Glacier","is_correct":false},{"id":"B","text":"Enable EFS lifecycle management to automatically move infrequently accessed files to EFS Infrequent Access (IA) storage class","is_correct":true},{"id":"C","text":"Create a separate EFS file system for archived files","is_correct":false},{"id":"D","text":"Use S3 Intelligent-Tiering instead of EFS","is_correct":false}]',
 'EFS lifecycle management automatically transitions files that have not been accessed for a configurable period (e.g., 30 days) to the EFS Infrequent Access storage class, which is up to 92% lower cost. Files are transparently moved back to Standard on next access.',
 '{"EFS"}', 'seed');

-- Global Accelerator (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'global_accel', 3, 'A gaming company hosts servers in multiple AWS regions. Players connect via TCP and experience high latency due to internet routing. Which service provides static IP addresses and optimized network paths to the nearest healthy endpoint?',
 'single',
 '[{"id":"A","text":"Amazon CloudFront","is_correct":false},{"id":"B","text":"AWS Global Accelerator","is_correct":true},{"id":"C","text":"Amazon Route 53 latency-based routing","is_correct":false},{"id":"D","text":"AWS Direct Connect","is_correct":false}]',
 'AWS Global Accelerator provides two static anycast IP addresses and routes TCP/UDP traffic over the AWS global network to the nearest healthy endpoint. This avoids the variability of internet routing. CloudFront is for HTTP/HTTPS content delivery, not general TCP/UDP.',
 '{"Global Accelerator"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'global_accel', 4, 'A company is evaluating whether to use CloudFront or Global Accelerator for their application. The application serves both HTTP API responses and non-HTTP TCP traffic for IoT devices. Which solution addresses both requirements?',
 'single',
 '[{"id":"A","text":"Use CloudFront for both HTTP and TCP traffic","is_correct":false},{"id":"B","text":"Use Global Accelerator for TCP traffic and CloudFront for HTTP caching","is_correct":true},{"id":"C","text":"Use Global Accelerator for both since it supports HTTP","is_correct":false},{"id":"D","text":"Use an NLB in each region with Route 53 latency routing","is_correct":false}]',
 'CloudFront only supports HTTP/HTTPS and WebSocket. Global Accelerator supports TCP and UDP. The optimal solution uses CloudFront for HTTP content (leveraging its caching) and Global Accelerator for non-HTTP TCP traffic (IoT). Each service has distinct strengths.',
 '{"Global Accelerator","CloudFront"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'global_accel', 4, 'A company wants to perform blue-green deployments across two ALBs using Global Accelerator. They want to gradually shift traffic from the blue to the green environment. Which Global Accelerator feature enables this?',
 'single',
 '[{"id":"A","text":"Health check thresholds","is_correct":false},{"id":"B","text":"Endpoint weights within an endpoint group","is_correct":true},{"id":"C","text":"Flow control settings","is_correct":false},{"id":"D","text":"Client affinity configuration","is_correct":false}]',
 'Global Accelerator supports endpoint weights (0-255) that determine the proportion of traffic routed to each endpoint. By adjusting weights between blue and green ALBs, traffic can be gradually shifted (e.g., 90% blue/10% green to 0%/100%). This enables safe blue-green deployments.',
 '{"Global Accelerator","ALB"}', 'seed');

-- Lambda Performance (4 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'lambda_perf', 2, 'A company deploys a Lambda function that experiences slow initial response times when invoked after a period of inactivity. What causes this behavior?',
 'single',
 '[{"id":"A","text":"Lambda memory is set too low","is_correct":false},{"id":"B","text":"Cold start latency from initializing a new execution environment","is_correct":true},{"id":"C","text":"The Lambda function exceeds the timeout limit","is_correct":false},{"id":"D","text":"The Lambda function has insufficient IAM permissions","is_correct":false}]',
 'Cold starts occur when Lambda creates a new execution environment, including downloading code, initializing the runtime, and running initialization code. This adds latency to the first invocation. Subsequent invocations reuse the warm environment.',
 '{"Lambda"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'lambda_perf', 3, 'A Lambda function processes API Gateway requests and requires consistent low latency. The function experiences frequent cold starts. Which feature eliminates cold start latency?',
 'single',
 '[{"id":"A","text":"Increase Lambda memory allocation","is_correct":false},{"id":"B","text":"Configure Provisioned Concurrency on the Lambda function","is_correct":true},{"id":"C","text":"Use Lambda layers to reduce deployment package size","is_correct":false},{"id":"D","text":"Enable Lambda SnapStart","is_correct":false}]',
 'Provisioned Concurrency keeps a specified number of execution environments initialized and ready to respond. This eliminates cold start latency entirely for those environments. SnapStart reduces cold start for Java runtimes specifically. Increasing memory gives more CPU but doesn''t prevent cold starts.',
 '{"Lambda","API Gateway"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'lambda_perf', 4, 'A Lambda function processes S3 events and makes calls to an external API. The function''s execution time is 8 seconds, mostly waiting for API responses. Increasing memory does not improve performance. How can the function''s performance be improved?',
 'single',
 '[{"id":"A","text":"Increase the Lambda timeout to 15 minutes","is_correct":false},{"id":"B","text":"Make API calls asynchronously using concurrent operations within the function","is_correct":true},{"id":"C","text":"Switch to a larger EC2 instance for the workload","is_correct":false},{"id":"D","text":"Use Lambda Destinations to chain the API calls","is_correct":false}]',
 'When a Lambda function spends most of its time waiting for I/O (network calls), parallelizing those calls using async/await with Promise.all (Node.js) or asyncio.gather (Python) can dramatically reduce execution time. Memory increases only help CPU-bound workloads.',
 '{"Lambda","S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('performant', 'lambda_perf', 5, 'A company uses Lambda functions behind an API Gateway. During sudden traffic spikes, some requests receive 429 (Too Many Requests) errors. The Lambda functions are within the account''s concurrency limit. Which TWO actions help handle traffic spikes? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Configure reserved concurrency for the Lambda function to guarantee available capacity","is_correct":true},{"id":"B","text":"Enable API Gateway throttling with a burst limit and configure SQS as a buffer","is_correct":true},{"id":"C","text":"Increase the Lambda function memory to process requests faster","is_correct":false},{"id":"D","text":"Deploy the API to multiple API Gateway stages","is_correct":false}]',
 'Reserved concurrency guarantees that a specific number of concurrent executions are available for the function, preventing other functions from consuming all available concurrency. API Gateway throttling with an SQS buffer smooths out traffic spikes by queueing excess requests rather than rejecting them.',
 '{"Lambda","API Gateway","SQS"}', 'seed');

-- ═══════════════════════════════════════════════════════════════
-- DOMAIN: COST (20 additional questions)
-- ═══════════════════════════════════════════════════════════════

-- EC2 Pricing (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'ec2_pricing', 2, 'A company runs a development environment that operates only during business hours (8 AM to 6 PM, Monday to Friday). Which EC2 pricing model is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"Reserved Instances with 1-year term","is_correct":false},{"id":"B","text":"On-Demand Instances started and stopped on a schedule","is_correct":true},{"id":"C","text":"Spot Instances","is_correct":false},{"id":"D","text":"Dedicated Hosts","is_correct":false}]',
 'For predictable schedules with less than 24/7 usage, On-Demand instances started and stopped on schedule (e.g., using AWS Instance Scheduler) are cost-effective. Reserved Instances are better for 24/7 workloads. Spot Instances can be interrupted unexpectedly.',
 '{"EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'ec2_pricing', 3, 'A company runs several workloads across different EC2 instance families (m5, c5, r5). They want to commit to a spend level for a 1-year term to receive discounts across all instance families. Which pricing option provides this flexibility?',
 'single',
 '[{"id":"A","text":"Standard Reserved Instances","is_correct":false},{"id":"B","text":"Compute Savings Plans","is_correct":true},{"id":"C","text":"Convertible Reserved Instances","is_correct":false},{"id":"D","text":"Spot Instances","is_correct":false}]',
 'Compute Savings Plans provide the most flexibility. They apply automatically to any EC2 instance regardless of region, family, OS, or tenancy. They also apply to Fargate and Lambda. Standard RIs are locked to a specific instance type and region. Convertible RIs allow changes but offer lower discounts.',
 '{"EC2","Savings Plans"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'ec2_pricing', 4, 'A company runs a critical batch processing job that takes exactly 4 hours to complete and must finish without interruption. The job runs daily. They currently use On-Demand instances. Which approach provides the BEST cost savings?',
 'single',
 '[{"id":"A","text":"Use Spot Instances with a Spot block (defined duration)","is_correct":false},{"id":"B","text":"Purchase a 1-year Savings Plan based on the hourly commitment for 4 hours of daily usage","is_correct":true},{"id":"C","text":"Use Spot Instances with checkpointing and retry logic","is_correct":false},{"id":"D","text":"Purchase Reserved Instances for the batch processing instance type","is_correct":false}]',
 'Savings Plans can save up to 72% compared to On-Demand. For a consistent 4-hour daily workload, the hourly commitment is calculated as 4/24 of the full instance cost. Spot blocks have been deprecated. Spot with retries risks not completing on time. RIs cover 24/7 and would be underutilized.',
 '{"EC2","Savings Plans"}', 'seed');

-- S3 Tiers (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 's3_tiers', 2, 'A company stores compliance documents that are accessed once or twice per year but must be retrievable within 12 hours. Which S3 storage class is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"S3 Standard","is_correct":false},{"id":"B","text":"S3 Glacier Flexible Retrieval","is_correct":true},{"id":"C","text":"S3 One Zone-IA","is_correct":false},{"id":"D","text":"S3 Glacier Deep Archive","is_correct":false}]',
 'S3 Glacier Flexible Retrieval offers low storage costs with retrieval times from minutes to 12 hours. Standard retrieval takes 3-5 hours. S3 Glacier Deep Archive is cheaper but has a minimum retrieval time of 12 hours. For documents that must be retrievable within 12 hours, Glacier Flexible Retrieval is the best fit.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 's3_tiers', 3, 'A company has an S3 bucket with millions of objects that have unpredictable access patterns. Some objects are accessed frequently for a few weeks and then rarely. They want to minimize costs without managing lifecycle policies. Which storage class should they use?',
 'single',
 '[{"id":"A","text":"S3 Standard","is_correct":false},{"id":"B","text":"S3 Intelligent-Tiering","is_correct":true},{"id":"C","text":"S3 Standard-IA","is_correct":false},{"id":"D","text":"S3 One Zone-IA","is_correct":false}]',
 'S3 Intelligent-Tiering automatically moves objects between access tiers based on usage patterns. It has no retrieval fees and a small monthly monitoring fee per object. It is ideal when access patterns are unknown or changing. Manual lifecycle policies require predicting access patterns.',
 '{"S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 's3_tiers', 4, 'A media company stores 500 TB of video content. Files are accessed frequently for the first 30 days, occasionally for the next 90 days, and rarely after that. They need to minimize costs while maintaining availability. Which lifecycle policy configuration is MOST cost-effective?',
 'single',
 '[{"id":"A","text":"Keep in S3 Standard forever","is_correct":false},{"id":"B","text":"Transition to S3 Standard-IA after 30 days, then to S3 Glacier Flexible Retrieval after 120 days","is_correct":true},{"id":"C","text":"Transition directly to S3 Glacier Deep Archive after 30 days","is_correct":false},{"id":"D","text":"Use S3 Intelligent-Tiering for all content","is_correct":false}]',
 'S3 lifecycle policies automate transitions between storage classes. Standard-IA is ideal for the 30-120 day period (lower cost, infrequent access). Glacier Flexible Retrieval is appropriate after 120 days for rare access. Deep Archive after 30 days would be too aggressive for content still occasionally accessed.',
 '{"S3"}', 'seed');

-- Reserved/Savings (2 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'reserved_savings', 3, 'A company wants to reduce their RDS costs for a production PostgreSQL database that runs 24/7 with a steady workload. They are committed to a 1-year term. Which option provides the MOST savings?',
 'single',
 '[{"id":"A","text":"RDS On-Demand pricing","is_correct":false},{"id":"B","text":"RDS Reserved Instance with all upfront payment for 1 year","is_correct":true},{"id":"C","text":"Aurora Serverless v2","is_correct":false},{"id":"D","text":"RDS Reserved Instance with no upfront payment for 1 year","is_correct":false}]',
 'RDS Reserved Instances with all upfront payment provide the highest discount (up to 40-60% savings). All upfront provides more savings than partial or no upfront because you pay for the entire term in advance. Aurora Serverless is cost-effective for variable workloads, not steady ones.',
 '{"RDS"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'reserved_savings', 4, 'A company purchased Standard Reserved Instances for m5.xlarge in us-east-1. They now want to change to c5.xlarge instances in us-west-2. Can they modify their reservation? (Select TWO correct statements)',
 'multi',
 '[{"id":"A","text":"Standard RIs cannot change instance family or region; they should have purchased Convertible RIs","is_correct":true},{"id":"B","text":"They can sell the unused Standard RIs on the EC2 Reserved Instance Marketplace","is_correct":true},{"id":"C","text":"Standard RIs automatically apply to any instance type in any region","is_correct":false},{"id":"D","text":"They can contact AWS Support to convert Standard RIs to Convertible RIs","is_correct":false}]',
 'Standard Reserved Instances are locked to a specific instance family and region. They can be modified within the same instance family (e.g., split m5.xlarge into 2x m5.large) but not changed to a different family or region. Convertible RIs allow exchanges. Unused Standard RIs can be sold on the RI Marketplace.',
 '{"EC2"}', 'seed');

-- Spot Instances (2 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'spot_instances', 3, 'A company runs a big data processing workload on EMR that is fault-tolerant and can handle node failures. They want to reduce compute costs by up to 90%. Which approach is recommended?',
 'single',
 '[{"id":"A","text":"Use Reserved Instances for all EMR nodes","is_correct":false},{"id":"B","text":"Use Spot Instances for core and task nodes with instance fleet diversification","is_correct":true},{"id":"C","text":"Use On-Demand instances with auto-termination after job completion","is_correct":false},{"id":"D","text":"Use Graviton instances for better price-performance","is_correct":false}]',
 'Spot Instances provide up to 90% savings over On-Demand. For EMR, using Spot for task nodes (and optionally core nodes with HDFS replication) with instance fleet diversification across multiple instance types reduces interruption risk. On-Demand should be used for the master node.',
 '{"EMR","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'spot_instances', 4, 'A company uses an Auto Scaling group with Spot Instances for a web application. They want to maintain availability even when Spot capacity is unavailable. Which strategy ensures application availability?',
 'single',
 '[{"id":"A","text":"Use a single instance type and increase the maximum Spot price","is_correct":false},{"id":"B","text":"Configure a mixed instances policy with multiple instance types and an On-Demand base capacity","is_correct":true},{"id":"C","text":"Create separate Auto Scaling groups for Spot and On-Demand","is_correct":false},{"id":"D","text":"Use Spot Fleet instead of Auto Scaling groups","is_correct":false}]',
 'A mixed instances policy in Auto Scaling allows specifying a base of On-Demand instances for guaranteed capacity with additional Spot instances for cost savings. Diversifying across multiple instance types increases the likelihood of obtaining Spot capacity. A single type is risky.',
 '{"Auto Scaling","EC2"}', 'seed');

-- Cost Explorer (2 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'cost_explorer', 3, 'A company wants to identify underutilized EC2 instances and receive recommendations for right-sizing. Which AWS tool provides these recommendations?',
 'single',
 '[{"id":"A","text":"AWS Budgets","is_correct":false},{"id":"B","text":"AWS Cost Explorer right-sizing recommendations","is_correct":true},{"id":"C","text":"AWS Trusted Advisor","is_correct":false},{"id":"D","text":"AWS CloudWatch dashboards","is_correct":false}]',
 'AWS Cost Explorer provides right-sizing recommendations based on historical usage. It analyzes CPU, memory, and network metrics to suggest instance type changes that reduce cost while meeting workload requirements. Trusted Advisor also flags underutilized instances but Cost Explorer provides more detailed recommendations.',
 '{"Cost Explorer","EC2"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'cost_explorer', 4, 'A company wants to receive alerts when their monthly AWS spending exceeds predefined thresholds. They also want forecasted spend alerts. Which service provides this?',
 'single',
 '[{"id":"A","text":"AWS Cost Explorer","is_correct":false},{"id":"B","text":"AWS Budgets with actual and forecasted spend alerts","is_correct":true},{"id":"C","text":"AWS CloudTrail cost tracking","is_correct":false},{"id":"D","text":"Amazon CloudWatch billing alarms only","is_correct":false}]',
 'AWS Budgets supports both actual spend alerts (when you exceed a threshold) and forecasted spend alerts (when projected spending is expected to exceed the budget). CloudWatch billing alarms support actual spend only, not forecasted. Cost Explorer visualizes costs but does not send threshold alerts.',
 '{"Budgets","SNS"}', 'seed');

-- Data Transfer (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'data_transfer', 3, 'A company has high data transfer costs between EC2 instances in different Availability Zones. The instances need to communicate frequently. How can they reduce inter-AZ data transfer costs?',
 'single',
 '[{"id":"A","text":"Use VPC peering between AZs","is_correct":false},{"id":"B","text":"Place the communicating instances in the same Availability Zone","is_correct":true},{"id":"C","text":"Use AWS PrivateLink for all inter-AZ communication","is_correct":false},{"id":"D","text":"Enable S3 Transfer Acceleration for inter-instance traffic","is_correct":false}]',
 'Data transfer between instances in the same AZ using private IP addresses is free. Cross-AZ data transfer is charged per GB. If high-frequency communication is required, co-locating instances in the same AZ eliminates these costs (though this reduces availability).',
 '{"EC2","VPC"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'data_transfer', 4, 'A company serves global users from an S3 origin and has high data transfer costs from S3 to the internet. Which service can reduce these costs while improving performance?',
 'single',
 '[{"id":"A","text":"S3 Transfer Acceleration","is_correct":false},{"id":"B","text":"Amazon CloudFront with S3 as the origin","is_correct":true},{"id":"C","text":"AWS Direct Connect","is_correct":false},{"id":"D","text":"S3 Requester Pays buckets","is_correct":false}]',
 'CloudFront data transfer to the internet is cheaper than direct S3 data transfer. CloudFront also reduces the number of requests to S3 through caching. Transfer from S3 to CloudFront is free. This combination reduces both cost and latency.',
 '{"CloudFront","S3"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'data_transfer', 5, 'A company transfers 50 TB of data monthly from their on-premises data center to AWS. They currently use VPN over the internet and face high bandwidth costs. Which solution reduces ongoing data transfer costs? (Select TWO)',
 'multi',
 '[{"id":"A","text":"Establish an AWS Direct Connect connection for dedicated private connectivity","is_correct":true},{"id":"B","text":"Use S3 multipart upload over the VPN to reduce costs","is_correct":false},{"id":"C","text":"Compress data before transfer to reduce the volume of transferred bytes","is_correct":true},{"id":"D","text":"Use AWS Snowball for the monthly transfers","is_correct":false}]',
 'Direct Connect provides dedicated private connectivity with lower data transfer rates compared to internet-based transfer. Compressing data reduces the volume of bytes transferred, directly lowering costs. Snowball is for large one-time migrations, not monthly recurring transfers. Multipart upload improves reliability but not cost.',
 '{"Direct Connect","S3"}', 'seed');

-- Right-sizing (2 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'right_sizing', 3, 'A company has several m5.2xlarge EC2 instances running at an average CPU utilization of 10%. What should the solutions architect recommend to reduce costs?',
 'single',
 '[{"id":"A","text":"Switch to Spot Instances","is_correct":false},{"id":"B","text":"Right-size the instances to a smaller type such as m5.large based on actual usage","is_correct":true},{"id":"C","text":"Purchase Reserved Instances for the current instance type","is_correct":false},{"id":"D","text":"Enable Auto Scaling to add more instances","is_correct":false}]',
 'At 10% CPU utilization, the instances are significantly oversized. Right-sizing to a smaller instance type (e.g., m5.large) reduces cost while still meeting performance requirements. Purchasing RIs for oversized instances locks in wasted spend. Auto Scaling adds more capacity, not reduces it.',
 '{"EC2","Cost Explorer"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'right_sizing', 4, 'A company wants to continuously monitor and automatically right-size their EC2 instances and Auto Scaling groups. Which AWS service provides machine-learning-based recommendations for optimal instance types?',
 'single',
 '[{"id":"A","text":"AWS Trusted Advisor","is_correct":false},{"id":"B","text":"AWS Compute Optimizer","is_correct":true},{"id":"C","text":"AWS Config","is_correct":false},{"id":"D","text":"Amazon CloudWatch Anomaly Detection","is_correct":false}]',
 'AWS Compute Optimizer uses machine learning to analyze historical utilization metrics and provide recommendations for optimal EC2 instance types, EBS volume types, and Lambda function memory configurations. It considers CPU, memory, network, and storage metrics.',
 '{"Compute Optimizer","EC2"}', 'seed');

-- Serverless Cost (3 questions)

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'serverless_cost', 3, 'A company runs a REST API that receives 100 requests per day. They currently use a t3.medium EC2 instance running 24/7. How can they reduce costs while maintaining the API?',
 'single',
 '[{"id":"A","text":"Switch to a t3.nano instance","is_correct":false},{"id":"B","text":"Migrate the API to Lambda and API Gateway for a serverless, pay-per-request model","is_correct":true},{"id":"C","text":"Purchase a Reserved Instance for the t3.medium","is_correct":false},{"id":"D","text":"Move to a Spot Instance","is_correct":false}]',
 'With only 100 requests per day, a serverless architecture (Lambda + API Gateway) is dramatically cheaper than running an EC2 instance 24/7. Lambda charges per invocation and execution duration. At this low volume, the cost would be nearly zero. Even a t3.nano running 24/7 costs more.',
 '{"Lambda","API Gateway"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'serverless_cost', 4, 'A company uses Lambda functions with 1 GB memory allocation. CloudWatch metrics show the functions use only 200 MB of memory and complete in 500ms. How can they optimize Lambda costs?',
 'single',
 '[{"id":"A","text":"Reduce the memory allocation to 256 MB","is_correct":false},{"id":"B","text":"Use AWS Lambda Power Tuning to find the optimal memory configuration that balances cost and performance","is_correct":true},{"id":"C","text":"Switch to Provisioned Concurrency to reduce per-invocation costs","is_correct":false},{"id":"D","text":"Increase the timeout to batch more work per invocation","is_correct":false}]',
 'Lambda Power Tuning is an open-source tool that tests your function with different memory configurations and plots cost vs. performance. Reducing memory reduces cost but also reduces CPU allocation, potentially increasing execution time. The optimal memory balances both factors. Simply matching memory to usage ignores the CPU-memory coupling in Lambda.',
 '{"Lambda","CloudWatch"}', 'seed');

INSERT INTO questions (domain_id, topic_id, difficulty, question_text, question_type, options, explanation, aws_services, source) VALUES
('cost', 'serverless_cost', 5, 'A company has a DynamoDB table provisioned with 10,000 RCUs and 5,000 WCUs. CloudWatch shows the actual utilization averages 2,000 RCUs and 1,000 WCUs with occasional spikes to 8,000 RCUs. Which approach MOST effectively reduces costs while handling spikes?',
 'single',
 '[{"id":"A","text":"Reduce provisioned capacity to match average usage","is_correct":false},{"id":"B","text":"Switch to DynamoDB on-demand capacity mode","is_correct":false},{"id":"C","text":"Use DynamoDB auto-scaling with a target utilization of 70% and a reserved capacity for the base load","is_correct":true},{"id":"D","text":"Add DAX to cache reads and reduce provisioned RCUs","is_correct":false}]',
 'Auto-scaling adjusts provisioned capacity based on actual usage, scaling up for spikes and down during quiet periods. Setting a 70% target utilization leaves headroom for sudden spikes. Purchasing reserved capacity for the base load (2,000 RCU / 1,000 WCU) provides additional savings. On-demand is more expensive for predictable base loads.',
 '{"DynamoDB"}', 'seed');
