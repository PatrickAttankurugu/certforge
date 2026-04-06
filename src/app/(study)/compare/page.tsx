'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeftRight, Loader2 } from 'lucide-react'

const AWS_SERVICES = [
  'S3', 'EBS', 'EFS', 'FSx',
  'EC2', 'Lambda', 'ECS', 'EKS', 'Fargate',
  'RDS', 'DynamoDB', 'Aurora', 'ElastiCache', 'Redshift', 'Neptune',
  'SQS', 'SNS', 'EventBridge', 'Kinesis', 'Step Functions',
  'CloudFront', 'Global Accelerator', 'Route 53', 'API Gateway', 'ALB', 'NLB',
  'VPC', 'Transit Gateway', 'Direct Connect', 'VPN',
  'IAM', 'Cognito', 'KMS', 'Secrets Manager', 'WAF', 'Shield',
  'CloudWatch', 'CloudTrail', 'X-Ray', 'Config',
  'CloudFormation', 'CDK', 'Elastic Beanstalk', 'SAM',
  'SageMaker', 'Bedrock', 'Rekognition',
  'Glue', 'Athena', 'EMR', 'Lake Formation',
]

export default function ComparePage() {
  const [serviceA, setServiceA] = useState('')
  const [serviceB, setServiceB] = useState('')
  const [comparison, setComparison] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = useCallback(async () => {
    if (!serviceA || !serviceB || serviceA === serviceB) return
    setLoading(true)
    setError(null)
    setComparison('')

    try {
      const res = await fetch('/api/study/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_a: serviceA, service_b: serviceB }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to generate comparison')
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('Streaming not supported')
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setComparison(accumulated)
      }

      setLoading(false)
    } catch {
      setError('Failed to connect. Please try again.')
      setLoading(false)
    }
  }, [serviceA, serviceB])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          AWS Service Comparison
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare any two AWS services side by side for the SAA-C03 exam
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label htmlFor="service-a" className="text-xs font-medium">Service A</label>
              <select
                id="service-a"
                value={serviceA}
                onChange={(e) => setServiceA(e.target.value)}
                className="block w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a service...</option>
                {AWS_SERVICES.map((s) => (
                  <option key={s} value={s} disabled={s === serviceB}>{s}</option>
                ))}
              </select>
            </div>

            <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0 mb-2" />

            <div className="space-y-1 flex-1 min-w-[150px]">
              <label htmlFor="service-b" className="text-xs font-medium">Service B</label>
              <select
                id="service-b"
                value={serviceB}
                onChange={(e) => setServiceB(e.target.value)}
                className="block w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a service...</option>
                {AWS_SERVICES.map((s) => (
                  <option key={s} value={s} disabled={s === serviceA}>{s}</option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleCompare}
              disabled={loading || !serviceA || !serviceB || serviceA === serviceB}
              size="sm"
              className="shrink-0"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Comparing...</>
              ) : (
                'Compare'
              )}
            </Button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Quick comparison pairs */}
      {!comparison && !loading && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Popular Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                ['SQS', 'SNS'],
                ['RDS', 'DynamoDB'],
                ['ALB', 'NLB'],
                ['S3', 'EBS'],
                ['Lambda', 'Fargate'],
                ['ElastiCache', 'DynamoDB'],
                ['CloudFront', 'Global Accelerator'],
                ['Aurora', 'RDS'],
                ['ECS', 'EKS'],
                ['KMS', 'Secrets Manager'],
              ].map(([a, b]) => (
                <Button
                  key={`${a}-${b}`}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setServiceA(a)
                    setServiceB(b)
                  }}
                >
                  {a} vs {b}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison result */}
      {(comparison || loading) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {serviceA} vs {serviceB}
              {loading && <Loader2 className="inline h-4 w-4 ml-2 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !comparison && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {comparison && (
              <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {comparison}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
