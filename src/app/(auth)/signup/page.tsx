'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle, Eye, EyeOff, Shield, Zap, Brain } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { STOCK_IMAGES } from '@/lib/animations'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-sm border-border/50">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click it to activate your account.
            </p>
            <Link href="/login">
              <Button variant="outline" className="mt-2">Back to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - image + value props */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={STOCK_IMAGES.dataCenter}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl">CertForge</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Join <span className="text-primary">10,000+</span> engineers who passed
            </h2>
            <div className="space-y-4">
              {[
                { icon: Brain, text: 'FSRS spaced repetition — study 60% less' },
                { icon: Zap, text: 'AI adapts to your weak areas automatically' },
                { icon: Shield, text: '94% first-attempt pass rate' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start studying for AWS SAA-C03 — free forever
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
              </div>
              <Button type="submit" className="w-full h-10 shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
